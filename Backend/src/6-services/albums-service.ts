import mongoose from "mongoose";
import { appConfig } from "../2-utils/app-config";
import { Album, IAlbum, IMediaItem } from "../4-models/album";
import { MediaTypes } from "../4-models/enums";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../4-models/client-errors";

class AlbumsService {
  public async getUserAlbums(userId: string): Promise<IAlbum[]> {
    const albums = await Album.find({
      referenceId: userId,
    });
    if (!albums) throw new ResourceNotFoundError(userId);
    return albums;
  }

  public async getUserMediaItem(
    userId: string,
    albumType: MediaTypes
  ): Promise<IMediaItem> {
    const album = await Album.findOne({
      referenceId: userId,
      title: albumType,
    }).exec();

    if (!album)
      throw new ValidationError(`'Album not found for user ${userId}'`);

    const sortedMediaItems = album.mediaItems.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const currentPic = sortedMediaItems[0];
    if (!currentPic) {
      throw new ValidationError(
        `No media items found in album for user ${userId} and album type "${albumType}"`
      );
    }
    return currentPic;
  }

  public async updateUserAlbum(
    userId: string,
    newImageUrl: string | string[],
    imageType: MediaTypes,
    addedPostId: string
  ): Promise<void> {
    const album = await Album.findOne({
      referenceId: userId,
      title: imageType,
    });

    const baseImageUrl = this.extractImageUrl(imageType);
    const imageUrlsArray = Array.isArray(newImageUrl)
      ? newImageUrl
      : [newImageUrl];

    const mediaItem: IMediaItem = {
      type: imageType,
      url: imageUrlsArray.map((url) => `${baseImageUrl + url}`),
      postId: new mongoose.Types.ObjectId(addedPostId),
      createdAt: new Date(),
    };
    if (album) {
      album.mediaItems.push(mediaItem);
      await album.save();
    } else {
      const newAlbum = new Album({
        title: imageType,
        mediaItems: [mediaItem],
        createdAt: new Date(),
        referenceId: userId,
      });

      await newAlbum.save();
    }
  }

  private extractImageUrl(imageType: MediaTypes): string {
    let baseUrl: string;
    switch (imageType) {
      case MediaTypes.PROFILE_PHOTO:
      case MediaTypes.COVER_PHOTO:
        baseUrl = appConfig.baseImageUrl;
        break;

      case MediaTypes.POST_PHOTO:
        baseUrl = appConfig.basePostsImageUrl;
        break;
    }
    return baseUrl;
  }
}

export const albumsService = new AlbumsService();
