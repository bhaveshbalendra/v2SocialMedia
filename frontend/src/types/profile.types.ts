export interface IUserPostForProfileData {
  _id: string;
  title: string;
  media: {
    url: string;
    type: string;
    publicId: string;
    _id: string;
  }[];
  likes: string[];
}
export interface IUserProfileData {
  _id: string;
  username: string;
  profilePicture: string;
  bio: string;
  location?: {
    type: string;
    coordinates: number[];
    city: string;
    country: string;
    state: string;

    zip: string;
  };
  followers: {
    _id: string;
    username: string;
    profilePicture: string;
  }[];
  following: {
    _id: string;
    username: string;
    profilePicture: string;
  }[];
  createdAt: string;
  posts?: IUserPostForProfileData[];
  isPrivate: boolean;
  isBlocked: boolean;
}

export interface IGetUserProfileApiResponse {
  user: IUserProfileData;
  message?: string;
  success: boolean;
}

export interface ISearchProfile {
  username: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
}
export interface IGetUserSearchProfileApiResponse {
  success: boolean;
  profiles: ISearchProfile[];
}

export interface IUserSearchProfileApiRequest {
  searchTerm: string;
}
