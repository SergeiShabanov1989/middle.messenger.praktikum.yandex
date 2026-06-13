import Block, { type BlockOwnProps } from "../../core/Block";
import type { Chat } from "../../mocks/types";
import "./chat-sidebar.scss";

export interface ChatSidebarProps extends BlockOwnProps {
  chats: Chat[];
  activeChatId: number | null;
  onSelectChat: (id: number) => void;
  onCreateChat: () => void;
}

export default class ChatSidebar extends Block<ChatSidebarProps> {
  static componentName = "ChatSidebar";

  protected template = `
    <aside class="chat-sidebar">
      <div class="chat-sidebar__header">
        <button type="button" class="chat-sidebar__create-btn" ref="createBtn">
          <svg class="chat-sidebar__create-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1V13M1 7H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Новый чат
        </button>
        <a class="chat-sidebar__profile" href="/settings">Профиль ›</a>
      </div>
      <div class="chat-sidebar__search">
        {{{ ChatSearch }}}
      </div>
      <div class="chat-sidebar__list">
        {{{ ChatList chats=chats activeChatId=activeChatId onSelect=onSelectChat }}}
      </div>
    </aside>
  `;

  protected override componentDidMount(): void {
    const btn = this.refs["createBtn"];
    if (btn) {
      btn.addEventListener("click", () => this.props.onCreateChat());
    }
  }
}
