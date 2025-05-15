import { Document, Model, Schema, model } from "mongoose";

//Interface for User
export interface IUser extends Document {
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
  bookmarks: Schema.Types.ObjectId[];
  posts: Schema.Types.ObjectId[];
  mobileNumber?: string;
  bio?: string;
  profilePicture?: string;
  dateOfBirth?: Date;
  location: {
    type: string;
    coordinates: number[];
    city: string;
    country: string;
    state: string;
    zip: string;
  };
  isVerified: boolean;
  isPrivate: boolean;
  isPremium: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  mobileVerificationToken?: string;
  mobileVerificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  googleId?: string;
  // facebookId?: string;
  // githubId?: string;
  twitterId?: string;
}

/**
 * @description schema for user
 */
const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      // minlength: [5, "Username must be at least 5 character long"],
      // maxlength: [20, "Username must be at most 20 character long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      trim: true,
      select: false, // Do not return password in queries
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    mobileNumber: {
      type: String,
      index: {
        sparse: true, // Creates a sparse index that only includes documents containing this field
        // Optimizes storage and query performance for this optional field
        // Useful since not all users may provide a mobile number
        //Any string value (e.g., "+1234567890") non-defined will include
        // Empty strings ("")
        // Null values (null)
        // Empty arrays ([])
        // The number zero (0)
        partialFilterExpression: {
          mobileNumber: { $ne: ["", null, [], {}, 0] },
        },
      },
      validate: {
        validator: function (v: string) {
          return /^(\+\d{1,3})?[-\s]?\d{10,14}$/.test(v); // Basic mobile number validation with optional country code
        },
        message: (props) => `${props.value} is not a valid mobile number!`, // Custom error message
      },
    },

    bio: {
      type: String,
      maxlength: [150, "Bio must be at most 150 characters long"],
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
        default: [0, 0], // Not recommended unless you want every document at [0,0]
      },
      city: {
        type: String,
        trim: true,
        default: "",
      },
      country: {
        type: String,
        trim: true,
        default: "",
      },
      state: {
        type: String,
        trim: true,
        default: "",
      },
      zip: {
        type: String,
        trim: true,
        default: "",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationTokenExpires: {
      type: Date,
      default: null,
    },
    mobileVerificationToken: {
      type: String,
      default: null,
    },
    mobileVerificationTokenExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetTokenExpires: {
      type: Date,
      default: null,
    },
    googleId: {
      type: String,
      sparse: true,
      default: null,
    },
    // facebookId: {
    //   type: String,
    //   sparse: true,
    //   default: null,
    // },
    // githubId: {
    //   type: String,
    //   sparse: true,
    //   default: null,
    // },
    twitterId: {
      type: String,
      sparse: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

//exporting user model
const User: Model<IUser> = model<IUser>("User", userSchema);
export default User;
