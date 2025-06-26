import { WebSocket } from "ws";
import handleLeaveRoom from "./handleLeave";

export default function handleDisconnection(socket: WebSocket) {
  handleLeaveRoom(socket);
  console.log(`User disconnected`);
}
