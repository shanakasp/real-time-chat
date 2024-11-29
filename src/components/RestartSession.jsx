import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

const RestartSession = () => {
  const handleRestart = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "After restarting, you cannot retrieve previous prompts. Make sure to download them first.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Restart",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            "https://backend-chat-rephrase.onrender.com/restart"
          );
          Swal.fire(
            "Restarted!",
            "Your session has been restarted.",
            "success"
          ).then(() => {
            window.location.reload(); // Reload the page
          });
        } catch (error) {
          Swal.fire(
            "Error!",
            "Failed to restart the session. Please try again.",
            "error"
          );
          console.error(error);
        }
      }
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={handleRestart}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#167DDE",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "7px 15px",
          cursor: "pointer",
          fontSize: "13px",
        }}
      >
        <span>🔄</span> Restart Session
      </button>
    </div>
  );
};

export default RestartSession;
