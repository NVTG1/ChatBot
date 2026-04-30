import { useState } from "react";
import axios from "axios";
import "./App.css";

const suggestions = {
  anshuman: [
    "How do I crack a Google interview?",
    "What DSA patterns should I master?",
    "Is Scaler worth joining?",
    "How do I go from tier-3 college to FAANG?",
  ],
  abhimanyu: [
    "Why did you start Scaler?",
    "How do I pick the right startup to join?",
    "Should I choose PM or SWE?",
    "What's broken about engineering education in India?",
  ],
  kshitij: [
    "Explain dynamic programming from scratch.",
    "How do I prepare for system design interviews?",
    "I practice a lot but still fail interviews. Why?",
    "What's the best way to learn graphs?",
  ],
};

function App() {
  const [persona, setPersona] = useState("anshuman");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const switchPersona = (p) => {
    setPersona(p);
    setChat([]);
  };

  const sendMessage = async (text) => {
    const msgText = text || message;
    if (!msgText.trim()) return;

    const userMsg = { sender: "user", text: msgText };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        persona,
        message: msgText,
      });
      setChat((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Server error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
            onClick={() => switchPersona("anshuman")}
          >
            Anshuman
          </button>
          <button
            className={persona === "abhimanyu" ? "active" : ""}
            onClick={() => switchPersona("abhimanyu")}
          >
            Abhimanyu
          </button>
          <button
            className={persona === "kshitij" ? "active" : ""}
            onClick={() => switchPersona("kshitij")}
          >
            Kshitij
          </button>
        </div>

        <div className="chat-box">
          {chat.length === 0 && (
            <div className="empty-state">
              <div className="welcome">Ask anything about Scaler mentors 👋</div>
              <div className="chips">
                {suggestions[persona].map((q, i) => (
                  <button key={i} className="chip" onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chat.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}

          {loading && <div className="message bot typing">Typing...</div>}
        </div>

        <div className="input-area">
          <textarea
            placeholder="Type your question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;