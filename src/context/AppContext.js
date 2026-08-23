import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { authAPI, settingsAPI } from "../api";

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export default function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gl_user") || "null");
    } catch {
      return null;
    }
  });
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("licem_settings") || "null"); } catch { return null; }
  });
  const [dark, setDark] = useState(
    () => localStorage.getItem("gl_dark") === "1",
  );
  const [toast, setToast] = useState(null);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [announcementHeight, setAnnouncementHeight] = useState(42);
  const radioAudioRef = useRef(null);
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [radioLoading, setRadioLoading] = useState(false);
  const [radioError, setRadioError] = useState("");

  const pageTopPadding = announcementVisible ? 70 + announcementHeight : 70;
  const PATH_TO_PAGE = {
    "/": "home",
    "/about": "about",
    "/sermons": "sermons",
    "/events": "events",
    "/gallery": "gallery",
    "/radio": "radio",
    "/prayer-wall": "prayer",
    "/blog": "blog",
    "/books": "books",
    "/devotionals": "devotionals",
    "/give": "give",
    "/contact": "contact",
    "/testimonies": "testimonies",
    "/connect": "connect",
  };
  const PAGE_TO_PATH = Object.fromEntries(
    Object.entries(PATH_TO_PAGE).map(([path, pageName]) => [pageName, path]),
  );
  const getPageFromLocation = () => PATH_TO_PAGE[window.location.pathname] || "home";
  const [page, setPageState] = useState(getPageFromLocation);

  const setPage = useCallback((nextPage, { replace = false } = {}) => {
    const normalizedPage = PAGE_TO_PATH[nextPage] ? nextPage : "home";
    const nextPath = PAGE_TO_PATH[normalizedPage];
    if (window.location.pathname !== nextPath) {
      const method = replace ? "replaceState" : "pushState";
      window.history[method]({ page: normalizedPage }, "", nextPath);
    }
    setPageState(normalizedPage);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const handlePopState = () => setPageState(getPageFromLocation());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Dark mode
  useEffect(() => {
    document.body.className = dark ? "dark" : "";
    localStorage.setItem("gl_dark", dark ? "1" : "0");
  }, [dark]);

  // Load site settings on mount
  useEffect(() => {
    settingsAPI
      .get()
      .then((r) => { setSettings(r.data); localStorage.setItem("licem_settings", JSON.stringify(r.data)); })
      .catch(() => {});
  }, []);

  // LICEM branding is fixed across runtime settings and cannot fall back to the placeholder.
  useEffect(() => {
    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/png";
    link.rel = "icon";
    link.href = "/assets/licem-favicon.png";
    document.head.appendChild(link);
    document.title = "LICEM";
  }, []);

  const startRadio = useCallback(async () => {
    const url = settings?.radioStreamUrl || "";
    if (!url) { setRadioError("Radio stream is not configured yet."); return false; }
    setRadioError("");
    setRadioLoading(true);
    try {
      if (!radioAudioRef.current) radioAudioRef.current = new Audio();
      radioAudioRef.current.src = url;
      radioAudioRef.current.preload = "none";
      radioAudioRef.current.volume = Number(localStorage.getItem("licem_radio_volume") || 0.8);
      await radioAudioRef.current.play();
      setRadioPlaying(true);
      return true;
    } catch {
      setRadioError("Tap Listen Live to start the stream in your browser.");
      return false;
    } finally { setRadioLoading(false); }
  }, [settings]);

  const stopRadio = useCallback(() => {
    radioAudioRef.current?.pause();
    setRadioPlaying(false);
  }, []);

  const setRadioVolume = useCallback((value) => {
    localStorage.setItem("licem_radio_volume", String(value));
    if (radioAudioRef.current) radioAudioRef.current.volume = value;
  }, []);

  useEffect(() => () => radioAudioRef.current?.pause(), []);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await authAPI.login({ email, password });
    localStorage.setItem("gl_token", r.data.token);
    localStorage.setItem("gl_user", JSON.stringify(r.data.user));
    setUser(r.data.user);
    return r.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("gl_token");
    localStorage.removeItem("gl_user");
    setUser(null);
    setPage("home");
  }, []);

  return (
    <AppCtx.Provider
      value={{
        user,
        settings,
        dark,
        setDark,
        toast,
        showToast,
        page,
        setPage,
        login,
        logout,
        setSettings,
        announcementVisible,
        setAnnouncementVisible,
        announcementHeight,
        setAnnouncementHeight,
        pageTopPadding,
        radioPlaying,
        radioLoading,
        radioError,
        startRadio,
        stopRadio,
        setRadioVolume,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}
