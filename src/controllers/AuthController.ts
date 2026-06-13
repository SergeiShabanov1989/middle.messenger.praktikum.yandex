import AuthService, { type LoginData, type RegisterData } from '../services/AuthService';
import { router } from '../core/routerInstance';
import appStore from '../core/appStore';
import { apiUserToUser } from '../mocks/types';
import { UnauthorizedError } from '../core/HTTPTransport';

export type { LoginData, RegisterData };

class AuthController {
  public async login(data: LoginData): Promise<void> {
    await AuthService.login(data);
    const apiUser = await AuthService.getUser();
    appStore.set({ user: apiUserToUser(apiUser), isAuthChecked: true });
    router.go('/messenger');
  }

  public async register(data: RegisterData): Promise<void> {
    await AuthService.register({
      email: data.email,
      login: data.login,
      first_name: data.first_name,
      second_name: data.second_name,
      phone: data.phone,
      password: data.password,
    });
    const apiUser = await AuthService.getUser();
    appStore.set({ user: apiUserToUser(apiUser), isAuthChecked: true });
    router.go('/messenger');
  }

  public async logout(): Promise<void> {
    await AuthService.logout();
    appStore.set({ user: null, isAuthChecked: true });
    router.go('/');
  }

  public async checkAuth(): Promise<void> {
    try {
      const apiUser = await AuthService.getUser();
      appStore.set({ user: apiUserToUser(apiUser), isAuthChecked: true });
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        appStore.set({ user: null, isAuthChecked: true });
      } else {
        appStore.set({ user: null, isAuthChecked: true });
      }
    }
  }
}

export default new AuthController();
