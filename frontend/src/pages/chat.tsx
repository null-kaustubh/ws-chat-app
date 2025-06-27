import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Send } from "lucide-react";

type Message = {
  type: "chat" | "system";
  content: string;
  sender: "me" | "other" | "system";
};

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [roomId, setRoomId] = useState("");
  const [userCount, setUserCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get room ID from navigation state or redirect to join page
  useEffect(() => {
    const roomIdFromState = location.state?.roomId;
    if (!roomIdFromState) {
      navigate("/");
      return;
    }
    setRoomId(roomIdFromState);
  }, [location.state, navigate]);

  useEffect(() => {
    if (!roomId) return;

    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        if (data.type === "chat") {
          setMessages((m) => [
            ...m,
            { type: "chat", content: data.message, sender: "other" },
          ]);
        } else if (
          data.type === "joined" ||
          data.type === "user_joined" ||
          data.type === "user_left"
        ) {
          // Add join notifications as system messages
          setMessages((m) => [
            ...m,
            { type: "system", content: data.message, sender: "system" },
          ]);

          // Update room info if provided
          if (data.roomId) {
            setRoomId(data.roomId);
          }
          if (data.userCount !== undefined) {
            setUserCount(data.userCount);
          }
        }
      } catch {
        // If it's not valid JSON, treat it as a plain message
        setMessages((m) => [
          ...m,
          { type: "chat", content: e.data, sender: "other" },
        ]);
      }
    };
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: roomId,
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-bg-primary p-4">
      <div className="w-full max-w-3xl h-180 bg-bg-primary border border-bg-tertiary rounded-4xl flex flex-col">
        {/* header */}
        <div className="bg-bg-secondary p-4 border-b border-bg-tertiary rounded-t-4xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-text-primary font-medium">RoomId:</span>
                <span className="text-accent-primary font-semibold">
                  {roomId || "Connecting..."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-sm">users:</span>
                <span className="text-text-primary font-semibold">
                  {userCount}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                if (wsRef.current) {
                  // Send leave message to backend
                  wsRef.current.send(
                    JSON.stringify({
                      type: "leave",
                    })
                  );
                  // Close the WebSocket connection
                  wsRef.current.close();
                }
                // Navigate back to join page
                navigate("/");
              }}
              className="bg-bg-tertiary hover:bg-red-500/20 text-text-secondary hover:text-red-500 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 border border-bg-tertiary hover:border-red-500 cursor-pointer"
            >
              Leave Room
            </button>
          </div>
        </div>

        {/* chat area */}
        <div className="flex-1 flex flex-col gap-2 p-4 mt-2 overflow-y-auto">
          {messages.map((m, index) => {
            if (m.type === "system") {
              return (
                <div key={index} className="flex justify-center">
                  <span className="text-text-secondary bg-bg-tertiary px-4 py-1 text-sm rounded-full text-center">
                    {m.content}
                  </span>
                </div>
              );
            }

            // Chat messages - show on right if sent by me, left if received
            const isMyMessage = m.sender === "me";
            return (
              <div
                key={index}
                className={`flex ${
                  isMyMessage ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`text-text-primary px-4 py-2 font-light rounded-full ${
                    isMyMessage
                      ? "bg-accent-primary text-bg-primary"
                      : "bg-bg-secondary"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            );
          })}
        </div>

        {/* input area */}
        <div className="p-4 border-t border-bg-tertiary">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={inputMsg}
              className="flex-1 rounded-full h-10 bg-bg-secondary px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent-secondary font-light"
              placeholder="Type your message..."
              onChange={(e) => {
                setInputMsg(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputMsg.trim()) {
                  if (wsRef.current) {
                    setMessages((m) => [
                      ...m,
                      { type: "chat", content: inputMsg, sender: "me" },
                    ]);
                    wsRef.current.send(
                      JSON.stringify({
                        type: "chat",
                        payload: {
                          message: inputMsg,
                        },
                      })
                    );
                  }
                  setInputMsg("");
                }
              }}
            />
            <button
              type="submit"
              className="bg-accent-primary text-bg-primary border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-accent-secondary hover:scale-105 active:scale-95 disabled:bg-text-muted disabled:cursor-not-allowed disabled:transform-none flex-shrink-0"
              onClick={() => {
                if (wsRef.current && inputMsg.trim()) {
                  // Add your own message to the chat immediately
                  setMessages((m) => [
                    ...m,
                    { type: "chat", content: inputMsg, sender: "me" },
                  ]);

                  wsRef.current.send(
                    JSON.stringify({
                      type: "chat",
                      payload: {
                        message: inputMsg,
                      },
                    })
                  );
                }
                setInputMsg("");
              }}
            >
              <Send className="w-[20px] h-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
