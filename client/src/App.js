import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navBar/navBar';
import LoginPage from './components/Login/Login';
import RegisterPage from './components/Register/Register';
import Profile from './components/ProfileManagement/profileManagement';
import Events from './components/EventManagement/eventManagement';
import UserEventsPage from './components/userEvents/userEvents';
import AdminHistory from './components/adminHistory/adminHistory';
import UserHistory from './components/userHistory/userHistory';
import VolunteerMatchingForm from './components/volunteerMatching/matchingForm';
import AdminNotifications from './components/adminNotifications/adminNotifications';
import UserNotifications from './components/userNotifications/userNotifications';
import AdminPromotions from './components/adminPromotions/adminPromotions';
import Reports from './components/reports/reports';
import logo from './images/volunLogo.png';
import './App.css';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-Logo" alt="logo"/>
        <h3>Welcome!</h3>
      </header>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedInUser')));
  const [update, setUpdate] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    setUpdate(!update);
    
    window.location.href = '/';
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('loggedInUser')));
  }, [update]);

  const isLoggedIn = user != null;
  let links = [["", "Home"], ["Login", "Login"], ["Register", "Register"]];
  if (isLoggedIn) {
    if (user.role === 'admin') {
      links = [["", "Home"], ["Profile", "User Profile"], ["Events", "Event Management"], ["volunteerMatching", "Match Volunteers"], ["AdminHistory", "Volunteer History"], ["AdminNotifications", "Notifications"], ["AdminPromotions", "Promotions"], ["Reports", "Reports"], ["Logout", "Logout"]];
    } else {
      links = [["", "Home"], ["Profile", "User Profile"], ["UserEventsPage", "View Events"], ["userHistory", "My History"], ["UserNotifications", "Notifications"], ["Logout", "Logout"]];
    }
  }

  return (
    <Router>
      <Navbar links={links.map(link => link[0] === "Logout" ? { path: link[0], label: link[1], onClick: handleLogout } : { path: link[0], label: link[1] })} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUpdate={setUpdate}/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/userEventsPage" element={<UserEventsPage />} />
        <Route path="/AdminHistory" element={<AdminHistory />} />
        <Route path="/UserHistory" element={<UserHistory />} />
        <Route path="/VolunteerMatching" element={<VolunteerMatchingForm />} />
        <Route path="/AdminNotifications" element={<AdminNotifications />} />
        <Route path="/AdminPromotions" element={<AdminPromotions />} />
        <Route path="/UserNotifications" element={<UserNotifications />} />
        <Route path="/Reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;