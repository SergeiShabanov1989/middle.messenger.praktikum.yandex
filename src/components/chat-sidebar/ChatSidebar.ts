import Block, { type BlockOwnProps } from "../../core/Block";
import type { Chat } from "../../mocks/types";
import "./chat-sidebar.scss";

export interface ChatSidebarProps extends BlockOwnProps {
  chats: Chat[];
  activeChatId: number | null;
  onSelectChat: (id: number) => void;
}

export default class ChatSidebar extends Block<ChatSidebarProps> {
  static componentName = "ChatSidebar";

  protected template = `
    <aside class="chat-sidebar">
      <div class="chat-sidebar__header">
        <a class="chat-sidebar__profile" href="/profile">Профиль ›</a>
      </div>
      <div class="chat-sidebar__search">
        {{{ ChatSearch }}}
      </div>
      <div class="chat-sidebar__list">
        {{{ ChatList chats=chats activeChatId=activeChatId onSelect=onSelectChat }}}
      </div>
    </aside>
  `;
}
