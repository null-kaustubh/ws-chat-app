import { WebSocketServer, WebSocket } from "ws";
import handleJoinRoom from "./utils/handleJoin";
import handleChatMessage from "./utils/handleChat";
import handleLeaveRoom from "./utils/handleLeave";
import handleDisconnection from "./utils/handleDisconnect";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function (socket) {
  console.log("New connection established");

  socket.on("message", function (message) {
    try {
      const parsedMessage = JSON.parse(message.toString());

      if (parsedMessage.type === "join") {
        handleJoinRoom(socket, parsedMessage.payload.roomId);
      }

      if (parsedMessage.type === "chat") {
        handleChatMessage(socket, parsedMessage.payload.message);
      }

      if (parsedMessage.type === "leave") {
        handleLeaveRoom(socket);
      }
    } catch (e) {
      console.error(`Error parsing message: ${e}`);
    }
  });

  socket.on("close", function () {
    handleDisconnection(socket);
  });
});
