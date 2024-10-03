import React, { useState, useEffect } from "react";
import axios from "axios";
import EachChat from "./EachChat";

const port = process.env.PORT || 5000;
const serverURL = process.env.SERVER_URL || `http://localhost:${port}/login`;

interface ChatLog {
  message: string;
  response: string;
}

interface ChatbotProps {
  suggestion?: string;
}

const ChatWindow: React.FC<ChatbotProps> = ({ suggestion = "" }) => {
  const [message, setMessage] = useState<string>("");
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);

  useEffect(() => {
    const fetchChatLogs = async () => {
      try {
        const response = await axios.get(`${serverURL}/chat/all`);
        setChatLogs(response.data);
      } catch (error) {
        console.error("Error fetching chat logs:", error);
      }
    };

    const openSite = async () => {
      try {
        const response = await axios.get(`${serverURL}/`);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching site:", error);
      }
    };

    openSite();
    fetchChatLogs();
  }, []);

  const handleSend = async () => {
    if (message.trim() === "") return;

    try {
      const response = await axios.post(
        `${serverURL}/chat`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botResponse = response.data;
      setChatLogs([...chatLogs, { message, response: botResponse }]);
      setMessage("");
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
        setMessage(`Tell me about ${suggestion}`);
      }
    }
  };

  return (
    <div className="flex flex-col absolute origin-center w-full h-full border-solid border-1 border-neutral-300 bg-neutral-300 rounded-lg shadow-lg bottom-0">
      <div className="flex-grow overflow-y-auto">
        <div className=" overflow-y-auto flex-col">
          <div style={{ flexGrow: 1, overflowY: "auto", padding: "10px" }}>
            {chatLogs.map((log, index) => (
              <EachChat
                key={index}
                message={log.message}
                response={log.response}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 flex h-16 py-2 px-3">
        <input
          className="bg-white border rounded w-4/5 h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder={`Tell me about ${suggestion}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-white hover:bg-gray-400 w-1/5 text-gray-900 rounded font-bold py-2 px-3 focus:outline-none focus:shadow-outline"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
