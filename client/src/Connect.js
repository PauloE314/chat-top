import { useState } from "react";
import { io } from "socket.io-client";

export function Connect({ onConnect }) {
  const [name, setName] = useState("");

  const handleConnectionSubmit = (event) => {
    event.preventDefault();

    const socket = io(process.env.REACT_APP_SERVER_URL, {
      reconnection: false,
      transports: ["websocket", "polling"],
      auth: {
        name,
      },
    });

    socket.once("connect", () => {
      socket.once("client-join", ({ clientsCount }) =>
        onConnect({ socket, name, clientsCount })
      );
    });

    socket.once("connect_error", () =>
      alert("An error occurred during connection, please try again")
    );
  };

  return (
    <div id="connect-container">
      <h1>Welcome to Chat Top</h1>
      <form onSubmit={handleConnectionSubmit}>
        <input
          type="text"
          placeholder="Your name"
          onChange={(event) => setName(event.target.value)}
          value={name}
          required
        />
        <button type="submit">Join!</button>
      </form>
    </div>
  );
}
