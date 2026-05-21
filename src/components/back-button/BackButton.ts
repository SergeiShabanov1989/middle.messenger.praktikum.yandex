import Block, { type BlockOwnProps } from "../../core/Block";
import iconArrowLeft from "./icons/arrow-left.svg?raw";
import "./back-button.scss";

export interface BackButtonProps extends BlockOwnProps {
  href?: string;
  mix?: string;
}

export default class BackButton extends Block<BackButtonProps> {
  static componentName = "BackButton";

  protected template = `
    <a
      class="back-button{{#if mix}} {{mix}}{{/if}}"
      href="{{#if href}}{{href}}{{else}}/{{/if}}"
      aria-label="Назад"
    >
      <span class="back-button__icon">${iconArrowLeft}</span>
    </a>
  `;
}
