import React, { useState } from "react";
import axios from "axios";

const AddStatus = ({ userId, onStatusAdded }) => {
  const [statusText, setStatusText] = useState("");

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
      onStatusAdded();

    } catch (err) {
      console.error(err);
    }
  };

  return (
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
        placeholder="What's your status?"
        value={statusText}
        onChange={(e) => setStatusText(e.target.value)}
      />

      <button
        className="btn btn-primary mt-2"
        onClick={handleAddStatus}
      >
        Add Status
      </button>
    </div>
  );
};

export default AddStatus;