export interface ApiUser {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string | null;
  phone: string;
  login: string;
  email: string;
  avatar: string | null;
}

export interface ApiLastMessage {
  user: ApiUser;
  time: string;
  content: string;
}

export interface ApiChat {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  last_message: ApiLastMessage | null;
  created_by: number;
}
