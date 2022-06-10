import { useState } from "react";
import { Chat } from "./Chat";
import { Connect } from "./Connect";

import "./index.css";

export function App() {
  const [socketContext, setSocketContext] = useState();
  const [inChat, setInChat] = useState(false);

  const handleConnection = (context) => {
    setSocketContext(context);
    setInChat(true);
  };

  const handleServerDown = () => {
    setInChat(false);
    setSocketContext(undefined);
  };

  return inChat ? (
    <Chat
      socket={socketContext.socket}
      name={socketContext.name}
      initialClientsCount={socketContext.clientsCount}
      onServerDown={handleServerDown}
    />
  ) : (
    <Connect onConnect={handleConnection} />
  );
}
