import { Request } from "express";
import { IUser } from "./schema.types";

export interface ISignupServiceReturn {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    profilePicture: string | undefined;
    isVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ISignupServiceParameter {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ILoginServiceParameter {
  email_or_username: string;
  password: string;
}

export interface ILoginServiceReturn {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    profilePicture: string;
    isVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface IGoogleServiceParameter {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
}
