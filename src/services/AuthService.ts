import http from "../core/HTTPTransport";
import type { ApiUser } from "../api/types";

export interface LoginData {
  login: string;
  password: string;
}

export interface RegisterData {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  phone: string;
  password: string;
}

class AuthService {
  public login(data: LoginData): Promise<void> {
    return http.post<void>("/auth/signin", {
      login: data.login,
      password: data.password,
    });
  }

  public register(data: RegisterData): Promise<{ id: number }> {
    return http.post<{ id: number }>("/auth/signup", {
      first_name: data.first_name,
      second_name: data.second_name,
      login: data.login,
      email: data.email,
      password: data.password,
      phone: data.phone,
    });
  }

  public logout(): Promise<void> {
    return http.post<void>("/auth/logout");
  }

  public getUser(): Promise<ApiUser> {
    return http.get<ApiUser>("/auth/user");
  }
}

export default new AuthService();
