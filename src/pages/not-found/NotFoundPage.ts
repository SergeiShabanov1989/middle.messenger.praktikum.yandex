import ErrorPage from "../error/ErrorPage";

export default class NotFoundPage extends ErrorPage {
  constructor() {
    super({
      code: "404",
      text: "Не туда попали",
      href: "/messenger",
      linkText: "Назад к чатам",
    });
  }
}
