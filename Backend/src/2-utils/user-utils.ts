import { UploadedFile } from "express-fileupload";
import { Types } from "mongoose";
import { fileSaver } from "uploaded-file-saver";
import { GenderOptions } from "../3-types/user-types";
import { MediaTypes } from "../4-models/enums";
import { Post } from "../4-models/post";
import { IUser } from "../4-models/user";
import { albumsService } from "../6-services/albums-service";
import { postsService } from "../6-services/posts-service";
import { usersService } from "../6-services/users-service";
import { imageHandlers } from "./image-handlers";

export const userPopulateFields = {
  friends: {
    path: "friends",
    select:
      "firstName lastName gender profilePicture coverPhoto isActive lastLogin",
  },
  friendRequests: {
    path: "friendRequests",
    select: "firstName lastName profilePicture coverPhoto photos",
  },
  sentRequests: {
    path: "sentRequests",
    select: "firstName lastName profilePicture coverPhoto photos",
  },
};

export async function handleImageChange(
  user: IUser,
  newImage: UploadedFile,
  imageType: MediaTypes
): Promise<void> {
  const webpImage = await imageHandlers.convertImageToWebP(newImage);
  let newImageUrl = await fileSaver.add(webpImage);
  const possessivePronoun = getGenderPronoun(user.gender);

  const newPost = new Post({
    author: user._id,
    content: `${user.firstName} just updated ${possessivePronoun} ${
      imageType === "profilePicture" ? "Profile Picture" : "Cover Photo"
    }!`,
    privacy: "Public",
  });

  const addedPost = await postsService.addPost({
    post: newPost,
    images: [webpImage],
  });

  await albumsService.updateUserAlbum(
    user._id.toString(),
    newImageUrl,
    imageType,
    addedPost._id.toString()
  );

  user[imageType] = newImageUrl;
  await user.save();
}

export function updateRequests(
  requests: Types.ObjectId[],
  userId: Types.ObjectId
): Types.ObjectId[] {
  const index = requests.findIndex((request) => request.equals(userId));
  if (index !== -1) {
    requests.splice(index, 1);
  } else {
    requests.push(userId);
  }

  return requests;
}

export function getGenderPronoun(gender: string): string {
  switch (gender) {
    case GenderOptions.Male:
      return "his";
    case GenderOptions.Female:
      return "her";
    default:
      return "their";
  }
}
