/**
 * Chat WebSocket Service
 * Handles WebSocket connection lifecycle and message routing
 */

export class ChatWebSocketError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = "ChatWebSocketError";
  }
}

export interface WebSocketConfig {
  url: string;
  sessionId: number;
  token: string;
  onMessage: (data: any) => void;
  onError: (error: string) => void;
  onConnectionChange: (state: "connecting" | "open" | "closed" | "error") => void;
}

export class ChatWebSocketService {
  private socket: WebSocket | null = null;
  private didOpenRef = false;
  private config: WebSocketConfig | null = null;

  connect(config: WebSocketConfig): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.config = config;
    this.didOpenRef = false;

    const ws = new WebSocket(config.url);
    this.socket = ws;

    config.onConnectionChange("connecting");

    ws.onopen = () => {
      config.onConnectionChange("open");
      this.didOpenRef = true;
    };

    ws.onerror = () => {
      config.onConnectionChange("error");
      config.onError("WebSocket connection error. Please refresh to retry.");
    };

    ws.onclose = (event) => {
      config.onConnectionChange("closed");
      // In dev, React Strict Mode mounts/unmounts effects twice; ignore pre-open closes
      if (this.didOpenRef) {
        const codeInfo = event.code ? ` (code ${event.code})` : "";
        config.onError(event.reason || `Connection closed${codeInfo}`);
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        config.onMessage(data);
      } catch (err) {
        // Silently ignore malformed messages
      }
    };
  }

  send(message: unknown): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new ChatWebSocketError("Not connected. Please wait for the chat to reconnect.");
    }

    try {
      this.socket.send(JSON.stringify(message));
    } catch (err) {
      throw new ChatWebSocketError("Failed to send message. Please try again.");
    }
  }

  disconnect(): void {
    // Avoid closing a socket that never opened (dev double-mount)
    if (this.socket && this.didOpenRef && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
    this.socket = null;
    this.didOpenRef = false;
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  getState(): number | undefined {
    return this.socket?.readyState;
  }
}

// Singleton instance
export const chatWebSocketService = new ChatWebSocketService();
