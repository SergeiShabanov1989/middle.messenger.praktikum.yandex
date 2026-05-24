import Block, { type BlockOwnProps } from "../../core/Block";
import "./error-message.scss";

export interface ErrorMessageProps extends BlockOwnProps {
  code: string;
  text: string;
  href?: string;
  linkText?: string;
}

export default class ErrorMessage extends Block<ErrorMessageProps> {
  static componentName = "ErrorMessage";

  protected template = `
    <div class="error-message">
      <h1 class="error-message__code">{{code}}</h1>
      <p class="error-message__text">{{text}}</p>
      <a class="error-message__link" href="{{#if href}}{{href}}{{else}}/{{/if}}">
        {{#if linkText}}{{linkText}}{{else}}Назад к чатам{{/if}}
      </a>
    </div>
  `;
}
