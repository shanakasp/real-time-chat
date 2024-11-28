import axios from "axios";
import { useEffect, useRef, useState } from "react";

const ChatInterface = () => {
  const [leftMessages, setLeftMessages] = useState([]);
  const [rightMessages, setRightMessages] = useState([]);
  const [leftInputMessage, setLeftInputMessage] = useState("");
  const [rightInputMessage, setRightInputMessage] = useState("");
  const leftMessagesEndRef = useRef(null);
  const rightMessagesEndRef = useRef(null);

  const API_URL = "http://localhost:3000/send-message";

  const sendMessage = async (
    sender,
    message,
    setInput,
    setMessages,
    updateOpposite
  ) => {
    if (message.trim() === "") return;

    const newMessage = {
      text: message,
      timestamp: new Date().toLocaleTimeString(),
      sender,
    };

    // Update sender's messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, isSent: true },
    ]);

    // Reset input
    setInput("");

    try {
      const requestBody = {
        sender,
        recipient: sender === "user1" ? "user2" : "user1", // Assuming recipient is the opposite user
        message,
        category: "problem-solving", // Adjust as needed
      };

      const response = await axios.post(API_URL, requestBody);
      const { phrasedMessage } = response.data;

      // Update the opposite side with the phrased message
      updateOpposite((prevMessages) => [
        ...prevMessages,
        {
          text: phrasedMessage,
          timestamp: new Date().toLocaleTimeString(),
          isSent: false,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(leftMessagesEndRef);
  }, [leftMessages]);

  useEffect(() => {
    scrollToBottom(rightMessagesEndRef);
  }, [rightMessages]);

  return (
    <div className="flex bg-gray-100">
      {/* Left Chat Container */}
      <div className="w-1/3 p-4 border-r border-gray-300 flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4 space-y-2 pr-2">
          {leftMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  p-2 rounded-lg max-w-xs break-words 
                  ${msg.isSent ? "bg-red-500" : "bg-green-500"} 
                  text-white
                `}
              >
                {msg.text}
                <div className="text-xs text-gray-200 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>
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
        <h2 className="text-xl font-bold mb-4 text-center">API Column</h2>
        <div className="flex-grow overflow-y-auto mb-4 space-y-2 pr-2"></div>
      </div>

      {/* Right Chat Container */}
      <div className="w-1/3 p-4 flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4 space-y-2 pr-2">
          {rightMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  p-2 rounded-lg max-w-xs break-words 
                  ${msg.isSent ? "bg-red-500" : "bg-green-500"} 
                  text-white
                `}
              >
                {msg.text}
                <div className="text-xs text-gray-200 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>
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
  );
};

export default ChatInterface;
