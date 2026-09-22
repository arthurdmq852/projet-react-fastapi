import { httpClient } from "./httpClient";
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, User } from "../types/api";

export const authService = {
  register: (payload: RegisterPayload): Promise<RegisterResponse> =>
    httpClient.post<RegisterResponse>("/auth/register", payload),

  login: (payload: LoginPayload): Promise<LoginResponse> =>
    httpClient.post<LoginResponse>("/auth/login", payload),

  me: (token: string): Promise<User> => httpClient.get<User>("/auth/me", token),
};
