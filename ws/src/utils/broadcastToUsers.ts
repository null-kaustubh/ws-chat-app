import { WebSocket } from "ws";
import { roomToSockets } from "../config";
import handleDisconnection from "./handleDisconnect";

export default function broadcastToRoom(
  roomId: string,
  payload: any,
  excludeSocket?: WebSocket
) {
  const roomSockets = roomToSockets.get(roomId);

  if (!roomSockets || roomSockets.size === 0) {
    console.log(`No user in room ${roomId} to broadcast to`);
    return;
  }

  const messageString = JSON.stringify(payload);
  let broadcastCount = 0;

  roomSockets.forEach((socket) => {
    if (socket !== excludeSocket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(messageString);
        broadcastCount++;
      } catch (e) {
        console.error(`Error sending message: ${e}`);
        handleDisconnection(socket);
      }
    }
  });

  console.log(`Broadcasted to ${broadcastCount} users in room ${roomId}`);
}
