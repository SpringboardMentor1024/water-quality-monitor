import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MonitorProfile from "./pages/MonitorProfile";

// Define the four possible application views
const VIEWS = {
  PROFILE: 'monitor_profile',
  LOGIN: 'login',
  REGISTER: 'register',
  DASHBOARD: 'dashboard'
};

function App() {
  // Set initial state to the MonitorProfile page
  const [currentView, setCurrentView] = useState(VIEWS.PROFILE); 
  const [isLoadingSession, setIsLoadingSession] = useState(true); // New loading state for session check

  // --- Session Check on Component Mount ---
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // If a token exists, assume the user is authenticated and navigate to the Dashboard
      setCurrentView(VIEWS.DASHBOARD);
      console.log("Found existing session token. Starting in Dashboard view.");
    } else {
      // No token found, remain on the public Monitor Profile page
      setCurrentView(VIEWS.PROFILE);
    }
    
    setIsLoadingSession(false); // Session check complete
  }, []); 

  // --- Handlers ---
  const handleLoginSuccess = () => setCurrentView(VIEWS.DASHBOARD);
  
  const handleLogout = () => {
    // Clear session storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Also clear stored user data
    
    setCurrentView(VIEWS.PROFILE); // Navigate back to the Monitor Profile page
  };

  // NEW: Universal function to navigate back to the public Monitor Profile page
  const handleGoToProfile = () => {
    // If the user was logged in, this clears the session token upon logging out.
    // Otherwise, it just handles navigation.
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); 
    
    setCurrentView(VIEWS.PROFILE);
  };

  // --- Render Logic ---
  const renderContent = () => {
    // Show a blank screen while checking the session token
    if (isLoadingSession) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950 text-cyan-400 text-lg font-semibold">
                Loading session...
            </div>
        );
    }
    
    switch (currentView) {
      
      case VIEWS.PROFILE: 
        return (
          <MonitorProfile
            onSwitchToLogin={() => setCurrentView(VIEWS.LOGIN)}
            onSwitchToRegister={() => setCurrentView(VIEWS.REGISTER)}
          />
        );
        
      case VIEWS.LOGIN:
        return (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setCurrentView(VIEWS.REGISTER)}
            onGoBack={handleGoToProfile}
          />
        );
      case VIEWS.REGISTER:
        return (
          <Register 
            onRegisterSuccess={handleLoginSuccess} 
            onSwitchToLogin={() => setCurrentView(VIEWS.LOGIN)}
            onGoBack={handleGoToProfile}
          />
        );
      case VIEWS.DASHBOARD:
        return <Dashboard onLogout={handleLogout} />;
      default:
        // Default to Monitor Profile if something goes wrong
        return <MonitorProfile
                  onSwitchToLogin={() => setCurrentView(VIEWS.LOGIN)}
                  onSwitchToRegister={() => setCurrentView(VIEWS.REGISTER)}
                />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
}

export default App;