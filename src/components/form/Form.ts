import Block, { type BlockOwnProps } from "../../core/Block";
import Field from "../field/Field";

export interface FormProps extends BlockOwnProps {
  className?: string;
}

export default abstract class Form<
  P extends FormProps = FormProps,
> extends Block<P> {
  constructor(props: P) {
    super(props);
    this.events = {
      submit: (event: Event) => this.handleSubmit(event as SubmitEvent),
    };
  }

  protected fields(): Field[] {
    return this.children.filter(
      (child): child is Field => child instanceof Field,
    );
  }

  protected validateAll(): boolean {
    let isValid = true;
    this.fields().forEach((field) => {
      const result = field.validate();
      field.showError(result.message);
      if (!result.valid) {
        isValid = false;
      }
    });
    return isValid;
  }

  protected collectValues(): Record<string, string> {
    const values: Record<string, string> = {};
    this.fields().forEach((field) => {
      values[field.name()] = field.value();
    });
    return values;
  }

  protected handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const isValid = this.validateAll();
    const values = this.collectValues();
    if (!isValid) return;

    const result = this.onValidSubmit(values);
    if (result instanceof Promise) {
      result.catch((err: unknown) => this.onSubmitError(err));
    }
  }

  protected onValidSubmit(_values: Record<string, string>): Promise<void> | void {
    // override in subclass
  }

  // Переопределяется в подклассах для показа ошибок API
  protected onSubmitError(_error: unknown): void {}
}
