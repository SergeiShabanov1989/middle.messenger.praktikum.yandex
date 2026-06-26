import UserService from "../services/UserService";
import type { PasswordChangeData } from "../services/UserService";
import appStore from "../core/appStore";
import { apiUserToUser } from "../mocks/types";
import type { User } from "../mocks/types";

export type { PasswordChangeData };

class UserController {
  public get(): User | null {
    return appStore.getState().user;
  }

  public async update(data: Partial<User>): Promise<void> {
    const current = appStore.getState().user;
    if (!current) throw new Error("Пользователь не авторизован");

    const apiUser = await UserService.updateProfile({
      first_name: data.first_name ?? current.first_name,
      second_name: data.second_name ?? current.second_name,
      display_name: data.display_name ?? current.display_name,
      login: data.login ?? current.login,
      email: data.email ?? current.email,
      phone: data.phone ?? current.phone,
    });
    appStore.set({ user: apiUserToUser(apiUser) });
  }

  public async changePassword(data: PasswordChangeData): Promise<void> {
    await UserService.changePassword(data);
  }

  public async changeAvatar(formData: FormData): Promise<void> {
    const apiUser = await UserService.changeAvatar(formData);
    appStore.set({ user: apiUserToUser(apiUser) });
  }
}

export default new UserController();
