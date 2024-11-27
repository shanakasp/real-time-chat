import { useEffect, useRef, useState } from "react";

const ChatInterface = () => {
  const [leftMessages, setLeftMessages] = useState([]);
  const [rightMessages, setRightMessages] = useState([]);
  const [apiMessages, setApiMessages] = useState([]);
  const [leftInputMessage, setLeftInputMessage] = useState("");
  const [rightInputMessage, setRightInputMessage] = useState("");
  const [apiInputMessage, setApiInputMessage] = useState("");
  const leftMessagesEndRef = useRef(null);
  const rightMessagesEndRef = useRef(null);
  const apiMessagesEndRef = useRef(null);

  const sendLeftMessage = () => {
    if (leftInputMessage.trim() === "") return;

    const newMessage = {
      text: leftInputMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Message sent from left appears red on left side, blue on right side
    setLeftMessages([...leftMessages, { ...newMessage, isSent: true }]);
    setRightMessages([...rightMessages, { ...newMessage, isSent: false }]);
    setLeftInputMessage("");
  };

  const sendRightMessage = () => {
    if (rightInputMessage.trim() === "") return;

    const newMessage = {
      text: rightInputMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Message sent from right appears red on right side, blue on left side
    setRightMessages([...rightMessages, { ...newMessage, isSent: true }]);
    setLeftMessages([...leftMessages, { ...newMessage, isSent: false }]);
    setRightInputMessage("");
  };

  const sendApiMessage = () => {
    if (apiInputMessage.trim() === "") return;

    const newMessage = {
      text: apiInputMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    // API messages appear green
    setApiMessages([...apiMessages, { ...newMessage, isSent: true }]);
    setApiInputMessage("");
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

  useEffect(() => {
    scrollToBottom(apiMessagesEndRef);
  }, [apiMessages]);

  return (
    <div className="flex  bg-gray-100">
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
                  ${msg.isSent ? "bg-red-500" : "bg-blue-500"} 
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
            onKeyPress={(e) => e.key === "Enter" && sendLeftMessage()}
          />
          <button
            onClick={sendLeftMessage}
            className="bg-green-500 text-white p-2 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>

      {/* API Column */}
      <div className="w-1/3 p-4 border-r border-gray-300 flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-center">API Column</h2>
        <div className="flex-grow overflow-y-auto mb-4 space-y-2 pr-2">
          <div ref={apiMessagesEndRef} />
        </div>
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
                  ${msg.isSent ? "bg-red-500" : "bg-blue-500"} 
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
            onKeyPress={(e) => e.key === "Enter" && sendRightMessage()}
          />
          <button
            onClick={sendRightMessage}
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
