import Block, { type BlockOwnProps } from "../../core/Block";
import "./button.scss";

export interface ButtonProps extends BlockOwnProps {
  label: string;
  type?: "button" | "submit" | "reset";
  view?: "primary" | "ghost";
  size?: "full";
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export default class Button extends Block<ButtonProps> {
  static componentName = "Button";

  protected template = `
    <button
      type="{{#if type}}{{type}}{{else}}button{{/if}}"
      class="button{{#if view}} button_view_{{view}}{{/if}}{{#if size}} button_size_{{size}}{{/if}}"
      {{#if disabled}}disabled{{/if}}
    >{{label}}</button>
  `;

  constructor(props: ButtonProps) {
    super(props);
    if (props.onClick) {
      this.events = { click: props.onClick };
    }
  }
}
