import Block, { type BlockOwnProps } from "../../core/Block";
import iconCheck from "./icons/check.svg?raw";
import iconDoubleCheck from "./icons/double-check.svg?raw";
import "./message.scss";

export interface MessageProps extends BlockOwnProps {
  type: "in" | "out";
  text?: string;
  time?: string;
  imageUrl?: string;
  status?: "sent" | "read";
}

export default class Message extends Block<MessageProps> {
  static componentName = "Message";

  protected template = `
    <div class="message message--{{type}}">
      <div class="message__bubble">
        {{#if imageUrl}}
          <img class="message__image" src="{{imageUrl}}" alt="Прикрепленное изображение" />
        {{/if}}
        {{#if text}}
          <p class="message__text">{{{text}}}</p>
        {{/if}}
        <div class="message__meta">
          <time class="message__time">{{time}}</time>
          {{#if isOutgoing}}
            <span class="message__status">
              {{#if isRead}}${iconDoubleCheck}{{else}}${iconCheck}{{/if}}
            </span>
          {{/if}}
        </div>
      </div>
    </div>
  `;

  constructor(props: MessageProps) {
    super({
      ...props,
      isOutgoing: props.type === "out",
      isRead: props.status === "read",
    } as MessageProps & { isOutgoing: boolean; isRead: boolean });
  }
}
