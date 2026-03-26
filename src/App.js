import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import SearchPeople from "./pages/SearchPeople";
import AcceptRequest from "./pages/AcceptRequest";
import FollowUnfollowUsers from "./pages/FollowUnfollowUsers";

function App() {
  const isLoggedIn = localStorage.getItem("loggedInUser");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profilePage" element={<ProfilePage />} />
        <Route path="/searchPeople" element={<SearchPeople />} />
        <Route path="/acceptRequest" element={<AcceptRequest />} />
        <Route path="/followUnfollowUsers" element={<FollowUnfollowUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
