import { WebSocket } from "ws";

// Map: socket -> room (to quickly find which room a socket is in)
export const socketToRoom = new Map<WebSocket, string>();

// Map: room -> Set of sockets (to quickly get all sockets in a room)
export const roomToSockets = new Map<string, Set<WebSocket>>();

// Optional: Map for user metadata (socket -> user info)
// export const socketToUser = new Map<WebSocket, { id: string; name: string }>();
