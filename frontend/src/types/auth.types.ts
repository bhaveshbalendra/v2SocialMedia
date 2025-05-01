export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture?: string;
  isVerified: boolean;
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

export interface ILoginResponseWithToken {
  success: boolean;
  message?: string;
  user: User;
  accessToken: string;
}

export interface ISignupResponseWithToken {
  success: boolean;
  message?: string;
  user: User;
  accessToken: string;
}
