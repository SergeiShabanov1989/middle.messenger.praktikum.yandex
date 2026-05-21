import { chats as initialChats } from "../mocks/chats";
import type { Chat, Message } from "../mocks/types";

class ChatsService {
  private chats: Chat[] = initialChats.map((chat) => ({
    ...chat,
    messages: [...chat.messages],
  }));

  public list(): Chat[] {
    return this.chats;
  }

  public getById(id: number): Chat | null {
    return this.chats.find((chat) => chat.id === id) ?? null;
  }

  public sendMessage(chatId: number, text: string): Message | null {
    const chat = this.getById(chatId);
    if (!chat) return null;

    const newMessage: Message = {
      id: Date.now(),
      type: "out",
      text,
      time: this.formatTime(new Date()),
      status: "sent",
    };
    chat.messages.push(newMessage);
    chat.lastMessage = {
      author: "Вы",
      text,
      time: newMessage.time ?? "",
    };
    return newMessage;
  }

  private formatTime(date: Date): string {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
}

export default new ChatsService();
