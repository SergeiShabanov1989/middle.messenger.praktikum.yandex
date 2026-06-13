import ChatsService from '../services/ChatsService';
import UserService from '../services/UserService';
import appStore from '../core/appStore';
import { apiChatToChat, avatarUrl } from '../mocks/types';
import { NotFoundError } from '../core/HTTPTransport';
import type { Chat, Message } from '../mocks/types';

class ChatsController {
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
    appStore.set({ activeChatId: id });
    if (id !== null) {
      void this.loadChatMembers(id).catch(console.error);
    }
  }

  private async loadChatMembers(chatId: number): Promise<void> {
    const apiUsers = await ChatsService.getUsers(chatId);
    const { chats } = appStore.getState();
    const members = apiUsers.map((u) => ({
      name: u.display_name ?? `${u.first_name} ${u.second_name}`,
      avatarUrl: avatarUrl(u.avatar),
      initials: (u.display_name ?? u.first_name).charAt(0).toUpperCase(),
    }));
    const updated = chats.map((chat) =>
      chat.id === chatId ? { ...chat, members } : chat,
    );
    appStore.set({ chats: updated });
  }

  public sendMessage(text: string): void {
    const { activeChatId, chats } = appStore.getState();
    if (activeChatId === null) return;

    const newMessage: Message = {
      id: Date.now(),
      type: 'out',
      text,
      time: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sent',
    };

    const updated = chats.map((chat) =>
      chat.id === activeChatId
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: {
              author: 'Вы',
              text,
              time: newMessage.time ?? '',
            },
          }
        : chat,
    );
    appStore.set({ chats: updated });
  }

  public async createChat(title: string): Promise<void> {
    await ChatsService.create(title);
    await this.loadChats();
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

  public async removeUserFromChat(chatId: number, login: string): Promise<void> {
    const users = await UserService.searchByLogin(login);
    if (users.length === 0) {
      throw new NotFoundError(`Пользователь с логином "${login}" не найден`);
    }
    const userId = users[0]!.id;
    await ChatsService.removeUsers(chatId, [userId]);
    await this.loadChatMembers(chatId);
  }

  public subscribe(listener: () => void): () => void {
    return appStore.subscribe(() => listener());
  }
}

export default new ChatsController();
