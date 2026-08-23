import { useApp } from "../context/AppContext";
export default function ShareButton({ title, text, path }) {
  const { showToast } = useApp();
  const share = async () => {
    const url = `${window.location.origin}${path || window.location.pathname}`;
    try { if (navigator.share) await navigator.share({ title, text, url }); else { await navigator.clipboard.writeText(url); showToast("Link copied to clipboard."); } } catch (error) { if (error?.name !== "AbortError") showToast("Could not share this link.", "error"); }
  };
  return <button className="btn btn-ghost btn-sm" onClick={share} aria-label={`Share ${title}`}><span aria-hidden="true">↗</span> Share</button>;
}
