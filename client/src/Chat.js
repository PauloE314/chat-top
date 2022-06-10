import { useEffect, useState } from "react";

export function Chat({ socket, initialClientsCount, onServerDown }) {
  const [count, setCount] = useState(initialClientsCount || 1);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const handleMessageTextSubmit = (event) => {
    event.preventDefault();
    socket.emit("client-message", { text: messageText });
    setMessageText("");
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("client-message", ({ clientName, clientId, text }) =>
      setMessages((messages) => [
        ...messages,
        { clientId, clientName, text, type: "message" },
      ])
    );

    socket.on("client-join", ({ clientName, clientsCount }) => {
      setCount(clientsCount);
      setMessages((messages) => [
        ...messages,
        { text: `${clientName} entrou na sala`, type: "notify" },
      ]);
    });

    socket.on("client-disconnect", ({ clientName, clientsCount }) => {
      setCount(clientsCount);
      setMessages((messages) => [
        ...messages,
        { text: `${clientName} saiu da sala`, type: "notify" },
      ]);
    });

    socket.once("disconnect", () => {
      alert("Server is down!");
      onServerDown();
    });

    return () => {
      socket.off("client-message");
      socket.off("client-join");
      socket.off("client-disconnect");
    };
  }, [socket, onServerDown]);

  return (
    <div id="chat-container">
      <header>
        <h2>Chat Top</h2>
        <span>Usuários conectados: {count}</span>
      </header>

      <ul>
        <li className="notify-item">
          <span className="notify">Você entrou na sala</span>
        </li>

        {messages.map((message, index) =>
          message.type === "message" ? (
            <li
              key={index}
              className={
                message.clientId === socket.id
                  ? "self-message-item"
                  : "message-item"
              }
            >
              <span className="client">{message.clientName}</span>
              <span className="text">{message.text}</span>
            </li>
          ) : (
            <li key={index} className="notify-item">
              <span className="notify">{message.text}</span>
            </li>
          )
        )}
      </ul>

      <form onSubmit={handleMessageTextSubmit}>
        <input
          type="text"
          placeholder="Text..."
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
