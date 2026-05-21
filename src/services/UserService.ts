import { user as initialUser } from "../mocks/user";
import type { User } from "../mocks/types";

export interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

class UserService {
  private current: User = { ...initialUser };

  public get(): User {
    return this.current;
  }

  public update(patch: Partial<User>): User {
    this.current = { ...this.current, ...patch };
    return this.current;
  }

  public changePassword(data: PasswordChangeData): void {
    console.info("[UserService] changePassword", data);
  }
}

export default new UserService();
