import jsPDF from "jspdf";
import "jspdf-autotable";
import React from "react";

const DownloadPDF = () => {
  // Helper function to fetch data and generate a PDF
  const generatePDF = async (apiUrl, fileName) => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Initialize jsPDF
      const doc = new jsPDF();

      // Table columns and rows
      const columns = [
        "Sender",
        "Message",
        "Original Message",
        "Category Prompt",
        "Timestamp",
      ];
      const rows = data.map((item) => [
        item.sender,
        item.message,
        item.originalMessage,
        item.categoryPrompt,
        new Date(item.timestamp).toLocaleString(),
      ]);

      // Add table to the PDF
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 10,
      });

      // Save the PDF
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
      }}
    >
      <button
        onClick={() =>
          generatePDF(
            "http://localhost:4000/conversation?user1=user1&user2=user2",
            "User1_Prompts.pdf"
          )
        }
        style={{
          backgroundColor: "#007bff",

          color: "#fff",
          border: "none",
          borderRadius: "5px",
          fontSize: "12px",
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        Download User 1 Prompts
      </button>

      <button
        onClick={() =>
          generatePDF(
            "http://localhost:4000/conversation?user1=user2&user2=user1",
            "User2_Prompts.pdf"
          )
        }
        style={{
          fontSize: "12px",
          padding: "5px 10px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download User 2 Prompts
      </button>
    </div>
  );
};

export default DownloadPDF;
