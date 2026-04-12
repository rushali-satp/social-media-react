import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostList from "../components/PostList";

const ProfilePage = () => {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = loggedInUser?.userId;
  const userLoginId = loggedInUser?.userLoginId;
  const userOfficialName = loggedInUser?.userOfficialName || "Guest";

  //const totalPost = location.state?.totalPost || 0;

  const [profile, setProfile] = useState(null);
  const [bioData, setBioData] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [posts, setPosts] = useState([]);

  const mapResponse = (data) => {
  return data.map((item) => ({
    id: item.postId,
    author: item.userLoginId,
    text: item.postText,
    image: item.postImageName
      ? `http://localhost:8080/uploads/${item.postImageName}`
      : null,
    music: item.musicUrl,
    likes: item.likes || 0,
    comments: item.comments || [],
  }));
};

  // ✅ Fetch profile details
  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, []);

  const fetchProfile = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/users/getProfileDetails",
      { userId }
    );

    console.log("Profile API Response:", res.data);

    if (res.data && res.data.length > 0) {
      const data = res.data[0];

      setProfile(data);
      setBioData(data.bioDetails || "");

      if (data.profileImageName) {
        setPreview(
          `http://localhost:8080/uploads/${data.profileImageName}`
        );
      } else {
        setPreview(null); // no image from backend
      }

    } else {
      // 🔥 ARRAY IS EMPTY
      setProfile(null);
      setBioData("");
      setPreview(null);
    }

  } catch (err) {
    console.log("Error fetching profile");
  }
};

  // ✅ Handle image select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Save / Update Profile
  const handleSave = async () => {
    const data = new FormData();
    data.append("userId", userId);
    data.append("userLoginId", userLoginId);
    data.append("bioData", bioData);
    data.append("totalPost", posts.length);
    data.append("totalFollowers", profile?.totalFollowers || 0);
    data.append("totalFollowing", profile?.totalFollowing || 0);

    if (image) {
      data.append("image", image);
    }

    try {
      await axios.post("http://localhost:8080/api/users", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile Saved Successfully");
      setIsEditing(false);
      fetchProfile(); // refresh
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  const fetchMyPosts = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/createPost/getProfilePost",
      { userId }
    );

    setPosts(mapResponse(res.data));

  } catch (err) {
    console.error(err);
  }
};

const handleLike = async (postId) => {
  try {
    await axios.post(
      `http://localhost:8080/api/createPost/${postId}/like`,
      { userId }
    );

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );
  } catch {
    alert("Already liked");
  }
};

const handleAddComment = async (postId, comment) => {
  try {
    await axios.post(
      `http://localhost:8080/api/createPost/${postId}/comment`,
      { userId, comment }
    );

    fetchMyPosts();
  } catch (err) {
    console.error(err);
  }
};

const handleDelete = async (postId) => {
  try {
    const res = await axios.delete(
      `http://localhost:8080/api/createPost/delete/${postId}`
    );

    alert(res.data);

    setPosts((prev) => prev.filter((p) => p.id !== postId));
  } catch (err) {
    alert("Delete failed");
  }
};

  return (
    <>
      {/* 🔵 HEADER */}
      <Navbar username={userOfficialName} userId={userId}/>

      {/* 🔥 MAIN CONTENT */}
      <div
        className="container"
        style={{
          maxWidth: "600px",
          marginTop: "90px",
          marginBottom: "80px",
        }}
      >
        <div className="d-flex align-items-center justify-content-between">

         {/* Profile Image */}
          <div style={{ position: "relative" }}>
            <img
              src={
                preview
                  ? preview
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #ddd",
              }}
            />

            {/* ✏ Edit Icon Always Visible */}
            <span
              onClick={() => setIsEditing(true)}
              style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
                background: "#fff",
                borderRadius: "50%",
                padding: "6px",
                cursor: "pointer",
                boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              }}
            >
              ✏
            </span>
          </div>

          {/* Stats */}
          <div className="text-center">
            <h5>{posts.length}</h5>
            <small>Posts</small>
          </div>

          <div
            className="text-center text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/followUnfollowUsers", { state: { type: "followers" } })
            }
          >
            <h5>{profile?.totalFollowers || 0}</h5>
            <small>Followers</small>
          </div>

           <div
            className="text-center text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/followUnfollowUsers", { state: { type: "following" } })
            }
          >
            <h5>{profile?.totalFollowing || 0}</h5>
            <small>Following</small>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-4">
          {isEditing ? (
            <>
              <textarea
                className="form-control mb-2"
                value={bioData}
                onChange={(e) => setBioData(e.target.value)}
              />

              <input
                type="file"
                className="form-control mb-2"
                onChange={handleFileChange}
              />

              <button
                className="btn btn-primary w-100"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </>
          ) : (
            profile?.bioDetails && <p>{profile.bioDetails}</p>
          )}
        </div>
        {/* 🔥 USER POSTS */}
        <div className="mt-4">
          <PostList
            posts={posts}
            onLike={handleLike}
            onAddComment={handleAddComment}
            onDelete={handleDelete}
            isMyPost={true}
          />
        </div>
      </div>

      {/* 🔵 FOOTER */}
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

        <button className="btn btn-primary">
          👤 Profile
        </button>
      </div>
    </>
  );
};

export default ProfilePage;