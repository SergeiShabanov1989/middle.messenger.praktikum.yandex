import "./styles/global.scss";
import { router } from "./core/routerInstance";
import { registerAllComponents } from "./core/registerComponents";
import ChatsPage from "./pages/home/ChatsPage";
import LoginPage from "./pages/login/LoginPage";
import SignUpPage from "./pages/sign-up/SignUpPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ServerErrorPage from "./pages/server-error/ServerErrorPage";
import NotFoundPage from "./pages/not-found/NotFoundPage";

registerAllComponents();

router
  .use("/", () => new ChatsPage())
  .use("/login", () => new LoginPage())
  .use("/sign-up", () => new SignUpPage())
  .use("/profile", () => new ProfilePage())
  .use("/500", () => new ServerErrorPage())
  .setFallback(() => new NotFoundPage())
  .start();
