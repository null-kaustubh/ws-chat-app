import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Join() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const generateRandomRoomId = () => {
    // Generate a random 6-character room ID
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      // Navigate to chat with room ID as state
      navigate("/chat", { state: { roomId: roomId.trim() } });
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRandomRoomId();
    // Navigate to chat with the generated room ID
    navigate("/chat", { state: { roomId: newRoomId } });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-bg-primary p-4">
      <div className="w-full max-w-md bg-bg-primary border border-bg-tertiary rounded-4xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Chat Room
          </h1>
          <p className="text-text-secondary">
            Join an existing room or create a new one
          </p>
        </div>

        <div className="space-y-6">
          {/* Join Room Form */}
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label
                htmlFor="roomId"
                className="block text-text-primary font-medium mb-2"
              >
                Room ID
              </label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full rounded-full h-12 bg-bg-secondary px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent-secondary font-light text-text-primary"
                placeholder="Enter room ID (e.g., ABC123)"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent-primary text-bg-primary border-none rounded-full h-12 font-medium cursor-pointer transition-all duration-200 hover:bg-accent-secondary disabled:bg-text-muted disabled:cursor-not-allowed"
              disabled={!roomId.trim()}
            >
              Join Room
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-bg-tertiary"></div>
            <span className="px-4 text-text-secondary text-sm">or</span>
            <div className="flex-1 border-t border-bg-tertiary"></div>
          </div>

          {/* Create Room Button */}
          <button
            onClick={handleCreateRoom}
            className="w-full bg-bg-secondary text-text-primary border border-bg-tertiary rounded-full h-12 font-medium cursor-pointer transition-all duration-200 hover:bg-bg-tertiary"
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Join;
