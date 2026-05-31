import React, { useState , useEffect, useRef} from "react";
import axios from "axios";
import "../css/ChatBot.css";

function ChatBot() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatBoxRef = useRef(null);

  
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = async () => {

  if (!message.trim()) return;

  const currentMessage = message;

  setChat(prev => [
    ...prev,
    {
      sender: "user",
      text: currentMessage
    },
    {
      sender: "bot",
      text: "Typing..."
    }
  ]);

  setMessage("");

  try {

    const response = await axios.post(
      "http://localhost:8080/api/chat",
      {
        message: currentMessage
      }
    );

    setChat(prev => {
      const updated = [...prev];

      // Remove Typing... and replace with actual response
      updated[updated.length - 1] = {
        sender: "bot",
        text: response.data.reply
      };

      return updated;
    });

  } catch (error) {

    setChat(prev => {
      const updated = [...prev];

      updated[updated.length - 1] = {
        sender: "bot",
        text: "Sorry, something went wrong."
      };

      return updated;
    });

  }
};

      return (
      <div className="chatbot-container">

        <div className="chat-header">
          🤖 Mini Social Assistant
        </div>

        <div className="chat-box" ref={chatBoxRef}>
          {chat.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "user"
                  ? "message user-message"
                  : "message bot-message"
              }
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about Mini Social..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>

      </div>
    );
}

export default ChatBot;