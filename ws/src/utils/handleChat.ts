import { WebSocket } from "ws";
import { socketToRoom } from "../config";
import broadcastToRoom from "./broadcastToUsers";

export default function handleChatMessage(socket: WebSocket, message: string) {
  // Lookup to get user's room
  const room = socketToRoom.get(socket);

  if (!room) {
    socket.send(
      JSON.stringify({
        type: "error",
        message: "you must join a room first",
      })
    );
    return;
  }

  // Broadcast message to all user's in the room
  broadcastToRoom(room, {
    type: "chat",
    message: message,
    roomId: room,
    timestamp: new Date().toISOString(),
  });
}
