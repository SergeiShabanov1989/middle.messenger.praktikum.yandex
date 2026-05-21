import Block, { type BlockOwnProps } from "../../core/Block";
import type { Message as MessageData } from "../../mocks/types";
import iconPaperclip from "./icons/paperclip.svg?raw";
import iconArrowRight from "./icons/arrow-right.svg?raw";
import iconArrowLeft from "./icons/arrow-left.svg?raw";
import { validateField } from "../../core/validators";
import "./chat-window.scss";

export interface ChatWindowProps extends BlockOwnProps {
  title: string;
  avatarUrl: string;
  messages: MessageData[];
  onBack: () => void;
  onSend: (text: string) => void;
}

export default class ChatWindow extends Block<ChatWindowProps> {
  static componentName = "ChatWindow";

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
          <h2 class="chat-window__title">{{title}}</h2>
        </div>
        <button type="button" class="chat-window__menu" aria-label="Меню чата">
          <span></span><span></span><span></span>
        </button>
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
