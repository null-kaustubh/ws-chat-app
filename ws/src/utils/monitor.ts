import { roomToSockets, socketToRoom } from "../config";

function getRoomStats() {
  const stats: { [room: string]: number } = {};
  roomToSockets.forEach((sockets, room) => {
    stats[room] = sockets.size;
  });
  return stats;
}

function getTotalConnections(): number {
  return socketToRoom.size;
}

setInterval(() => {
  console.log(`Room stats: ${getRoomStats()}`);
  console.log(`Total connections: ${getTotalConnections()}`);
}, 30000);
