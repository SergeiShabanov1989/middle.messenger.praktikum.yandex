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
  name: string;
  avatarUrl: string;
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
}

export interface User {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  avatarUrl: string;
}
