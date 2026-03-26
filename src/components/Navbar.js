import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ username, userId }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
const [requests, setRequests] = useState([]);

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

   const getRequestCount = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/userRequest/getRequest",
      { userIdGetRequest: userId }
    );

    if (response.data.msgcode === 200) {
      setRequests(response.data.data);
      setRequestCount(response.data.data.length);
    }

  } catch (error) {
    console.error("Error fetching request count:", error);
  }
};

useEffect(() => {
    if (userId) {
      getRequestCount();
    }
  }, [userId]);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000
      }}
    >
      <div className="container">
        {/* Use navigate instead of href (no refresh) */}
        <span
          className="navbar-brand fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          Mini Social
        </span>

        <div className="d-flex align-items-center">
          <div
            style={{ position: "relative", marginRight: "20px", cursor: "pointer" }}
            onClick={() => navigate("/acceptRequest")}
            onMouseEnter={() => setShowNotifications(true)}
            onMouseLeave={() => setShowNotifications(false)}
          >
            ❤️

            {requestCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-10px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px"
                }}
              >
                {requestCount}
              </span>
            )}

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  top: "30px",
                  right: "0",
                  width: "300px",
                  background: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  padding: "10px",
                  zIndex: 2000
                }}
              >
                <h6 style={{ borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
                  Notifications
                </h6>

                {/* {requests.length === 0 ? (
                  <p style={{ fontSize: "14px" }}>No requests</p>
                ) : (
                  requests.map((req) => (
                    <div
                      key={req.requestId}
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #f0f0f0",
                        fontSize: "14px"
                      }}
                    >
                      <strong>{req.userLoginId}</strong> sent request
                    </div>
                  ))
                )} */}
              </div>
            )}
          </div>
          <span className="text-white me-3">
            Hi, {username} 👋
          </span>

          <button
            className="btn btn-light btn-sm"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
