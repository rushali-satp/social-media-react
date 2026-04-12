import React, { useState, useEffect } from "react";
import axios from "axios";

const AddPost = ({ onAdd }) => {
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [music, setMusic] = useState(null);
  const [musicPreview, setMusicPreview] = useState(null);
  const [musicList, setMusicList] = useState([]);
  const [showMusic, setShowMusic] = useState(false); // toggle music UI

  const [audioPlayer, setAudioPlayer] = useState(null);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  const [imageError, setImageError] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Fetch music list from backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/music/music-list")
      .then((res) => setMusicList(res.data))
      .catch((err) => console.error("Error fetching music:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageError) {
    alert(imageError);
    return;
  }

    if (!postText.trim() && !image && !music) return;

    const formData = new FormData();
    formData.append("userId", loggedInUser.userId);
    formData.append("userLoginId", loggedInUser.userLoginId);
    formData.append("postText", postText.trim());
    formData.append("likes", 0);

    if (image) {
      formData.append("image", image);
    }

    // ✅ Send music URL (NOT file)
    if (music) {
      formData.append("musicUrl", music.audio);
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

      const newPost = {
        id: res.data?.postId || Date.now(),
        author: loggedInUser.userLoginId,
        text: postText.trim(),
        image: preview,
        music: musicPreview, // optional for UI
        likes: 0,
        comments: [],
      };

      onAdd(newPost);

      // Reset fields
      setPostText("");
      setImage(null);
      setPreview(null);
      setMusic(null);
      setMusicPreview(null);
      setShowMusic(false);

    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

 const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const fileName = file.name;

  if (fileName.includes(" ")) {
    setImageError("Image name should not contain spaces.");
    setImage(null);
    return;
  }

  const validNameRegex = /^[a-zA-Z0-9._-]+$/;
  if (!validNameRegex.test(fileName)) {
    setImageError("Image name should not contain special characters.");
    setImage(null);
    return;
  }

  if (file.size > 1024 * 1024) {
    setImageError("Image size must be less than 1 MB.");
    setImage(null);
    return;
  }

  setImageError("");
  setImage(file);

  const reader = new FileReader();
  reader.onloadend = () => setPreview(reader.result);
  reader.readAsDataURL(file);
};

 const handlePlay = (m) => {
  // If same song is clicked → STOP
  if (audioPlayer && currentPlayingId === m.id) {
    audioPlayer.pause();
    setAudioPlayer(null);
    setCurrentPlayingId(null);
    return;
  }

  // If different song → stop previous
  if (audioPlayer) {
    audioPlayer.pause();
  }

  // Play new song
  const newAudio = new Audio(m.audio);
  newAudio.play();

  setAudioPlayer(newAudio);
  setCurrentPlayingId(m.id);
};

  return (
    <div className="card shadow-sm border-0 rounded-3 mb-4">
      <div className="card-body">
        <h5 className="card-title text-muted mb-3">Create Post</h5>

        <form onSubmit={handleSubmit}>
          {/* TEXT */}
          <textarea
            className="form-control mb-3"
            rows="3"
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />

          {/* IMAGE PREVIEW */}
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

          {/* MUSIC PREVIEW */}
          {musicPreview && (
            <div className="mb-3 text-center">
              <audio controls className="w-100">
                <source src={musicPreview} />
              </audio>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="d-flex justify-content-between align-items-center">

            {/* IMAGE UPLOAD */}
            <label className="btn btn-outline-secondary btn-sm">
              📷 Add Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

            {imageError && (
              <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {imageError}
              </div>
            )}

            {/* TOGGLE MUSIC LIST */}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setShowMusic(!showMusic)}
            >
              🎵 Add Music
            </button>

            {/* SUBMIT */}
            <button type="submit" className="btn btn-primary btn-sm px-4">
              Post
            </button>
          </div>

          {/* MUSIC LIST */}
          {showMusic && (
           <div className="mt-3">
            <h6>Select Music 🎵</h6>

            {musicList.map((m) => (
              <div
                key={m.id}
                className="d-flex align-items-center mb-2 border p-2 rounded"
              >
                <img
                  src={m.image}
                  alt=""
                  style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                />

                <div className="ms-2 flex-grow-1">
                  <div>{m.name}</div>
                  <small className="text-muted">{m.artist}</small>
                </div>

                {/* ▶️ PLAY BUTTON */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success me-2"
                  onClick={() => handlePlay(m)}
                >
                  {currentPlayingId === m.id ? "⏸" : "▶️"}
                </button>

                {/* ✅ SELECT BUTTON */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    setMusic(m);             // select
                    setMusicPreview(m.audio); // also play
                  }}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddPost;