import Block, {
  type BlockEventMap,
  type BlockOwnProps,
} from "../../core/Block";
import "./input.scss";

export interface InputProps extends BlockOwnProps {
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  autocomplete?: string;
  className?: string;
  disabled?: boolean;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onInput?: (event: Event) => void;
}

export default class Input extends Block<InputProps> {
  static componentName = "Input";

  protected template = `
    <input
      class="{{#if className}}{{className}}{{else}}input{{/if}}"
      name="{{name}}"
      type="{{#if type}}{{type}}{{else}}text{{/if}}"
      {{#if placeholder}}placeholder="{{placeholder}}"{{/if}}
      {{#if autocomplete}}autocomplete="{{autocomplete}}"{{/if}}
      {{#if value}}value="{{value}}"{{/if}}
      {{#if disabled}}disabled{{/if}}
    />
  `;

  constructor(props: InputProps) {
    super(props);
    const events: BlockEventMap = {};
    if (props.onBlur) events.blur = props.onBlur;
    if (props.onFocus) events.focus = props.onFocus;
    if (props.onInput) events.input = props.onInput;
    this.events = events;
  }

  public value(): string {
    const node = this.element();
    if (
      node instanceof HTMLInputElement ||
      node instanceof HTMLTextAreaElement
    ) {
      return node.value;
    }
    return "";
  }

  public name(): string {
    const node = this.element();
    return node instanceof HTMLInputElement ? node.name : "";
  }
}
