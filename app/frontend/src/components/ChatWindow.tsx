import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageBox from "./MessageBox";

const port = process.env.PORT || 5001;
const serverURL = process.env.SERVER_URL || `http://localhost:${port}`;

interface message {
  role: string;
  content: string;
}

interface ChatbotProps {
  suggestion?: string;
}

const ChatWindow: React.FC<ChatbotProps> = ({ suggestion = "" }) => {
  const [userContent, setUserContent] = useState<string>("");
  const [chat, setChat] = useState<message[]>([]);

  // useEffect(() => {
  //   const fetchChatLogs = async () => {
  //     try {
  //       const response = await axios.get(`${serverURL}/chat/all`);
  //       setChat(response.data);
  //     } catch (error) {
  //       console.error("Error fetching chat logs:", error);
  //     }
  //   };

  //   const openSite = async () => {
  //     try {
  //       const response = await axios.get(`${serverURL}/`);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Error fetching site:", error);
  //     }
  //   };

  //   openSite();
  //   fetchChatLogs();
  // }, []);

  async function handleSend() {
    // Remove leading and trailing white spaces
    const messageContent = userContent.trim();
    if (messageContent === "") return;

    try {
      // Send message to server, where server will generate a response
      const response = await axios.post(
        `${serverURL}/api/chatbot/message`,
        {
          email: "prosperOnMQP@wpi.edu",
          message: { user: "user", content: userContent}
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Reload chat
      const updatedChat = chat;
      updatedChat.push({role: "user", content: userContent});
      updatedChat.push({role: response.data.role, content: response.data.content})
      setChat(updatedChat);
      setUserContent("");
      console.log(chat);

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    } else if (event.key === "Tab") {
      event.preventDefault();
      if (suggestion) {
        setUserContent(`Tell me about ${suggestion}`);
      }
    }
  };

  return (
    <div className="absolute origin-center w-full h-full border-solid border-1 border-neutral-300 bg-neutral-100 rounded-lg overflow-y-auto	flex-col">
      <div style={{ flexGrow: 1, overflowY: "auto", padding: "10px" }}>
        
        {chat.map((message, index) => (
          <MessageBox key={index} role={message.role} content={message.content}/>
        ))}
      </div>
      <div className="absolute flex w-full bottom-2 h-16 mt-10 py-2 px-3">
        <input
          className="border rounded w-4/5 h-12 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder={`Tell me about ${suggestion}`}
          value={userContent}
          onChange={(e) => setUserContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-black hover:bg-gray-700 w-1/5 text-white text-size-lg font-bold py-2 px-3 focus:outline-none focus:shadow-outline"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
