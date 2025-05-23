interface ISignupReturn {
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

interface ISignupParameter {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface ILoginParameter {
  email_or_username: string;
  password: string;
}

interface ILoginReturn {
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

interface IGoogleParameter {
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
}
