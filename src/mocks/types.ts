import type { ApiUser, ApiChat } from "../api/types";

export type MessageType = "in" | "out" | "date";
export type MessageStatus = "sent" | "read";

export interface Message {
  id: number;
  type: MessageType;
  text?: string;
  time?: string;
  author?: string;
  imageUrl?: string;
  status?: MessageStatus;
}

export interface ChatMember {
  id: number;
  name: string;
  login: string;
  avatarUrl: string;
  initials: string;
  isOwner: boolean;
}

export interface ChatLastMessage {
  author: string;
  text: string;
  time: string;
}

export interface Chat {
  id: number;
  title: string;
  avatarUrl: string;
  unreadCount: number;
  lastMessage: ChatLastMessage;
  members: ChatMember[];
  messages: Message[];
  createdBy: number;
}

export interface User {
  id?: number;
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  avatarUrl: string;
}

const RESOURCE_BASE = "https://ya-praktikum.tech/api/v2/resources";

export function avatarUrl(path: string | null): string {
  return path ? `${RESOURCE_BASE}${path}` : "";
}

export function apiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    login: apiUser.login,
    first_name: apiUser.first_name,
    second_name: apiUser.second_name,
    display_name: apiUser.display_name ?? "",
    phone: apiUser.phone,
    avatarUrl: avatarUrl(apiUser.avatar),
  };
}

export function apiChatToChat(apiChat: ApiChat): Chat {
  const lm = apiChat.last_message;
  return {
    id: apiChat.id,
    title: apiChat.title,
    avatarUrl: avatarUrl(apiChat.avatar),
    unreadCount: apiChat.unread_count,
    lastMessage: lm
      ? {
          author: `${lm.user.first_name} ${lm.user.second_name}`,
          text: lm.content,
          time: new Date(lm.time).toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }
      : { author: "", text: "", time: "" },
    members: [],
    messages: [],
    createdBy: apiChat.created_by,
  };
}
