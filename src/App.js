import { useEffect } from "react";
import AppProvider, { useApp } from "./context/AppContext";
import { ToastDisplay } from "./components/UI";
import PublicNav from "./components/PublicNav";
import AnnouncementBar from "./components/AnnouncementBar";
import AdminAnnouncements from "./components/AdminAnnouncements";
import FloatingActions from "./components/FloatingActions";
import Footer from "./components/Footer";

// Public pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SermonsPage from "./pages/SermonsPage";
import EventsPage from "./pages/EventsPage";
import GalleryPage from "./pages/GalleryPage";
import BlogPage from "./pages/BlogPage";
import GivePage from "./pages/GivePage";
import ContactPage from "./pages/ContactPage";
import PrayerWallPage from "./pages/PrayerWallPage";
import TestimoniesPage from "./pages/TestimoniesPage";
import Connectpage from "./pages/ConnectPage";

// Admin
import AdminApp from "./admin/AdminApp";

function Router() {
  const { page } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (page === "admin") return <AdminApp />;

  const publicPages = {
    home: <HomePage />,
    about: <AboutPage />,
    sermons: <SermonsPage />,
    events: <EventsPage />,
    gallery: <GalleryPage />,
    blog: <BlogPage />,
    give: <GivePage />,
    contact: <ContactPage />,
    prayer: <PrayerWallPage />,
    testimonies: <TestimoniesPage />,
    connect: <Connectpage />,
    announcements: <AdminAnnouncements />,
  };

  return (
    // <div
    //   style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    // >
    //   <PublicNav />
    //   <AnnouncementBar />
    //   <main style={{ flex: 1 }}>{publicPages[page] || <HomePage />}</main>
    //   <Footer />
    //   <FloatingActions />
    //   <ToastDisplay />
    // </div>
    
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 200,
    }}>
      <AnnouncementBar />
      <PublicNav />
    </div>
    <main style={{ flex: 1 }}>
      {publicPages[page] || <HomePage />}
    </main>
    <Footer />
    <FloatingActions />
    <ToastDisplay />
  </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
