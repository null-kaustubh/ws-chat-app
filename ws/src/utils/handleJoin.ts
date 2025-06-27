import { WebSocket } from "ws";
import { roomToSockets, socketToRoom } from "../config";
import broadcastToRoom from "./broadcastToUsers";
import handleLeaveRoom from "./handleLeave";

export default function handleJoinRoom(socket: WebSocket, roomId: string) {
  // Leave previous room if exists
  handleLeaveRoom(socket);

  // Add socket to room mapping
  socketToRoom.set(socket, roomId);

  // Add socket to room's socket set
  if (!roomToSockets.has(roomId)) {
    roomToSockets.set(roomId, new Set());
  }
  roomToSockets.get(roomId)!.add(socket);

  // Send confirmation to user
  socket.send(
    JSON.stringify({
      type: "joined",
      roomId: roomId,
      message: `You joined ${roomId}`,
      timestamp: new Date().toISOString(),
      userCount: roomToSockets.get(roomId)!.size,
    })
  );

  // Notify other users in the room
  broadcastToRoom(
    roomId,
    {
      type: "user_joined",
      roomId: roomId,
      message: "A user joined the room",
      timestamp: new Date().toISOString(),
      userCount: roomToSockets.get(roomId)!.size,
    },
    socket
  );
}
