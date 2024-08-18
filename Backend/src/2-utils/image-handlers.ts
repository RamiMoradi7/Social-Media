import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";
import { fileSaver } from "uploaded-file-saver";
import { MediaItem } from "../4-models/post";

class ImageHandlers {
  public configureFileSaver(folder1: string, folder2: string): void {
    const basePath = path.resolve(__dirname, "../");
    const assetPath = path.join(basePath, `${folder1}`, `${folder2}`);
    fileSaver.config(assetPath);
  }

  public async extractImagesFromRequest(
    request: Request
  ): Promise<UploadedFile[]> {
    try {
      let imagesArray: UploadedFile[] = [];
      const images = request.files.images;
      Array.isArray(images) ? (imagesArray = images) : imagesArray.push(images);
      return imagesArray;
    } catch (error) {
      console.log(error);
    }
  }

  public getMediaType(mimetype: string): "image" | "video" {
    if (mimetype.startsWith("image/")) {
      return "image";
    } else if (mimetype.startsWith("video/")) {
      return "video";
    }
  }

  public async updateImageNames(
    images: UploadedFile[],
    oldImageNames: MediaItem[]
  ): Promise<MediaItem[]> {
    if (images && images.length > 0) {
      const imageArray: UploadedFile[] = Array.from(images);
      const imageNames: MediaItem[] = await Promise.all(
        imageArray.map(async (image, index) => {
          const oldImageName = oldImageNames[index];
          const newImageName = await fileSaver.update(oldImageName?.url, image);
          return {
            url: newImageName,
            type: this.getMediaType(image.mimetype),
          };
        })
      );

      if (oldImageNames.length > images.length) {
        const remainingOldImageNames = oldImageNames.slice(images.length);
        await Promise.all(
          remainingOldImageNames.map(async (oldImageName) => {
            await fileSaver.delete(oldImageName.url);
          })
        );
      }
      return imageNames;
    } else {
      return oldImageNames;
    }
  }

  public async getImageFile(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { imageName, folderPath } = request.params;
      const fullImagePath = path.resolve(
        __dirname,
        "..",
        "1-assets",
        folderPath,
        imageName
      );

      response.sendFile(fullImagePath);
    } catch (err: any) {
      next(err);
    }
  }
}
export const imageHandlers = new ImageHandlers();
