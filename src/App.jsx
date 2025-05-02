// Please Use Internet Connection to run Entire Project

import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const chatEndRef = useRef(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "" },
            { role: "user", content: input },
          ],
        }),
      });

      const data = await response.json();
      console.log("API response:", data);

      const botReply =
        data.choices?.[0]?.message?.content || "No response from model.";
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (err) {
      console.error("Frontend API Error:", err);
      setMessages((prev) => [
        ...prev,
        { text: "Error calling Backend.", sender: "bot" },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`main ${darkMode ? "dark" : "light"}`}>
      <div className="container">
        <div className="header">
          <p className="logo fixed-theme">
            <img src="src/assets/logo.svg" alt="logo" />
            Health Care Assistant
          </p>
          <button
            className="theme-toggle bg-amber-900"
            onClick={toggleDarkMode}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button className="clear-chat" onClick={() => setMessages([])}>
            🗑️
          </button>
        </div>
        <div className="textarea">
          <div className="chat-area">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="message bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="messageBox">
          <div className="fileUploadWrapper">
            <label htmlFor="file">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 337 337"
              >
                <circle
                  strokeWidth="20"
                  troke={darkMode ? "#6c6c6c" : "#333"}
                  fill="none"
                  r="158.5"
                  cy="168.5"
                  cx="168.5"
                ></circle>
                <path
                  strokeLinecap="round"
                  strokeWidth="25"
                  stroke={darkMode ? "#6c6c6c" : "#333"}
                  d="M167.759 79V259"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeWidth="25"
                  stroke={darkMode ? "#6c6c6c" : "#333"}
                  d="M79 167.138H259"
                ></path>
              </svg>
              <span className="tooltip">Add an image</span>
            </label>
            <input type="file" id="file" name="file" />
          </div>
          <input
            required
            placeholder="Type your message......"
            type="text"
            value={input}
            id="messageInput"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} id="sendButton">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 664 663"
            >
              <path
                fill="none"
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              ></path>
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="33.67"
                stroke={darkMode ? "#6c6c6c" : "#333"}
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;
