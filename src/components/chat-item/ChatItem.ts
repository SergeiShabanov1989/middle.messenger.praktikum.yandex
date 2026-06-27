import Block, { type BlockOwnProps } from "../../core/Block";
import "./chat-item.scss";

export interface ChatItemProps extends BlockOwnProps {
  id: number;
  title: string;
  avatarUrl: string;
  unreadCount: number;
  lastMessageText: string;
  lastMessageTime: string;
  active: boolean;
  onClick: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default class ChatItem extends Block<ChatItemProps> {
  static componentName = "ChatItem";

  protected template = `
    <article class="chat-item{{#if active}} chat-item--active{{/if}}" data-id="{{id}}">
      <div class="chat-item__avatar">
        <img class="chat-item__avatar-img" src="{{avatarUrl}}" alt="Аватар чата" />
      </div>
      <div class="chat-item__body">
        <h2 class="chat-item__title">{{title}}</h2>
        <p class="chat-item__preview">{{lastMessageText}}</p>
      </div>
      <div class="chat-item__meta">
        <time class="chat-item__time">{{lastMessageTime}}</time>
        {{#if unreadCount}}
          <span class="chat-item__badge">{{unreadCount}}</span>
        {{/if}}
        <button type="button" class="chat-item__delete-btn" ref="deleteBtn" aria-label="Удалить чат">✕</button>
      </div>
    </article>
  `;

  constructor(props: ChatItemProps) {
    super(props);
    this.events = {
      click: () => props.onClick(props.id),
    };
  }

  protected override componentDidMount(): void {
    const deleteBtn = this.refs["deleteBtn"];
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.props.onDelete?.(this.props.id);
      });
    }
  }
}
