import Block, { type BlockOwnProps } from "../../core/Block";
import "../../components/error-message/error-message.scss";
import "./error-page.scss";

export interface ErrorPageProps extends BlockOwnProps {
  code: string;
  text: string;
  href?: string;
  linkText?: string;
}

export default class ErrorPage extends Block<ErrorPageProps> {
  protected template = `
    <main class="error-page">
      {{{ ErrorMessage code=code text=text href=href linkText=linkText }}}
    </main>
  `;
}
