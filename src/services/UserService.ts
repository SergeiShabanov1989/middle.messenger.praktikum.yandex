import http from "../core/HTTPTransport";
import type { ApiUser } from "../api/types";

export interface UpdateProfileData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

class UserService {
  public updateProfile(data: UpdateProfileData): Promise<ApiUser> {
    return http.put<ApiUser>(
      "/user/profile",
      data as unknown as Record<string, unknown>,
    );
  }

  public changePassword(data: PasswordChangeData): Promise<void> {
    return http.put<void>("/user/password", {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  }

  public changeAvatar(formData: FormData): Promise<ApiUser> {
    return http.put<ApiUser>("/user/profile/avatar", formData);
  }

  public searchByLogin(login: string): Promise<ApiUser[]> {
    return http.post<ApiUser[]>("/user/search", { login });
  }
}

export default new UserService();
