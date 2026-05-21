import UserService, { type PasswordChangeData } from "../services/UserService";
import type { User } from "../mocks/types";

class UserController {
  public get(): User {
    return UserService.get();
  }

  public update(patch: Partial<User>): User {
    return UserService.update(patch);
  }

  public changePassword(data: PasswordChangeData): void {
    UserService.changePassword(data);
  }
}

export default new UserController();
