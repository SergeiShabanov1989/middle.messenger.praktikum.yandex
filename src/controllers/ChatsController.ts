import ChatsService from "../services/ChatsService";
import UserService from "../services/UserService";
import appStore from "../core/appStore";
import WebSocketTransport from "../core/WebSocketTransport";
import type { WsApiMessage } from "../core/WebSocketTransport";
import { apiChatToChat, avatarUrl } from "../mocks/types";
import { NotFoundError } from "../core/HTTPTransport";
import type { Chat, Message } from "../mocks/types";

class ChatsController {
  private ws: WebSocketTransport | null = null;

  public async loadChats(): Promise<void> {
    const apiChats = await ChatsService.list();
    appStore.set({ chats: apiChats.map(apiChatToChat) });
  }

  public getChats(): Chat[] {
    return appStore.getState().chats;
  }

  public getActive(): Chat | null {
    const { chats, activeChatId } = appStore.getState();
    return chats.find((c) => c.id === activeChatId) ?? null;
  }

  public getActiveId(): number | null {
    return appStore.getState().activeChatId;
  }

  public selectChat(id: number | null): void {
    this.ws?.close();
    this.ws = null;

    appStore.set({ activeChatId: id });

    if (id !== null) {
      void this.loadChatMembers(id).catch(console.error);
      void this.connectWs(id).catch(console.error);
    }
  }

  private async connectWs(chatId: number, attempt = 0): Promise<void> {
    if (appStore.getState().activeChatId !== chatId) return;

    const { user } = appStore.getState();
    const userId = user?.id;
    if (!userId) return;

    const { token } = await ChatsService.getToken(chatId);
    const url = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;
    const ws = new WebSocketTransport(url);
    this.ws = ws;

    ws.onMessage((data) => {
      this.handleWsData(chatId, data);
    });

    ws.onClose(() => {
      if (
        this.ws === ws &&
        appStore.getState().activeChatId === chatId &&
        attempt < 3
      ) {
        this.ws = null;
        setTimeout(
          () => {
            void this.connectWs(chatId, attempt + 1).catch(console.error);
          },
          1000 * (attempt + 1),
        );
      }
    });

    try {
      await ws.connect();
      ws.getHistory();
    } catch (err) {
      console.error(
        "[ChatsController] WS connect error (attempt " + String(attempt) + ")",
        err,
      );
      if (this.ws === ws) {
        this.ws = null;
        if (attempt < 3 && appStore.getState().activeChatId === chatId) {
          setTimeout(
            () => {
              void this.connectWs(chatId, attempt + 1).catch(console.error);
            },
            1000 * (attempt + 1),
          );
        }
      }
    }
  }

  private handleWsData(
    chatId: number,
    data: WsApiMessage | WsApiMessage[] | { type: string },
  ): void {
    const { user } = appStore.getState();
    const currentUserId = user?.id ?? -1;

    if (Array.isArray(data)) {
      const messages = (data as WsApiMessage[])
        .filter((m) => m.type === "message")
        .reverse() // API returns newest-first, display oldest-first
        .map((m) => this.wsToMessage(m, currentUserId));
      this.setChatMessages(chatId, messages);
    } else if ((data as WsApiMessage).type === "message") {
      const wsMsg = data as WsApiMessage;
      const msg = this.wsToMessage(wsMsg, currentUserId);
      this.appendChatMessage(chatId, msg, wsMsg.user_id);
    }
    // ignore: pong, user connected, etc.
  }

  private wsToMessage(wsMsg: WsApiMessage, currentUserId: number): Message {
    return {
      id: parseInt(wsMsg.id ?? "0", 10),
      type: Number(wsMsg.user_id) === currentUserId ? "out" : "in",
      text: wsMsg.content,
      time: new Date(wsMsg.time).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: wsMsg.is_read ? "read" : "sent",
    };
  }

  private setChatMessages(chatId: number, messages: Message[]): void {
    const { chats } = appStore.getState();
    const updated = chats.map((c) =>
      c.id === chatId ? { ...c, messages } : c,
    );
    appStore.set({ chats: updated });
  }

  private appendChatMessage(
    chatId: number,
    message: Message,
    senderUserId: string,
  ): void {
    const { chats } = appStore.getState();
    const updated = chats.map((c) => {
      if (c.id !== chatId) return c;
      const senderName =
        message.type === "out"
          ? "Вы"
          : (c.members.find((m) => m.id === Number(senderUserId))?.name ?? "");
      return {
        ...c,
        messages: [...c.messages, message],
        lastMessage: {
          author: senderName,
          text: message.text ?? "",
          time: message.time ?? "",
        },
      };
    });
    appStore.set({ chats: updated });
  }

  public sendMessage(text: string): void {
    this.ws?.send(text);
  }

  private async loadChatMembers(chatId: number): Promise<void> {
    const apiUsers = await ChatsService.getUsers(chatId);
    const { chats } = appStore.getState();
    const chat = chats.find((c) => c.id === chatId);
    const createdBy = chat?.createdBy ?? -1;
    const members = apiUsers.map((u) => ({
      id: u.id,
      name: u.display_name ?? `${u.first_name} ${u.second_name}`,
      login: u.login,
      avatarUrl: avatarUrl(u.avatar),
      initials: (u.display_name ?? u.first_name).charAt(0).toUpperCase(),
      isOwner: u.id === createdBy,
    }));
    const updated = chats.map((c) => (c.id === chatId ? { ...c, members } : c));
    appStore.set({ chats: updated });
  }

  public async createChat(title: string): Promise<void> {
    await ChatsService.create(title);
    await this.loadChats();
  }

  public async deleteChat(chatId: number): Promise<void> {
    await ChatsService.delete(chatId);
    const { activeChatId } = appStore.getState();
    if (activeChatId === chatId) {
      this.ws?.close();
      this.ws = null;
      appStore.set({ activeChatId: null });
    }
    await this.loadChats();
  }

  public async updateChatAvatar(chatId: number, file: File): Promise<void> {
    const fd = new FormData();
    fd.append("chatId", String(chatId));
    fd.append("avatar", file);
    const apiChat = await ChatsService.updateAvatar(fd);
    const { chats } = appStore.getState();
    const updated = chats.map((c) =>
      c.id === chatId ? { ...c, avatarUrl: avatarUrl(apiChat.avatar) } : c,
    );
    appStore.set({ chats: updated });
  }

  public async addUserToChat(chatId: number, login: string): Promise<void> {
    const users = await UserService.searchByLogin(login);
    if (users.length === 0) {
      throw new NotFoundError(`Пользователь с логином "${login}" не найден`);
    }
    const userId = users[0]!.id;
    await ChatsService.addUsers(chatId, [userId]);
    await this.loadChatMembers(chatId);
  }

  public async removeUserFromChat(
    chatId: number,
    login: string,
  ): Promise<void> {
    const users = await UserService.searchByLogin(login);
    if (users.length === 0) {
      throw new NotFoundError(`Пользователь с логином "${login}" не найден`);
    }
    const userId = users[0]!.id;
    await ChatsService.removeUsers(chatId, [userId]);
    await this.loadChatMembers(chatId);
  }

  public async removeUserFromChatById(
    chatId: number,
    userId: number,
  ): Promise<void> {
    await ChatsService.removeUsers(chatId, [userId]);
    await this.loadChatMembers(chatId);
  }

  public subscribe(listener: () => void): () => void {
    return appStore.subscribe(() => listener());
  }
}

export default new ChatsController();
