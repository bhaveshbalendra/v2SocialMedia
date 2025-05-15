export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture?: string;
  isVerified: boolean;
}

export interface IAuthUserRouteResponse {
  user: User;
  success: boolean;
  message: string;
  accessToken?: string | null;
}

export interface IAuthUser {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ILoginRequest {
  email_or_username: string;
  password: string;
}

export interface ILoginResponseWithToken {
  success: boolean;
  message?: string;
  user: User;
  accessToken: string;
}

export interface ISignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface ISignupResponseWithToken {
  success: boolean;
  message?: string;
  user: User;
  accessToken: string;
}

export interface ILogoutResponse {
  success: boolean;
  message?: string;
}
