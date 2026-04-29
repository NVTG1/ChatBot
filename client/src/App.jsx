import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [persona, setPersona] = useState("anshuman");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = {
      sender: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMsg]);
    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        persona,
        message: currentMessage,
      });

      const botMsg = {
        sender: "bot",
        text: res.data.reply,
      };

      setChat((prev) => [...prev, botMsg]);
    } catch {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Server error" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="header">
          <h2>Scaler Persona Chatbot</h2>
        </div>

        <div className="buttons">
          <button
            className={persona === "anshuman" ? "active" : ""}
            onClick={() => setPersona("anshuman")}
          >
            Anshuman
          </button>

          <button
            className={persona === "abhimanyu" ? "active" : ""}
            onClick={() => setPersona("abhimanyu")}
          >
            Abhimanyu
          </button>

          <button
            className={persona === "kshitij" ? "active" : ""}
            onClick={() => setPersona("kshitij")}
          >
            Kshitij
          </button>
        </div>

        <div className="chat-box">
          {chat.length === 0 && (
            <div className="welcome">
              Ask anything about Scaler mentors 👋
            </div>
          )}

          {chat.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}

          {loading && <div className="message bot">Typing...</div>}
        </div>

        <div className="input-area">
          <textarea
            placeholder="Type your question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;