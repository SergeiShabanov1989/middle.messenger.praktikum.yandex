import ErrorPage from "../error/ErrorPage";

export default class ServerErrorPage extends ErrorPage {
  constructor() {
    super({
      code: "500",
      text: "Мы уже фиксим",
      href: "/",
      linkText: "Назад к чатам",
    });
  }
}
