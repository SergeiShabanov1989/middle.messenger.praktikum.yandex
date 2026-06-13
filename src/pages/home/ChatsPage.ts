import Block, { type BlockOwnProps } from "../../core/Block";
import ChatsController from "../../controllers/ChatsController";
import { ApiError } from "../../core/HTTPTransport";
import UserModal from "../../components/user-modal/UserModal";
import type { Chat, ChatMember } from "../../mocks/types";
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
  membersPreview: ChatMember[];
  membersMore: number;
  onSelect: (id: number) => void;
  onBack: () => void;
  onSend: (text: string) => void;
  onAddUser: () => void;
  onRemoveUser: () => void;
  onCreateChat: () => void;
}

export default class ChatsPage extends Block<ChatsPageProps> {
  protected template = `
    <main class="chats-page{{#if hasActive}} chats-page--has-active{{/if}}">
      <div class="chats-page__layout">
        <div class="chats-page__sidebar">
          {{{ ChatSidebar chats=chats activeChatId=activeChatId onSelectChat=onSelect onCreateChat=onCreateChat }}}
        </div>
        <div class="chats-page__main">
          {{#if activeChat}}
            {{{ ChatWindow
              title=activeChat.title
              avatarUrl=activeChat.avatarUrl
              messages=activeChat.messages
              membersPreview=membersPreview
              membersMore=membersMore
              onBack=onBack
              onSend=onSend
              onAddUser=onAddUser
              onRemoveUser=onRemoveUser
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
  private chatsLoaded = false;
  private readonly userModal: UserModal;

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
      onAddUser: () => {
        this.openUserModal("Добавить участника", "add");
      },
      onRemoveUser: () => {
        this.openUserModal("Удалить участника", "remove");
      },
      onCreateChat: () => {
        this.handleCreateChat();
      },
    });
    this.userModal = new UserModal();
  }

  private static buildProps(): {
    chats: Chat[];
    activeChat: Chat | null;
    activeChatId: number | null;
    hasActive: boolean;
    membersPreview: ChatMember[];
    membersMore: number;
  } {
    const chats = ChatsController.getChats();
    const activeChat = ChatsController.getActive();
    const activeChatId = ChatsController.getActiveId();
    const members = activeChat?.members ?? [];
    return {
      chats,
      activeChat,
      activeChatId,
      hasActive: activeChat !== null,
      membersPreview: members.slice(0, 4),
      membersMore: Math.max(0, members.length - 4),
    };
  }

  private openUserModal(title: string, action: "add" | "remove"): void {
    const chatId = this.props.activeChatId;
    if (!chatId) return;

    this.userModal.show(title, (login) => {
      const operation =
        action === "add"
          ? ChatsController.addUserToChat(chatId, login)
          : ChatsController.removeUserFromChat(chatId, login);

      void operation
        .then(() => {
          this.userModal.hide();
        })
        .catch((err: unknown) => {
          const msg =
            err instanceof ApiError ? err.reason : "Ошибка операции";
          this.userModal.showError(msg);
        });
    });
  }

  protected override componentDidMount(): void {
    if (!this.unsubscribe) {
      this.unsubscribe = ChatsController.subscribe(() => {
        this.setProps(ChatsPage.buildProps());
      });
    }

    if (!this.chatsLoaded) {
      this.chatsLoaded = true;
      void ChatsController.loadChats().catch((err: unknown) => {
        console.error("[ChatsPage] loadChats error", err);
      });
    }
  }

  protected override componentWillUnmount(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  private handleCreateChat(): void {
    this.userModal.show(
      "Новый чат",
      (title) => {
        void ChatsController.createChat(title)
          .then(() => this.userModal.hide())
          .catch((err: unknown) => {
            const msg =
              err instanceof ApiError ? err.reason : "Ошибка создания чата";
            this.userModal.showError(msg);
          });
      },
      {
        label: "Название чата",
        placeholder: "Например: Команда разработки",
        confirmText: "Создать",
        emptyError: "Введите название чата",
      },
    );
  }
}
