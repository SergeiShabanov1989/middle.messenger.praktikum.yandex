export interface WsApiFile {
  id: number;
  user_id: number;
  path: string;
  filename: string;
  content_type: string;
  content_size: number;
  upload_date: string;
}

export interface WsApiMessage {
  id?: string;
  chat_id?: number;
  content: string;
  time: string;
  type: string;
  user_id: string;
  is_read?: boolean;
  file?: WsApiFile;
}

type WsData = WsApiMessage | WsApiMessage[] | { type: string };
type DataHandler = (data: WsData) => void;

export default class WebSocketTransport {
  private readonly url: string;
  private socket: WebSocket | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private handlers: DataHandler[] = [];
  private onCloseCallback: (() => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.url);

      this.socket.addEventListener("open", () => {
        this.startPing();
        resolve();
      });

      this.socket.addEventListener("error", () => {
        reject(new Error("WebSocket connection error"));
      });

      this.socket.addEventListener("message", ({ data }) => {
        try {
          const parsed = JSON.parse(data as string) as WsData;
          this.handlers.forEach((h) => h(parsed));
        } catch {
          // non-JSON frame, ignore
        }
      });

      this.socket.addEventListener("close", () => {
        this.stopPing();
        this.socket = null;
        this.onCloseCallback?.();
      });
    });
  }

  getHistory(offset = 0): void {
    this.socket?.send(
      JSON.stringify({ content: String(offset), type: "get old" }),
    );
  }

  send(text: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ content: text, type: "message" }));
    }
  }

  onMessage(handler: DataHandler): void {
    this.handlers.push(handler);
  }

  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }

  close(): void {
    this.stopPing();
    this.socket?.close();
    this.socket = null;
    this.handlers = [];
  }

  private startPing(): void {
    this.pingTimer = setInterval(() => {
      this.socket?.send(JSON.stringify({ type: "ping" }));
    }, 30_000);
  }

  private stopPing(): void {
    if (this.pingTimer !== null) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
}
