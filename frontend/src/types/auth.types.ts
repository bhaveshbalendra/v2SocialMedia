export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
  isVerified: boolean;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthUser {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ILoginRequest {
  email: string;
  password: string;
  accessToken?: boolean;
}

export interface ISignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface ISignupResponse {
  success: boolean;
  message?: string;
  user: User;
  accessToken: string;
}

export interface IAuthResponse {
  success: boolean;
  message?: string;
  user: User;
  accessToken: string;
}
