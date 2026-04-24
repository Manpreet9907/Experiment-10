function MessageList({ messages, currentUser }) {
  return (
    <>
      {messages.map((msg, i) => {
        const isMe = msg.sender === currentUser;
        return (
          <div key={i} className={`message-wrapper ${isMe ? "me" : "them"}`}>
            <div className="message-bubble">
              {!isMe && <span className="sender-name">{msg.sender}</span>}
              <p style={{ margin: 0 }}>{msg.content}</p>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default MessageList;