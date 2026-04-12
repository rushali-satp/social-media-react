import React, { useEffect, useState } from "react";
import AddPost from "../components/AddPost";
import PostList from "../components/PostList";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = loggedInUser?.userId;
  const userOfficialName = loggedInUser?.userOfficialName || "Guest";

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // 🔄 Load All Posts On Start
  useEffect(() => {
    fetchAllPosts();
  }, []);

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

  const fetchAllPosts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/createPost/getPost"
      );
      setPosts(mapResponse(res.data));
      setActiveTab("all");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/createPost/getProfilePost",
        { userId }
      );
      setPosts(mapResponse(res.data));
      setActiveTab("my");
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑 DELETE POST
  const handleDelete = async (postId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/api/createPost/delete/${postId}`
    );

    // Show backend message
    alert(response.data);

    // Remove post from UI
    setPosts((prev) => prev.filter((p) => p.id !== postId));

  } catch (err) {
    console.error("Delete failed", err);

    // Show error message
    if (err.response && err.response.data) {
      alert(err.response.data);
    } else {
      alert("Something went wrong");
    }
  }
};

  // 👍 LIKE
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
    } catch (err) {
      alert("Already liked");
    }
  };

  // 💬 COMMENT
  const handleAddComment = async (postId, comment) => {
  try {
    await axios.post(
      `http://localhost:8080/api/createPost/${postId}/comment`,
      { userId, comment }
    );

    // 🔥 Reload posts to get full updated comment object
    if (activeTab === "all") {
      fetchAllPosts();
    } else {
      fetchMyPosts();
    }

  } catch (err) {
    console.error("Comment failed", err);
  }
};


  return (
    <>
      <Navbar username={userOfficialName} userId={userId}/>

      <div
        className="container"
        style={{
          maxWidth: "600px",
          marginTop: "90px",
          marginBottom: "80px",
        }}
      >
        <h4>Hello, {userOfficialName} 👋</h4>

        {activeTab === "all" && (
          <AddPost onAdd={(post) => setPosts((p) => [post, ...p])} />
        )}

        
        <PostList
          posts={posts}
          onLike={handleLike}
          onAddComment={handleAddComment}
          onDelete={activeTab === "my" ? handleDelete : null}
          isMyPost={activeTab === "my"}
        />
      </div>

      {/* 🔵 FIXED FOOTER */}
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
          className={`btn ${
            activeTab === "all"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={fetchAllPosts}
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
          onClick={async () => {
             navigate("/profilePage");
          }} >
          👤 Profile
        </button>
      </div>
    </>
  );
};

export default Home;
