import ChatsService from "../services/ChatsService";
import EventBus from "../core/EventBus";
import type { Chat, Message } from "../mocks/types";

type ChatsEvent = "changed";

class ChatsController {
  private bus = new EventBus<ChatsEvent>();

  private activeChatId: number | null = null;

  public list(): Chat[] {
    return ChatsService.list();
  }

  public getActive(): Chat | null {
    return this.activeChatId !== null
      ? ChatsService.getById(this.activeChatId)
      : null;
  }

  public getActiveId(): number | null {
    return this.activeChatId;
  }

  public selectChat(id: number | null): void {
    this.activeChatId = id;
    this.bus.emit("changed");
  }

  public sendMessage(text: string): Message | null {
    if (this.activeChatId === null) return null;
    const message = ChatsService.sendMessage(this.activeChatId, text);
    this.bus.emit("changed");
    return message;
  }

  public subscribe(listener: () => void): () => void {
    const handler = () => listener();
    this.bus.on("changed", handler);
    return () => this.bus.off("changed", handler);
  }
}

export default new ChatsController();
