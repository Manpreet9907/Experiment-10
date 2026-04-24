import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const clientRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        client.subscribe("/topic/messages", (msg) => {
          const data = JSON.parse(msg.body);
          setMessages((prev) => [...prev, data]);
        });
      },
    });
    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify({ sender: username, content: text }),
      });
    }
  };

  if (!isJoined) {
    return (
      <div className="app">
        <div className="chat-container" style={{padding: '50px', textAlign: 'center', justifyContent: 'center'}}>
           <h2 style={{color: '#e9edef'}}>WhatsApp Web</h2>
           <input 
             style={{padding: '12px', width: '80%', marginBottom: '20px', borderRadius: '8px', border: 'none'}}
             onChange={(e) => setUsername(e.target.value)}
             placeholder="Enter your name..."
           />
           <button 
             style={{width: '85%', padding: '12px', backgroundColor: '#00a884', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}} 
             onClick={() => setIsJoined(true)}
           >
             Continue to Chat
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h2>{username}</h2>
        </div>
        <div className="messages-window">
          <MessageList messages={messages} currentUser={username} />
          <div ref={scrollRef} />
        </div>
        <MessageInput sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default Chat;