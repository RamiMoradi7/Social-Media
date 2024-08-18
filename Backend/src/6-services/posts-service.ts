import { UploadedFile } from "express-fileupload";
import mongoose from "mongoose";
import { fileSaver } from "uploaded-file-saver";
import { imageHandlers } from "../2-utils/image-handlers";
import { getPostsWithLikes, postPopulateFields } from "../2-utils/posts-utils";
import { updateUserAlbum } from "../2-utils/user-utils";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../4-models/client-errors";
import { Comment } from "../4-models/comment";
import { Like } from "../4-models/like";
import { IPost, MediaItem, Post } from "../4-models/post";
import { User } from "../4-models/user";
import { usersService } from "./users-service";

type PostProps = {
  post: IPost;
  images?: UploadedFile[];
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
    const user = await User.findById({ _id: userId }).exec();
    if (!user) throw new ResourceNotFoundError(userId.toString());

    const baseQuery = {
      $or: [{ author: userId }, { author: { $in: user.friends } }],
      privacy: { $in: ["Public", "Friends"] },
    };

    if (query) {
      baseQuery["content"] = { $regex: query, $options: "i" };
    }

    const { posts, totalPages, totalPosts, currentPage } =
      await this.paginatePosts(baseQuery, page);

    const postsWithLikes = getPostsWithLikes(userId, posts);
    return { posts: postsWithLikes, totalPosts, totalPages, currentPage };
  }

  public async getUserProfilePosts({
    userId,
    currentUserId,
    page,
  }: GetPostsProps): Promise<PostsResponse> {
    const userProfile = await usersService.getUser(userId);
    const userPosts = await Post.find({ author: userId })
      .populate(postPopulateFields)
      .exec();

    const posts = await this.paginatePosts(
      {
        _id: { $in: userPosts },
      },
      page
    );

    const isOwnProfile = userId.equals(currentUserId);
    if (isOwnProfile) {
      const postsWithLikes = getPostsWithLikes(userId, posts.posts);
      return { ...posts, posts: postsWithLikes };
    } else {
      const isFriends = userProfile.friends.some((friendId) =>
        friendId.equals(new mongoose.Types.ObjectId(currentUserId))
      );

      let postsWithLikes = getPostsWithLikes(currentUserId, posts.posts);
      postsWithLikes = postsWithLikes.filter((post) => {
        if (post.privacy === "Public") return true;
        if (post.privacy === "Friends") return isFriends;
        return false;
      });

      return { ...posts, posts: postsWithLikes };
    }
  }

  private async paginatePosts(query: object, page: number) {
    const postsPerPage = 7;
    const totalPosts = await Post.countDocuments(query).exec();
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const skip = (page - 1) * postsPerPage;
    const currentPage = page;

    const posts = await Post.find(query)
      .skip(skip)
      .limit(postsPerPage)
      .populate(postPopulateFields)
      .exec();

    return { posts, totalPosts, totalPages, currentPage };
  }

  public async getPost(
    postId: string,
    userId?: mongoose.Types.ObjectId
  ): Promise<IPost> {
    const post = await Post.findById({ _id: postId })
      .populate(postPopulateFields)
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
          const imageName = await fileSaver.add(image);
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
      await updateUserAlbum(
        user,
        post.imageNames.map((imageName) => imageName.url),
        "photo",
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

    const user = await User.findById(post.author);
    if (user) {
      const postIndex = user.posts.findIndex(
        (post) => post._id === updatedPost._id
      );
      if (postIndex !== -1) {
        user.posts[postIndex] = updatedPost;
        await user.save();
      }
    }
    if (!updatedPost) throw new ResourceNotFoundError(post._id as string);
    return await this.getPost(updatedPost._id.toString(), updatedPost.author);
  }

  public async deletePost(_id: string): Promise<void> {
    const imageNames = await this.getImageNames(_id);
    const postToDelete = await Post.findByIdAndDelete({ _id });
    if (!postToDelete) throw new ResourceNotFoundError(_id);

    await User.findByIdAndUpdate(
      postToDelete.author._id,
      {
        $pull: { "albums.$[].mediaItems": { postId: _id } },
      },
      { multi: true }
    );
    await Comment.deleteMany({ postId: _id });
    await Like.deleteMany({ targetId: _id });

    await Promise.all(
      imageNames.map(
        async (imageName) => await fileSaver.delete(imageName.url as string)
      )
    );

    const userId = postToDelete.author?._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          posts: new mongoose.Types.ObjectId(_id),
          "albums.$[].mediaItems": { postId: new mongoose.Types.ObjectId(_id) },
        },
      },
      { new: true }
    );

    if (!updatedUser) throw new ResourceNotFoundError(userId.toString());
  }

  private async getImageNames(_id: string): Promise<MediaItem[]> {
    const post = await Post.findById(_id).select("imageNames");
    if (!post) throw new ResourceNotFoundError(_id);
    const imageNames = post.imageNames;
    return imageNames || [];
  }
}
export const postsService = new PostsService();
