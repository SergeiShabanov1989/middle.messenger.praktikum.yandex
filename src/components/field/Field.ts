import Block, { type BlockOwnProps } from "../../core/Block";
import Input from "../input/Input";
import { validateField, type ValidationResult } from "../../core/validators";
import "./field.scss";

export interface FieldProps extends BlockOwnProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  autocomplete?: string;
  error?: string;
}

export default class Field extends Block<FieldProps> {
  static componentName = "Field";

  protected template = `
    <label class="field{{#if error}} field_invalid{{/if}}">
      <span class="field__label">{{label}}</span>
      {{{ Input ref="input" name=name type=type placeholder=placeholder value=value autocomplete=autocomplete className="field__input" onBlur=onBlur }}}
      <span class="field__error">{{error}}</span>
    </label>
  `;

  private input: Input | null = null;

  constructor(props: FieldProps) {
    super({
      ...props,
      onBlur: () => this.handleBlur(),
    } as FieldProps & { onBlur: () => void });
  }

  protected override componentDidMount(): void {
    this.input = this.findInputChild();
  }

  private findInputChild(): Input | null {
    const found = this.children.find(
      (child): child is Input => child instanceof Input,
    );
    return found ?? null;
  }

  private handleBlur(): void {
    const result = this.validate();
    this.showError(result.message);
  }

  public name(): string {
    return this.props.name;
  }

  public value(): string {
    return this.input?.value() ?? "";
  }

  public validate(): ValidationResult {
    return validateField(this.props.name, this.value());
  }

  public showError(message: string): void {
    const root = this.element();
    if (!root) return;
    const errorNode = root.querySelector(".field__error");
    if (errorNode) errorNode.textContent = message;
    root.classList.toggle("field_invalid", message.length > 0);
  }

  public clearError(): void {
    this.showError("");
  }
}
