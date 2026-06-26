import Store from "./Store";
import type { User, Chat } from "../mocks/types";

export interface AppState {
  user: User | null;
  isAuthChecked: boolean;
  chats: Chat[];
  activeChatId: number | null;
}

const appStore = new Store<AppState>({
  user: null,
  isAuthChecked: false,
  chats: [],
  activeChatId: null,
});

export default appStore;
