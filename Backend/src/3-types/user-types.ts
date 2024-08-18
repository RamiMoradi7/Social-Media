import { UploadedFile } from "express-fileupload";
import { IUser } from "../4-models/user";

export type UserProps = {
  userId: string;
  userFields?: Partial<IUser>;
  profilePicture?: UploadedFile;
  coverPhoto?: UploadedFile;
  senderUserId?: string;
};

export type UserAddress = {
  city: string;
  state: string;
  country: string;
};

export enum PrivacyOptions {
  Public = "public",
  Friends = "friends",
  Private = "private",
}

export enum GenderOptions {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}
