import { Document, Model, Schema, model } from "mongoose";

export interface IUser extends Document {
  _id: string;
  __v: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
  facebookId?: string;
  githubId?: string;
  twitterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [5, "Username must be at least 5 character long"],
      maxlength: [20, "Username must be at most 20 character long"],
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
      required: [true, "Password is required"],
      trim: true,
      minlength: [8, "Password must be at least 8 character long"],
      maxlength: [20, "Password must be at most 20 character long"],
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
    },
    profilePicture: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // 'location.type' must be 'Point'
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere", // Create a 2dsphere index for geospatial queries
      },
      city: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zip: {
        type: String,
        trim: true,
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
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    mobileVerificationToken: String,
    mobileVerificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    googleId: {
      type: String,
      sparse: true,
    },
    facebookId: {
      type: String,
      sparse: true,
    },
    githubId: {
      type: String,
      sparse: true,
    },
    twitterId: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = model<IUser>("User", userSchema);
export default User;
