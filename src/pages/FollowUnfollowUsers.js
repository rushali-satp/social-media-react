import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

const FollowUnfollowUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const type = location.state?.type; // "followers" or "following"

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = loggedInUser?.userId;
  const userOfficialName = loggedInUser?.userOfficialName || "Guest";

  const defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

useEffect(() => {
  if (!type) {
    navigate("/profilePage");
  }
}, [type, navigate]);

 useEffect(() => {
  if (userId && type) {
    if (type === "following") {
      fetchFollowingUsers();
    } else {
      fetchFollowersUsers();
    }
  }
}, [userId, type]);

const fetchFollowersUsers = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/users/getRequestProfileDetails",
      { userId }
    );
    setUsers(response.data);
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
};

const fetchFollowingUsers = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/users/getALLProfileDetails",
      { userId }
    );
    setUsers(response.data);
  } catch (error) {
    console.error("Error fetching following:", error);
  }
};

const unFollowUser = async (id) => {
  console.log("Unfollow user:", id);

  try {
    const response = await fetch("http://localhost:8080/api/userRequest/removeFromFollowing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sendRequestUserId: userId,
        getRequestUserId: id,
      }),
    });

    const result1 = await response.text(); // or .json() if backend sends JSON
    if (result1.msgcode === 200) {
      alert(result1.data); // "User Unfollow successfully"

      // navigate after alert
      navigate("/profilePage");
    } else {
      alert("Something went wrong");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const removeFollower = async (id) => {
  console.log("Remove follower:", id);
  try {
    const response = await fetch("http://localhost:8080/api/userRequest/removeFollowers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sendRequestUserId: id,
        getRequestUserId: userId,
      }),
    });

    const result = await response.json();

    if (result.msgcode === 200) {
      alert(result.data); // "User Unfollow successfully"

      // navigate after alert
      navigate("/profilePage");
    } else {
      alert("Something went wrong");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

 return (
    <>
     <Navbar username={userOfficialName} userId={userId}/>

    <div className="container mt-4 mb-5">
    <h4 className="mb-4" style={{fontSize: "30px" , marginTop: "7%" }}>
        {type === "following" ? "Following" : "Followers"}
    </h4>
     
     {users
          .filter((item) => item.getRequestAcceptOrReject  === true)
          .map((item) => {
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

                  <button
                    className="btn btn-success"
                    onClick={() =>
                        type === "following"
                        ? unFollowUser(item.userId)
                        : removeFollower(item.userId)
                    }
                    >
                    {type === "following" ? "Unfollow" : "Remove From Followers"}
                    </button>
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

        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/searchPeople")}
        >
          📝 Search
        </button> 

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

export default FollowUnfollowUsers;