import Block, { type BlockOwnProps } from "../../core/Block";
import type { Chat } from "../../mocks/types";
import "./chat-list.scss";

export interface ChatListProps extends BlockOwnProps {
  chats: Chat[];
  activeChatId: number | null;
  onSelect: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default class ChatList extends Block<ChatListProps> {
  static componentName = "ChatList";

  protected template = `
    <ul class="chat-list">
      {{#each chats}}
        <li class="chat-list__item">
          {{{ChatItem
            id=id
            title=title
            avatarUrl=avatarUrl
            unreadCount=unreadCount
            lastMessageText=lastMessage.text
            lastMessageTime=lastMessage.time
            active=isActive
            onClick=../onSelect
            onDelete=../onDelete
          }}}
        </li>
      {{else}}
        <li class="chat-list__empty">Чатов пока нет</li>
      {{/each}}
    </ul>
  `;

  constructor(props: ChatListProps) {
    super({
      ...props,
      chats: props.chats.map((chat) => ({
        ...chat,
        isActive: chat.id === props.activeChatId,
      })) as Chat[],
    });
  }
}
