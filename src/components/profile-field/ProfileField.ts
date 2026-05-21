import Block, { type BlockOwnProps } from "../../core/Block";
import { validateField, type ValidationResult } from "../../core/validators";
import "./profile-field.scss";

export interface ProfileFieldProps extends BlockOwnProps {
  name: string;
  label: string;
  value?: string;
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  editable?: boolean;
  error?: string;
}

export default class ProfileField extends Block<ProfileFieldProps> {
  static componentName = "ProfileField";

  protected template = `
    <div class="profile-field{{#if editable}} profile-field_editable{{/if}}{{#if error}} profile-field_invalid{{/if}}">
      {{#if editable}}
        <label class="profile-field__label" for="field-{{name}}">{{label}}</label>
        <input
          id="field-{{name}}"
          class="profile-field__input"
          type="{{#if type}}{{type}}{{else}}text{{/if}}"
          name="{{name}}"
          value="{{value}}"
          placeholder="{{#if placeholder}}{{placeholder}}{{else}}{{label}}{{/if}}"
          {{#if autocomplete}}autocomplete="{{autocomplete}}"{{/if}}
          ref="input"
        />
        <span class="profile-field__error">{{error}}</span>
      {{else}}
        <span class="profile-field__label">{{label}}</span>
        <span class="profile-field__value">{{value}}</span>
      {{/if}}
    </div>
  `;

  protected override componentDidMount(): void {
    const input = this.refs["input"];
    if (input instanceof HTMLInputElement) {
      input.addEventListener("blur", () => {
        const result = this.validate();
        this.showError(result.message);
      });
    }
  }

  public name(): string {
    return this.props.name;
  }

  public value(): string {
    const input = this.refs["input"];
    return input instanceof HTMLInputElement
      ? input.value
      : (this.props.value ?? "");
  }

  public validate(): ValidationResult {
    return validateField(this.props.name, this.value());
  }

  public showError(message: string): void {
    const root = this.element();
    if (!root) return;
    const errorNode = root.querySelector(".profile-field__error");
    if (errorNode) errorNode.textContent = message;
    root.classList.toggle("profile-field_invalid", message.length > 0);
  }
}
