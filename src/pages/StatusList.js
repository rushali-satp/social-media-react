import React from "react";

const StatusList = ({ statuses }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        overflowX: "auto",
        marginBottom: "20px",
      }}
    >
      {statuses.map((status, index) => (
        <div
          key={index}
          style={{
            minWidth: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "#0d6efd",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "10px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {status.statusText}
        </div>
      ))}
    </div>
  );
};

export default StatusList;