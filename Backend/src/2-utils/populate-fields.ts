import { PopulateOptions } from "mongoose";

export const populateOptions: PopulateOptions[] = [
  {
    path: "author",
    select: "firstName lastName profilePicture coverPhoto photos isActive",
  },
  {
    path: "likes",
    select: "profilePicture coverPhoto",
  },
  {
    path: "targetUser",
    select: "firstName lastName profilePicture coverPhoto photos isActive",
  },
];
