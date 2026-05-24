import AuthService, {
  type LoginData,
  type RegisterData,
} from "../services/AuthService";
import { router } from "../core/routerInstance";

class AuthController {
  public async login(data: LoginData): Promise<void> {
    await AuthService.login(data);
    router.go("/");
  }

  public async register(data: RegisterData): Promise<void> {
    await AuthService.register(data);
    router.go("/");
  }

  public async logout(): Promise<void> {
    await AuthService.logout();
    router.go("/login");
  }
}

export default new AuthController();
