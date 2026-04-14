import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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
  const [settings, setSettings] = useState(null);
  const [dark, setDark] = useState(
    () => localStorage.getItem("gl_dark") === "1",
  );
  const [toast, setToast] = useState(null);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [announcementHeight, setAnnouncementHeight] = useState(42);

  const pageTopPadding = announcementVisible ? 70 + announcementHeight : 70;
  const [page, setPage] = useState("home");

  // Dark mode
  useEffect(() => {
    document.body.className = dark ? "dark" : "";
    localStorage.setItem("gl_dark", dark ? "1" : "0");
  }, [dark]);

  // Load site settings on mount
  useEffect(() => {
    settingsAPI
      .get()
      .then((r) => setSettings(r.data))
      .catch(() => {});
  }, []);

  // Apply favicon from settings
  useEffect(() => {
    if (!settings) return;
    let link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    if (settings.faviconType === "url" && settings.faviconUrl) {
      link.href = settings.faviconUrl;
    } else {
      const emoji = settings.faviconEmoji || "✝️";
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
      link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }
    document.head.appendChild(link);
    if (settings.siteName) document.title = settings.siteName;
  }, [settings]);

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
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}
