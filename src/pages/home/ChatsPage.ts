import Block, { type BlockOwnProps } from "../../core/Block";
import ChatsController from "../../controllers/ChatsController";
import type { Chat } from "../../mocks/types";
import "../../components/chat-item/chat-item.scss";
import "../../components/chat-list/chat-list.scss";
import "../../components/chat-search/chat-search.scss";
import "../../components/chat-sidebar/chat-sidebar.scss";
import "../../components/chat-window/chat-window.scss";
import "../../components/message/message.scss";
import "./home.scss";

interface ChatsPageProps extends BlockOwnProps {
  chats: Chat[];
  activeChat: Chat | null;
  activeChatId: number | null;
  hasActive: boolean;
  onSelect: (id: number) => void;
  onBack: () => void;
  onSend: (text: string) => void;
}

export default class ChatsPage extends Block<ChatsPageProps> {
  protected template = `
    <main class="chats-page{{#if hasActive}} chats-page--has-active{{/if}}">
      <div class="chats-page__layout">
        <div class="chats-page__sidebar">
          {{{ ChatSidebar chats=chats activeChatId=activeChatId onSelectChat=onSelect }}}
        </div>
        <div class="chats-page__main">
          {{#if activeChat}}
            {{{ ChatWindow
              title=activeChat.title
              avatarUrl=activeChat.avatarUrl
              messages=activeChat.messages
              onBack=onBack
              onSend=onSend
            }}}
          {{else}}
            <div class="chat-empty">
              <p class="chat-empty__text">Выберите чат чтобы отправить сообщение</p>
            </div>
          {{/if}}
        </div>
      </div>
    </main>
  `;

  private unsubscribe: (() => void) | null = null;

  constructor() {
    const props = ChatsPage.buildProps();
    super({
      ...props,
      onSelect: (id: number) => {
        ChatsController.selectChat(id);
      },
      onBack: () => {
        ChatsController.selectChat(null);
      },
      onSend: (text: string) => {
        ChatsController.sendMessage(text);
      },
    });
  }

  private static buildProps(): {
    chats: Chat[];
    activeChat: Chat | null;
    activeChatId: number | null;
    hasActive: boolean;
  } {
    const chats = ChatsController.list();
    const activeChat = ChatsController.getActive();
    const activeChatId = ChatsController.getActiveId();
    return {
      chats,
      activeChat,
      activeChatId,
      hasActive: activeChat !== null,
    };
  }

  protected override componentDidMount(): void {
    if (!this.unsubscribe) {
      this.unsubscribe = ChatsController.subscribe(() => {
        this.setProps(ChatsPage.buildProps());
      });
    }
  }

  protected override componentWillUnmount(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
