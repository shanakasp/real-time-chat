import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import DownloadPDF from "./DownloadPDF";

const ChatMessage = ({ msg, onEditPrompt }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`flex ${
        msg.isSent ? "justify-end" : "justify-start"
      } relative`}
    >
      <div
        className={`p-2 rounded-lg max-w-xs break-words 
          ${msg.isSent ? "bg-red-500" : "bg-green-500"} 
          text-white relative`}
      >
        {msg.text}
        <div className="text-xs text-gray-200 text-right">{msg.timestamp}</div>

        {/* Prompt Details Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute top-0 right-0 bg-white/20 rounded-full w-6 h-6 text-xs"
        >
          {expanded ? "-" : "i"}
        </button>
      </div>

      {expanded && (
        <div className="absolute z-10 bg-white border rounded shadow-lg p-2 mt-12 w-64">
          <div className="mb-2">
            <strong>Original Message:</strong>
            <p>{msg.originalPrompt || msg.text}</p>
          </div>
          <div className="mb-2">
            <strong>Rephrased Message:</strong>
            <p>{msg.rephrasedMessage} || </p>
          </div>
          <div className="mb-2">
            <strong>Prompt Used:</strong>
            <p>{msg.usedPrompt || "No specific prompt"}</p>
          </div>
          {msg.isSent && (
            <button
              onClick={() => onEditPrompt(msg)}
              className="bg-blue-500 text-white p-1 rounded mt-2"
            >
              Edit Prompt
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ChatInterface = () => {
  const [leftMessages, setLeftMessages] = useState([]);
  const [rightMessages, setRightMessages] = useState([]);
  const [leftInputMessage, setLeftInputMessage] = useState("");
  const [rightInputMessage, setRightInputMessage] = useState("");

  const [selectedAlgorithm, setSelectedAlgorithm] = useState("1");
  const [editablePrompt, setEditablePrompt] = useState("");
  const [currentEditMessage, setCurrentEditMessage] = useState(null);

  const leftMessagesEndRef = useRef(null);
  const rightMessagesEndRef = useRef(null);

  const API_URL = "http://localhost:4000/send-message";

  // Default prompts for each algorithm
  const getDefaultPrompts = () => ({
    1: {
      prompt:
        "Edit this message to sound professional and courteous. Remove any hostile language.",
      subTypes: [],
    },
    2: {
      prompt:
        "Rephrase this message to provide a clear, professional, and constructive response.",
      subTypes: [],
    },
    3: {
      prompt: "Rephrase the message to be more:",
      subTypes: [
        "positive",
        "supportive",
        "collaborative",
        "problem-solving",
        "responsive",
      ],
    },
  });

  // Scroll to bottom of messages
  const scrollToBottom = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(leftMessagesEndRef);
  }, [leftMessages]);

  useEffect(() => {
    scrollToBottom(rightMessagesEndRef);
  }, [rightMessages]);

  // Handle prompt editing
  const handleEditPrompt = (message) => {
    setCurrentEditMessage(message);
    setEditablePrompt(message.usedPrompt || "");
  };

  // Send message function
  const sendMessage = async (
    sender,
    message,
    setInput,
    setMessages,
    updateOpposite,
    originalMessage = null
  ) => {
    if (message.trim() === "") return;

    // Use current editable prompt or get default
    const currentPrompt =
      editablePrompt || getDefaultPrompts()[selectedAlgorithm].prompt;

    const newMessage = {
      text: message,
      timestamp: new Date().toLocaleTimeString(),
      isSent: true,
      originalPrompt: originalMessage?.originalPrompt || message,
      usedPrompt: currentPrompt,
      algorithm: selectedAlgorithm,
      sender: sender, // Add sender information
    };

    // Update sender's messages
    setMessages((prevMessages) => [...prevMessages, { ...newMessage }]);

    // Reset input and edit prompt
    setInput("");
    setEditablePrompt("");
    setCurrentEditMessage(null);

    try {
      // Prepare request body
      const requestBody = {
        sender,
        recipient: sender === "user1" ? "user2" : "user1",
        message,
        category: "problem-solving",
        algorithm: selectedAlgorithm,
        categoryPrompt: currentPrompt,
      };

      // Send message to backend
      const response = await axios.post(API_URL, requestBody);
      const phrasedMessage = response.data.message;

      // Update opposite side with phrased message
      updateOpposite((prevMessages) => [
        ...prevMessages,
        {
          text: phrasedMessage,
          timestamp: new Date().toLocaleTimeString(),
          isSent: false,
          originalPrompt: message,
          rephrasedMessage: phrasedMessage,
          usedPrompt: currentPrompt,
          algorithm: selectedAlgorithm,
          sender: sender === "user1" ? "user2" : "user1",
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Render method
  return (
    <div>
      {" "}
      <DownloadPDF />
      <div className="flex bg-gray-100 h-[80vh]">
        {/* Left Chat Container */}
        <div className="w-1/3 p-4 border-r border-gray-300 flex flex-col">
          <div className="flex-grow overflow-y-auto mb-4 space-y-2 pr-2">
            {leftMessages.map((msg, index) => (
              <ChatMessage
                key={index}
                msg={msg}
                onEditPrompt={handleEditPrompt}
              />
            ))}
            <div ref={leftMessagesEndRef} />
          </div>

          <div className="flex">
            <input
              type="text"
              value={leftInputMessage}
              onChange={(e) => setLeftInputMessage(e.target.value)}
              className="flex-grow p-2 border rounded-l-lg"
              placeholder="Type a message"
              onKeyPress={(e) =>
                e.key === "Enter" &&
                sendMessage(
                  "user1",
                  leftInputMessage,
                  setLeftInputMessage,
                  setLeftMessages,
                  setRightMessages
                )
              }
            />
            <button
              onClick={() =>
                sendMessage(
                  "user1",
                  leftInputMessage,
                  setLeftInputMessage,
                  setLeftMessages,
                  setRightMessages
                )
              }
              className="bg-green-500 text-white p-2 rounded-r-lg"
            >
              Send
            </button>
          </div>
        </div>

        {/* API Column */}
        <div className="w-1/3 p-4 border-r border-gray-300 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-center">
            Prompt Configuration
          </h2>

          {/* Algorithm Selection */}
          <div className="mb-4">
            <label className="block mb-2">Select Algorithm</label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="1">Algorithm 1</option>
              <option value="2">Algorithm 2</option>
              <option value="3">Algorithm 3</option>
            </select>
          </div>

          {/* Prompt Editing Area */}
          <div className="mb-4">
            <label className="block mb-2">Edit Prompt</label>
            <textarea
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              placeholder="Customize prompt (optional)"
              className="w-full p-2 border rounded h-24"
            />
            <div className="mt-2 flex space-x-2">
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={() => {
                  const defaultPrompt =
                    getDefaultPrompts()[selectedAlgorithm].prompt;
                  setEditablePrompt(defaultPrompt);
                }}
              >
                Reset Default
              </button>
              {currentEditMessage && (
                <button
                  className="bg-green-500 text-white p-2 rounded"
                  onClick={() => {
                    // Determine the correct sender and message set based on the original message
                    const isSenderUser1 = currentEditMessage.sender === "user1";
                    const setInputFunc = isSenderUser1
                      ? setLeftInputMessage
                      : setRightInputMessage;
                    const setMessagesFunc = isSenderUser1
                      ? setLeftMessages
                      : setRightMessages;
                    const updateOppositeFunc = isSenderUser1
                      ? setRightMessages
                      : setLeftMessages;

                    // Resend message with new prompt
                    sendMessage(
                      currentEditMessage.sender,
                      currentEditMessage.originalPrompt,
                      setInputFunc,
                      setMessagesFunc,
                      updateOppositeFunc,
                      currentEditMessage
                    );
                  }}
                >
                  Resend with New Prompt
                </button>
              )}
            </div>
          </div>

          {/* Algorithm 3 Sub-types */}
          {selectedAlgorithm === "3" && (
            <div>
              <h3 className="font-bold mb-2">Sub-types for Algorithm 3</h3>
              <div className="flex flex-wrap gap-2">
                {getDefaultPrompts()["3"].subTypes.map((subType) => (
                  <button
                    key={subType}
                    className="bg-gray-200 p-1 rounded"
                    onClick={() => {
                      setEditablePrompt(
                        `Rephrase the message to be more ${subType}`
                      );
                    }}
                  >
                    {subType}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Chat Container */}
        <div className="w-1/3 p-4 flex flex-col">
          <div className="flex-grow overflow-y-auto mb-4 space-y-2 pr-2">
            {rightMessages.map((msg, index) => (
              <ChatMessage
                key={index}
                msg={msg}
                onEditPrompt={handleEditPrompt}
              />
            ))}
            <div ref={rightMessagesEndRef} />
          </div>

          <div className="flex">
            <input
              type="text"
              value={rightInputMessage}
              onChange={(e) => setRightInputMessage(e.target.value)}
              className="flex-grow p-2 border rounded-l-lg"
              placeholder="Type a message"
              onKeyPress={(e) =>
                e.key === "Enter" &&
                sendMessage(
                  "user2",
                  rightInputMessage,
                  setRightInputMessage,
                  setRightMessages,
                  setLeftMessages
                )
              }
            />
            <button
              onClick={() =>
                sendMessage(
                  "user2",
                  rightInputMessage,
                  setRightInputMessage,
                  setRightMessages,
                  setLeftMessages
                )
              }
              className="bg-green-500 text-white p-2 rounded-r-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
