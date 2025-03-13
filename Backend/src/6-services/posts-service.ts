import { UploadedFile } from "express-fileupload";
import mongoose, { Types } from "mongoose";
import { fileSaver } from "uploaded-file-saver";
import { imageHandlers } from "../2-utils/image-handlers";
import { populateOptions } from "../2-utils/populate-fields";
import { Album } from "../4-models/album";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../4-models/client-errors";
import { Comment } from "../4-models/comment";
import { MediaTypes, PrivacyOptions } from "../4-models/enums";
import { Like } from "../4-models/like";
import { IPost, MediaItem, Post } from "../4-models/post";
import { User } from "../4-models/user";
import { albumsService } from "./albums-service";
import { usersService } from "./users-service";

type PostProps = {
  post: IPost;
  images?: UploadedFile[];
  targetUserId?: mongoose.Types.ObjectId;
};

type GetPostsProps = {
  userId: mongoose.Types.ObjectId;
  currentUserId?: mongoose.Types.ObjectId;
  query?: string;
  page: number;
};
export interface PostsResponse {
  posts: IPost[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

class PostsService {
  public async getPosts({
    userId,
    query,
    page,
  }: GetPostsProps): Promise<PostsResponse> {
    const user = await User.findById({ _id: userId }).select("friends").exec();
    if (!user) throw new ResourceNotFoundError(userId.toString());

    const baseQuery = {
      $or: [{ author: userId }, { author: { $in: user.friends } }],
      privacy: { $in: [PrivacyOptions.Public, PrivacyOptions.Friends] },
    };

    if (query) {
      baseQuery["content"] = { $regex: query, $options: "i" };
    }

    const { posts, totalPages, totalPosts, currentPage } =
      await this.paginatePosts(baseQuery, page, userId);
    console.log(posts);
    return { posts, totalPosts, totalPages, currentPage };
  }

  public async getUserProfilePosts({
    userId,
    currentUserId,
    page,
  }: GetPostsProps): Promise<PostsResponse> {
    const userPosts = await Post.find({
      $or: [{ author: userId }, { targetUser: userId }],
    })
      .populate(populateOptions)
      .exec();

    const isOwnProfile = userId.equals(currentUserId);
    if (isOwnProfile) {
      const posts = await this.paginatePosts(
        {
          _id: { $in: userPosts },
        },
        page,
        currentUserId
      );
      return posts;
    } else {
      const userProfile = await usersService.getUser(userId, ["friends"]);
      const isFriend = userProfile.friends.some(
        (friend) => friend._id.toString() === currentUserId.toString()
      );

      const posts = await this.paginatePosts(
        {
          _id: { $in: userPosts },
          privacy: {
            $nin: isFriend
              ? [PrivacyOptions.Private]
              : [PrivacyOptions.Private, PrivacyOptions.Friends],
          },
        },
        page,
        currentUserId
      );
      return posts;
    }
  }

  private async paginatePosts(
    query: object,
    page: number,
    currentUserId?: Types.ObjectId
  ): Promise<{
    posts: IPost[];
    totalPages: number;
    totalPosts: number;
    currentPage: number;
  }> {
    const postsPerPage = 7;
    const totalPosts = await Post.countDocuments(query).exec();
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const skip = (page - 1) * postsPerPage;
    const currentPage = page;

    let posts = await Post.find(query)
      .skip(skip)
      .limit(postsPerPage)
      .populate(populateOptions)
      .exec();

    posts = posts.map((post) => {
      const instance = post.toJSON();
      instance.isLiked = post.isLikedByUser(currentUserId);
      return instance;
    });
    return { posts, totalPosts, totalPages, currentPage };
  }

  public async getPost(
    postId: string,
    userId?: mongoose.Types.ObjectId
  ): Promise<IPost> {
    const post = await Post.findById({ _id: postId })
      .populate(populateOptions)
      .exec();
    if (!post) throw new ResourceNotFoundError(postId);
    const populatedPost = post.toJSON();
    populatedPost.isLiked = post.isLikedByUser(userId);
    return populatedPost;
  }

  public async addPost({ post, images }: PostProps): Promise<IPost> {
    const errors = post.validateSync();
    if (errors) throw new ValidationError(errors.message);
    if (images && images.length > 0) {
      imageHandlers.configureFileSaver("1-assets", "posts-images");
      const mediaItems = await Promise.all(
        images.map(async (image) => {
          const webpImage = await imageHandlers.convertImageToWebP(image);
          const imageName = await fileSaver.add(webpImage);
          const type = imageHandlers.getMediaType(image.mimetype);

          return {
            url: imageName,
            type: type,
          };
        })
      );

      post.imageNames = mediaItems;
    }
    const addedPost = await Post.create(post);

    const user = await User.findByIdAndUpdate(
      post.author,
      { $push: { posts: addedPost._id } },
      { new: true }
    );

    if (images) {
      await albumsService.updateUserAlbum(
        user._id.toString(),
        post.imageNames.map((imageName) => imageName.url),
        MediaTypes.POST_PHOTO,
        addedPost._id.toString()
      );
    }

    await user.save();
    post = await this.getPost(addedPost._id as string, post.author);
    return post;
  }

  public async updatePost({ post, images }: PostProps): Promise<IPost> {
    const errors = post.validateSync();
    if (errors) throw new ValidationError(errors.message);

    const oldImageNames = await this.getImageNames(post._id as string);
    if (images && images.length > 0) {
      imageHandlers.configureFileSaver("1-assets", "posts-images");
      const imageNames = await imageHandlers.updateImageNames(
        images,
        oldImageNames
      );

      post.imageNames = imageNames;
    } else {
      await Promise.all(
        oldImageNames.map(async (imageName) => {
          await fileSaver.delete(imageName.url as string);
        })
      );
    }
    const updatedPost = await Post.findByIdAndUpdate(post._id, post, {
      new: true,
    });
    if (!updatedPost) throw new ResourceNotFoundError(post._id as string);
    return await this.getPost(updatedPost._id.toString(), updatedPost.author);
  }

  public async deletePost(_id: string): Promise<void> {
    const imageNames = await this.getImageNames(_id);
    const postToDelete = await Post.findById({ _id });
    if (!postToDelete) throw new ResourceNotFoundError(_id);
    await Album.findOneAndDelete({ referenceId: postToDelete.author });
    await Comment.deleteMany({ postId: _id });
    await Like.deleteMany({ targetId: _id });
    if (imageNames) {
      await Promise.all(
        imageNames.map(
          async (imageName) => await fileSaver.delete(imageName.url as string)
        )
      );
    }
    await Post.findByIdAndDelete(_id);
  }

  private async getImageNames(_id: string): Promise<MediaItem[]> {
    const post = await Post.findById(_id).select("imageNames");
    if (!post) throw new ResourceNotFoundError(_id);
    const imageNames = post.imageNames;
    return imageNames || [];
  }
}
export const postsService = new PostsService();
