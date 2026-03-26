import React, { useState } from "react";
import axios from "axios";

const AddPost = ({ onAdd }) => {
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText.trim() && !image) return;

    const formData = new FormData();
    formData.append("userId", loggedInUser.userId);
    formData.append("userLoginId", loggedInUser.userLoginId);
    formData.append("postText", postText.trim());
    formData.append("likes", 0);

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/createPost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // UI update after successful API call
      const newPost = {
        id: res.data?.postId || Date.now(),
        author: loggedInUser.userLoginId,
        text: postText.trim(),
        image: preview,
        likes: 0,
        comments: [],
      };

      onAdd(newPost);

      setPostText("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 mb-4">
      <div className="card-body">
        <h5 className="card-title text-muted mb-3">Create Post</h5>
        <form onSubmit={handleSubmit}>
          <textarea
            className="form-control mb-3"
            rows="3"
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />

          {preview && (
            <div className="mb-3 text-center">
              <img
                src={preview}
                alt="Preview"
                className="img-fluid rounded"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <label className="btn btn-outline-secondary btn-sm">
              📷 Add Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

            <button type="submit" className="btn btn-primary btn-sm px-4">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
