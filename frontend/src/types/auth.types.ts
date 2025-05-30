export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture?: string;
  isVerified: boolean;
}

export interface IAuthUserRouteApiResponse {
  user: User;
  success: boolean;
  message: string;
  accessToken?: string | null;
}

export interface IAuthUserState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ILoginApiRequest {
  email_or_username: string;
  password: string;
}

export interface ILoginApiResponseWithToken {
  success: boolean;
  message?: string;
  user: User;
  accessToken: string;
}

export interface IGoogleAuthApiResponseWithToken {
  success: boolean;
  message?: string;
  user: User;
  accessToken: string;
}

export interface IGoogleAuthApiRequest {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
}

export interface ISignupApiRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface ISignupApiResponseWithToken {
  success: boolean;
  message?: string;
  user: User;
  accessToken: string;
}

export interface ILogoutApiResponse {
  success: boolean;
  message?: string;
}
