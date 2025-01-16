import React, { useEffect, useState, useRef } from "react";
import { useWebSocket } from "@/context/WebSocket";

interface SocketProps {
  username: string;
}

interface WebSocketResponse {
  status: string;
  message: string;
  data?: string[];
}

const Socket: React.FC<SocketProps> = ({ username }) => {
  const ws = useWebSocket();
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [response, setResponse] = useState<WebSocketResponse | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const wsRef = useRef<typeof ws | null>(null);

  useEffect(() => {
    wsRef.current = ws;
    try {
      if (ws) {
        ws.connect();

        ws.on("auth_error", (error: string) => {
          setAlert(error);
          console.log("WebSocket authentication error:", error);
        });

        ws.on("suggested_username_response", (response: WebSocketResponse) => {
          setResponse(response);
          setLoading(false);
          console.log("Suggested usernames from DB:", response);
          setSuggestedUsernames(response.data || []);
        });

        ws.on("connect_error", (error) => {
          setAlert(`${error}`);
          setLoading(false);
          console.log("WebSocket connection error:", error);
        });
      }
    } catch (error) {
      console.log("WebSocket error:", error);
      setAlert(String(error));
      setLoading(false);
    }
  }, [ws]);

  useEffect(() => {
    console.log("WebSocket username:", username);
    if (wsRef.current && username.length > 0) {
      setLoading(true);
      wsRef.current.emit("suggest_username_request", username, () => { });
    }
  }, [username]);

  return (
    <div className="px-3 pt-2">
      {loading ? (
        <p className="text-sm">Loading...</p>
      ) : (
        response?.status === "Success" &&
        suggestedUsernames.length > 0 && (
          <div>
            <p className="text-sm text-[#37169C] font-medium">
              {response.message}
            </p>
            <span className="text-sm italic">
              {suggestedUsernames.join(", ")}
            </span>
          </div>
        )
      )}
      {response?.status === "Error" && (
        <div>
          <p className="text-sm text-[#37169C] font-medium">
            😔 {response.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Socket;
