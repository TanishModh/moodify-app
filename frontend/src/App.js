import React, { useEffect, useContext, useState } from "react";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ResultsPage from "./pages/ResultsPage";
import EnhancedRecommendationsPage from "./pages/EnhancedRecommendationsPage";
import MobileRecommendations from "./pages/MobileRecommendations";
import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFoundPage";
import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import AboutPage from "./pages/AboutPage";
import LogoutPage from "./pages/LogoutPage";
import { DarkModeProvider, DarkModeContext } from "./context/DarkModeContext";
import ScrollToTop from './components/ScrollToTop';
import "./styles/styles.css";
import "./styles/blob.css";

function App() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isMobileOrGitHubPages, setIsMobileOrGitHubPages] = useState(false);

  useEffect(() => {
    // Detect GitHub Pages or mobile device
    const isGitHubPages = window.location.hostname.includes('github.io');
    const isMobileDevice = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
    setIsMobileOrGitHubPages(isGitHubPages || isMobileDevice);
    
    console.log("Environment detection:", {
      isGitHubPages,
      isMobileDevice,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent,
      windowWidth: window.innerWidth
    });
  }, []);

  // Change the background color of the root div based on dark mode
  useEffect(() => {
    const root = document.getElementById("root");
    root.style.backgroundColor = isDarkMode ? "#121212" : "#f5f5f5"; // Dark mode and light mode colors
  }, [isDarkMode]);

  return (
    <Router>
      <div id="blob"></div>
      <div id="blur"></div>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/recommendations" element={isMobileOrGitHubPages ? <MobileRecommendations /> : <EnhancedRecommendationsPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default function AppWithProvider() {
  return (
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  );
}
