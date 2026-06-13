import Block, { type BlockOwnProps } from "../../core/Block";
import type { Message as MessageData, ChatMember } from "../../mocks/types";
import iconPaperclip from "./icons/paperclip.svg?raw";
import iconArrowRight from "./icons/arrow-right.svg?raw";
import iconArrowLeft from "./icons/arrow-left.svg?raw";
import { validateField } from "../../core/validators";
import "./chat-window.scss";

export interface ChatWindowProps extends BlockOwnProps {
  title: string;
  avatarUrl: string;
  messages: MessageData[];
  membersPreview?: ChatMember[];
  membersMore?: number;
  onBack: () => void;
  onSend: (text: string) => void;
  onAddUser?: () => void;
  onRemoveUser?: () => void;
}

export default class ChatWindow extends Block<ChatWindowProps> {
  static componentName = "ChatWindow";

  private closeDropdown = (): void => {
    this.element()?.classList.remove('chat-window--menu-open');
  };

  protected template = `
    <section class="chat-window">
      <header class="chat-window__header">
        <button type="button" class="chat-window__back" aria-label="Назад к списку чатов" ref="backBtn">
          ${iconArrowLeft}
        </button>
        <div class="chat-window__peer">
          <div class="chat-window__avatar">
            {{#if avatarUrl}}
              <img class="chat-window__avatar-img" src="{{avatarUrl}}" alt="Аватар чата" />
            {{/if}}
          </div>
          <div class="chat-window__peer-info">
            <h2 class="chat-window__title">{{title}}</h2>
            {{#if membersPreview}}
              <div class="chat-window__members">
                {{#each membersPreview}}
                  <div class="chat-window__member-avatar" title="{{name}}">
                    {{#if avatarUrl}}
                      <img src="{{avatarUrl}}" alt="{{name}}" />
                    {{else}}
                      {{initials}}
                    {{/if}}
                  </div>
                {{/each}}
                {{#if membersMore}}
                  <div class="chat-window__member-more">+{{membersMore}}</div>
                {{/if}}
              </div>
            {{/if}}
          </div>
        </div>
        <div class="chat-window__menu-wrap">
          <button type="button" class="chat-window__menu" aria-label="Меню чата" ref="menuBtn">
            <span></span><span></span><span></span>
          </button>
          <ul class="chat-window__dropdown">
            <li class="chat-window__dropdown-item" ref="addUserItem">Добавить участника</li>
            <li class="chat-window__dropdown-item chat-window__dropdown-item--danger" ref="removeUserItem">Удалить участника</li>
          </ul>
        </div>
      </header>

      <div class="chat-window__messages">
        {{#each messages}}
          {{#if isDate}}
            <div class="chat-window__date">{{text}}</div>
          {{else}}
            {{{ Message
              type=type
              text=text
              time=time
              imageUrl=imageUrl
              status=status
            }}}
          {{/if}}
        {{/each}}
      </div>

      <form class="chat-window__composer" autocomplete="off" ref="form">
        <button type="button" class="chat-window__attach" aria-label="Прикрепить">
          ${iconPaperclip}
        </button>
        <input
          class="chat-window__input"
          type="text"
          name="message"
          placeholder="Сообщение"
          ref="messageInput"
        />
        <span class="chat-window__error" ref="messageError"></span>
        <button type="submit" class="chat-window__send" aria-label="Отправить">
          ${iconArrowRight}
        </button>
      </form>
    </section>
  `;

  constructor(props: ChatWindowProps) {
    super({
      ...props,
      messages: props.messages.map((m) => ({
        ...m,
        isDate: m.type === "date",
      })) as MessageData[],
    });
  }

  protected override componentDidMount(): void {
    const back = this.refs["backBtn"];
    if (back) {
      back.addEventListener("click", () => this.props.onBack());
    }

    const form = this.refs["form"];
    if (form instanceof HTMLFormElement) {
      form.addEventListener("submit", (event) => this.handleSubmit(event));
    }

    const menuBtn = this.refs["menuBtn"];
    if (menuBtn) {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.element()?.classList.toggle("chat-window--menu-open");
      });
    }

    const addUserItem = this.refs["addUserItem"];
    if (addUserItem) {
      addUserItem.addEventListener("click", () => {
        this.closeDropdown();
        this.props.onAddUser?.();
      });
    }

    const removeUserItem = this.refs["removeUserItem"];
    if (removeUserItem) {
      removeUserItem.addEventListener("click", () => {
        this.closeDropdown();
        this.props.onRemoveUser?.();
      });
    }

    document.addEventListener("click", this.closeDropdown);
  }

  protected override componentWillUnmount(): void {
    document.removeEventListener("click", this.closeDropdown);
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    const input = this.refs["messageInput"];
    const errorNode = this.refs["messageError"];
    if (!(input instanceof HTMLInputElement)) return;

    const value = input.value;
    const result = validateField("message", value);
    const values = { message: value };

    console.log(values);

    if (errorNode) {
      errorNode.textContent = result.valid ? "" : result.message;
    }

    if (result.valid) {
      this.props.onSend(value);
      input.value = "";
      if (errorNode) errorNode.textContent = "";
    }
  }
}
