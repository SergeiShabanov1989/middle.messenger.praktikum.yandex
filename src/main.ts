import "./styles/global.scss";
import { router } from "./core/routerInstance";
import { registerAllComponents } from "./core/registerComponents";
import appStore from "./core/appStore";
import AuthController from "./controllers/AuthController";
import ChatsPage from "./pages/home/ChatsPage";
import LoginPage from "./pages/login/LoginPage";
import SignUpPage from "./pages/sign-up/SignUpPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ServerErrorPage from "./pages/server-error/ServerErrorPage";
import NotFoundPage from "./pages/not-found/NotFoundPage";

const PUBLIC_ROUTES = ["/", "/sign-up"];
const ERROR_ROUTES = ["/404", "/500"];
const ALL_ROUTES = [
  ...PUBLIC_ROUTES,
  ...ERROR_ROUTES,
  "/messenger",
  "/settings",
];

registerAllComponents();

async function init(): Promise<void> {
  await AuthController.checkAuth();

  router
    .setGuard((pathname) => {
      const { user } = appStore.getState();

      if (!ALL_ROUTES.includes(pathname)) {
        return "/404";
      }

      if (
        !user &&
        !PUBLIC_ROUTES.includes(pathname) &&
        !ERROR_ROUTES.includes(pathname)
      ) {
        return "/";
      }

      if (user && PUBLIC_ROUTES.includes(pathname)) {
        return "/messenger";
      }

      return null;
    })
    .use("/", () => new LoginPage())
    .use("/sign-up", () => new SignUpPage())
    .use("/messenger", () => new ChatsPage())
    .use("/settings", () => new ProfilePage())
    .use("/404", () => new NotFoundPage())
    .use("/500", () => new ServerErrorPage())
    .setFallback(() => new NotFoundPage())
    .start();
}

void init();
