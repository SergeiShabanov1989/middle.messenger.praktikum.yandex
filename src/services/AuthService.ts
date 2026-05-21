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
  password_confirm: string;
}

class AuthService {
  public async login(data: LoginData): Promise<void> {
    console.info("[AuthService] login", data);
  }

  public async register(data: RegisterData): Promise<void> {
    console.info("[AuthService] register", data);
  }

  public async logout(): Promise<void> {
    console.info("[AuthService] logout");
  }
}

export default new AuthService();
