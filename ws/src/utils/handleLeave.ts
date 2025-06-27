import { WebSocket } from "ws";
import { roomToSockets, socketToRoom } from "../config";
import broadcastToRoom from "./broadcastToUsers";

export default function handleLeaveRoom(socket: WebSocket) {
  const currentRoom = socketToRoom.get(socket);

  if (currentRoom) {
    // Remove socket from room's socket set
    const roomSockets = roomToSockets.get(currentRoom);
    if (roomSockets) {
      roomSockets.delete(socket);

      // Clean up empty rooms
      if (roomSockets.size === 0) {
        roomToSockets.delete(currentRoom);
        console.log(`Room (${currentRoom}) deleted`);
      }
    }

    // Remove socket from room mapping
    socketToRoom.delete(socket);

    console.log(`User left room: ${currentRoom}`);

    // Notify others in the room
    broadcastToRoom(
      currentRoom,
      {
        type: "user_left",
        roomId: currentRoom,
        message: "A user left the room",
        timestamp: new Date().toISOString(),
        userCount: roomSockets ? roomSockets.size : 0,
      },
      socket
    );
  }
}
