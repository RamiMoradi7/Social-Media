import mongoose, { PopulateOptions, Types } from "mongoose";
import { IUser } from "../4-models/user";
import { UploadedFile } from "express-fileupload";
import { fileSaver } from "uploaded-file-saver";
import { Post } from "../4-models/post";
import { postsService } from "../6-services/posts-service";
import { IAlbum, IMediaItem } from "../4-models/album";
import { usersService } from "../6-services/users-service";
import { appConfig } from "./app-config";

export const userPopulateFields: PopulateOptions[] = [
  {
    path: "friends",
    select:
      "firstName lastName email gender profilePicture coverPhoto photos isActive lastLogin",
  },
  {
    path: "friendRequests",
    select: "firstName lastName email gender profilePicture coverPhoto photos",
  },
  {
    path: "sentRequests",
    select: "firstName lastName email gender profilePicture coverPhoto photos",
  },
];

export async function handleImageChange(
  user: IUser,
  newImage: UploadedFile,
  imageType: "profilePicture" | "coverPhoto"
): Promise<void> {
  const oldImageName = await usersService.getOldImages(
    user._id.toString(),
    imageType
  );
  let newImageUrl = await fileSaver.update(oldImageName, newImage);
  const possessivePronoun = getGenderPronoun(user.gender);

  console.log({ newImageUrl });

  const newPost = new Post({
    author: user._id,
    content: `${user.firstName} just updated ${possessivePronoun} ${
      imageType === "profilePicture" ? "Profile Picture" : "Cover Photo"
    }!`,
    privacy: "Public",
  });

  const addedPost = await postsService.addPost({
    post: newPost,
    images: [newImage],
  });

  await updateUserAlbum(user, newImageUrl, imageType, addedPost._id.toString());

  user[imageType] = newImageUrl;
  await user.save();
}

function extractImageUrl(
  imageType: "profilePicture" | "coverPhoto" | "photo"
): string {
  let baseUrl: string;
  switch (imageType) {
    case "profilePicture":
    case "coverPhoto":
      baseUrl = appConfig.baseImageUrl;
      break;

    case "photo":
      baseUrl = appConfig.basePostsImageUrl;
      break;
  }
  return baseUrl;
}

export async function updateUserAlbum(
  user: IUser,
  newImageUrl: string | string[],
  imageType: "profilePicture" | "coverPhoto" | "photo",
  addedPostId: string
): Promise<void> {
  const albumTitle = `${
    imageType.charAt(0).toUpperCase() + imageType.slice(1)
  }`;

  if (!user.albums) {
    user.albums = [];
  }

  const existingAlbumIndex = user.albums.findIndex(
    (album) => album.title === albumTitle
  );

  const baseImageUrl = extractImageUrl(imageType);
  const imageUrlsArray = Array.isArray(newImageUrl)
    ? newImageUrl
    : [newImageUrl];

  const mediaItemToAdd = {
    type: imageType,
    url: imageUrlsArray.map((url) => `${baseImageUrl + url}`),
    postId: new mongoose.Types.ObjectId(addedPostId),
    createdAt: new Date(),
  } as IMediaItem;

  if (existingAlbumIndex !== -1) {
    const existingAlbum = user.albums[existingAlbumIndex];

    existingAlbum.mediaItems.push(mediaItemToAdd);

    user.albums[existingAlbumIndex] = existingAlbum;
  } else {
    const newAlbum = {
      title: albumTitle,
      mediaItems: [mediaItemToAdd],
      createdAt: new Date(),
    };

    user.albums.push(newAlbum as IAlbum);
  }
}

export function updateRequests(
  requests: Types.ObjectId[],
  userId: Types.ObjectId
): Types.ObjectId[] {
  const updatedRequests = [...requests];
  const index = updatedRequests.findIndex((request) => request.equals(userId));
  if (index !== -1) {
    updatedRequests.splice(index, 1);
  } else {
    updatedRequests.push(userId);
  }

  return updatedRequests;
}

export function getGenderPronoun(gender: string): string {
  switch (gender) {
    case "Male":
      return "his";
    case "Female":
      return "her";
    default:
      return "their";
  }
}
