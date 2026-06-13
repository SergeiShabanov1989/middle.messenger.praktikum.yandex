import http from '../core/HTTPTransport';
import type { ApiChat, ApiUser } from '../api/types';

class ChatsService {
  public list(): Promise<ApiChat[]> {
    return http.get<ApiChat[]>('/chats', { offset: 0, limit: 100 });
  }

  public create(title: string): Promise<{ id: number }> {
    return http.post<{ id: number }>('/chats', { title });
  }

  public delete(chatId: number): Promise<void> {
    return http.delete<void>('/chats', { chatId });
  }

  public addUsers(chatId: number, users: number[]): Promise<void> {
    return http.put<void>('/chats/users', { users, chatId } as unknown as Record<string, unknown>);
  }

  public removeUsers(chatId: number, users: number[]): Promise<void> {
    return http.delete<void>('/chats/users', { users, chatId } as unknown as Record<string, unknown>);
  }

  public getUsers(chatId: number): Promise<ApiUser[]> {
    return http.get<ApiUser[]>(`/chats/${chatId}/users`);
  }
}

export default new ChatsService();
