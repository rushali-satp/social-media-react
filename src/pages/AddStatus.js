import React, { useState } from "react";
import axios from "axios";

const AddStatus = ({ statuses, userId, refreshStatuses }) => {

  const [statusText, setStatusText] = useState("");
  const [showInput, setShowInput] = useState(false);

  const [selectedStory, setSelectedStory] = useState(null);

  const handleAddStatus = async () => {

    if (!statusText.trim()) return;

    try {

      await axios.post(
        "http://localhost:8080/api/status/addStatus",
        {
          userId,
          statusText,
        }
      );

      setStatusText("");
      setShowInput(false);

      refreshStatuses();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* STORY ROW */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          overflowX: "auto",
          marginBottom: "20px",
          paddingBottom: "10px",
        }}
      >

        {/* YOUR STORY */}
        <div
          onClick={() => setShowInput(!showInput)}
          style={{
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "75px",
              height: "75px",
              borderRadius: "50%",
              border: "3px solid #0d6efd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "35px",
              background: "#fff",
              color: "#0d6efd",
              fontWeight: "bold",
            }}
          >
            +
          </div>

          <small>Your Story</small>
        </div>

        {/* OTHER STORIES */}
        {statuses.map((status, index) => (

          <div
            key={index}
            onClick={() => setSelectedStory(status)}
            style={{
              textAlign: "center",
              cursor: "pointer",
            }}
          >

            {/* PROFILE IMAGE */}
            <img
              src={`http://localhost:8080/uploads/${status.profileImageName}`}
              alt="story"
              style={{
                width: "75px",
                height: "75px",
                borderRadius: "50%",
                border: "3px solid #ff007f",
                objectFit: "cover",
              }}
            />

            <small
              style={{
                display: "block",
                marginTop: "5px",
                fontSize: "12px",
              }}
            >
              {status.userLoginId}
            </small>

          </div>
        ))}
      </div>

      {/* ADD STORY INPUT */}
      {showInput && (
        <div
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
            border: "1px solid #ddd",
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Write your story..."
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
          />

          <button
            className="btn btn-primary mt-2"
            onClick={handleAddStatus}
          >
            Add Story
          </button>
        </div>
      )}

      {/* STORY MODAL */}
      {selectedStory && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setSelectedStory(null)}
        >

          <div
            style={{
              background: "#fff",
              width: "350px",
              borderRadius: "15px",
              padding: "20px",
              textAlign: "center",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedStory(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                border: "none",
                background: "none",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            {/* PROFILE IMAGE */}
            <img
              src={`http://localhost:8080/uploads/${selectedStory.profileImageName}`}
              alt="profile"
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #ff007f",
              }}
            />

            <h5 style={{ marginTop: "15px" }}>
              {selectedStory.userLoginId}
            </h5>

            {/* STATUS TEXT */}
            <p
              style={{
                marginTop: "20px",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              {selectedStory.statusText}
            </p>

          </div>
        </div>
      )}
    </>
  );
};

export default AddStatus;