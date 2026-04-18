import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const SearchPeople = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = loggedInUser?.userId;
  const userOfficialName = loggedInUser?.userOfficialName || "Guest";

  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/getALLProfileDetails",
        { userId: userId }
      );

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filteredUsers = users.filter((item) =>
  item.userOfficialName?.toLowerCase().includes(searchText.toLowerCase()) ||
  item.userLoginId?.toLowerCase().includes(searchText.toLowerCase())
);


const handleSearch = async (value) => {
  setSearchText(value);

  if (value.trim() === "") {
    setShowDropdown(false);
    fetchUsers(); // fallback to all users
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:8080/api/search/users",
      {
        userOfficialName: value,
        userLoginId: value,
      }
    );

    setSearchResults(response.data);
    setShowDropdown(true);
  } catch (error) {
    console.error("Search error:", error);
  }
};

const handleSelectUser = async (selectedUser) => {
  setSearchText(selectedUser.userLoginId); // show in input
  setShowDropdown(false);

  try {
    const response = await axios.post(
      "http://localhost:8080/api/search/getSearchProfileDetails",
      {
        userId: userId, // from local/session
        searchUserId: selectedUser.userId,
      }
    );

    setUsers(response.data); // show only selected user
  } catch (error) {
    console.error("Profile fetch error:", error);
  }
};

  const sendRequest = async (userIdGetRequest) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/userRequest/sendRequest",
      {
        userIdSendRequest: userId,   // logged-in user id
        userIdGetRequest: userIdGetRequest   // clicked user id
      }
    );

    if (response.status === 200) {
      fetchUsers();   // 🔄 Refresh list
    }

  } catch (error) {
    console.error("Error sending request:", error);
  }
};

  return (
    <>
      {/* HEADER */}
      <Navbar username={userOfficialName} userId={userId}/>



      <div className="container mt-4 mb-5">
        <h4 className="mb-4">Search People</h4>

        
      <div className="mb-3" style={{ position: "relative" }}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name or username..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ maxWidth: "700px", marginLeft: "18%" ,paddingRight: "40px"}}
          />

          {searchText && (
            <span
              onClick={() => {
                setSearchText("");
                setShowDropdown(false);
                fetchUsers(); // reload all users
              }}
              style={{
                position: "absolute",
                right: "calc(18% + 21px)",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
                color: "#888",
              }}
            >
              ❌
            </span>
          )}

          {/* DROPDOWN */}
          {showDropdown && searchResults.length > 0 && (
            <ul
              className="list-group"
              style={{
                position: "absolute",
                width: "700px",
                left: "18%",
                zIndex: 1000,
              }}
            >
              {searchResults.map((item) => (
                <li
                  key={item.userId}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSelectUser(item)}
                  style={{ cursor: "pointer" }}
                >
                  @{item.userLoginId} {/* visible */}
                </li>
              ))}
            </ul>
          )}
        </div>

        {users.map((item) => {
          const imageUrl = item.profileImageName
            ? `http://localhost:8080/uploads/${item.profileImageName}`
            : defaultImage;

          return (
            <div
              key={item.userId}
              className="card mb-3 shadow-sm"
              style={{ borderRadius: "12px", width: "700px", marginLeft: "18%" }}
            >
              <div className="card-body d-flex align-items-center">
                {/* PROFILE IMAGE */}
                <img
                  src={imageUrl}
                  alt="profile"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "20px",
                  }}
                />

                {/* USER DETAILS */}
                <div style={{ flex: 1 }}>
                  <h5>{item.userOfficialName}</h5>
                  <p style={{ color: "gray", marginBottom: "5px" }}>
                    @{item.userLoginId}
                  </p>

                  <div style={{ display: "flex", gap: "25px" }}>
                    <div>
                      <strong>{item.totalPost || 0}</strong>
                      <div style={{ fontSize: "13px" }}>Posts</div>
                    </div>

                    <div>
                      <strong>{item.totalFollowers || 0}</strong>
                      <div style={{ fontSize: "13px" }}>Followers</div>
                    </div>

                    <div>
                      <strong>{item.totalFollowing || 0}</strong>
                      <div style={{ fontSize: "13px" }}>Following</div>
                    </div>
                  </div>
                </div>

                {/* SEND REQUEST BUTTON */}
                {item.getRequestAcceptOrReject === true ? (
                  <button className="btn btn-success" disabled>
                    Accepted
                  </button>
                ) : item.requestSendOrCancel === true ? (
                  <button className="btn btn-danger">
                    Cancel
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => sendRequest(item.userId)}
                  >
                    Send Request
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "#ffffff",
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-around",
          padding: "10px 0",
        }}
      >
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/home")}
        >
          🏠 Home
        </button>

        <button className="btn btn-primary">📝 Search People</button>

        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/profilePage")}
        >
          👤 Profile
        </button>
      </div>
    </>
  );
};

export default SearchPeople;