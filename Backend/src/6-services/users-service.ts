import mongoose, { FilterQuery } from "mongoose";
import { fileSaver } from "uploaded-file-saver";
import { imageHandlers } from "../2-utils/image-handlers";
import { handleImageChange, userPopulateFields } from "../2-utils/user-utils";
import { UserProps } from "../3-types/user-types";
import { Chat } from "../4-models/chat";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../4-models/client-errors";
import { Comment } from "../4-models/comment";
import { Like } from "../4-models/like";
import { Message } from "../4-models/message";
import { Post } from "../4-models/post";
import { Reply } from "../4-models/reply";
import { IUser, User } from "../4-models/user";
import { MediaTypes } from "../4-models/enums";

class UsersService {
  public async getUsers(filters: FilterQuery<IUser>): Promise<IUser[]> {
    const users = await User.find(filters)
      .select(
        "firstName isFriendRequestSent address lastName email friends friendRequests sentRequests profilePicture coverPhoto photos"
      )
      .populate([
        userPopulateFields.friends,
        userPopulateFields.friendRequests,
        userPopulateFields.sentRequests,
      ])
      .exec();

    return users;
  }

  public async getUser(
    userId: mongoose.Types.ObjectId,
    selectOptions?: string[]
  ): Promise<IUser> {
    let query = User.findById(userId);
    query.populate([
      userPopulateFields.friends,
      userPopulateFields.friendRequests,
      userPopulateFields.sentRequests,
    ]);
    if (selectOptions) {
      query = query.select(selectOptions.join(" "));
    }
    const user = await query.exec();

    if (!user) {
      throw new ResourceNotFoundError(userId.toString());
    }
    return user;
  }

  public async fetchUserProfile(
    userId: string,
    currentUserId: string
  ): Promise<IUser> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);
    const userProfile = await this.getUser(userObjectId);
    if (userId === currentUserId) return userProfile;

    const populatedUser: IUser = userProfile.toJSON();
    populatedUser.isFriendRequestSent =
      userProfile.isFriendRequestSentByUser(currentUserObjectId);

    return populatedUser;
  }

  public async updateUser({
    userId,
    userFields,
    coverPhoto,
    profilePicture,
    senderUserId,
  }: UserProps): Promise<IUser> {
    const user = await this.getUser(new mongoose.Types.ObjectId(userId));
    const errors = user.validateSync();

    if (userFields) {
      Object.assign(user, userFields);
    }

    if (errors) throw new ValidationError(errors.message);

    imageHandlers.configureFileSaver("1-assets", "users-images");
    if (profilePicture) {
      await handleImageChange(user, profilePicture, MediaTypes.PROFILE_PHOTO);
    }

    if (coverPhoto) {
      await handleImageChange(user, coverPhoto, MediaTypes.COVER_PHOTO);
    }

    const savedUser = await user.save();
    if (!savedUser) throw new ResourceNotFoundError(user._id as string);
    const updatedUser = await this.fetchUserProfile(userId, senderUserId);
    return updatedUser;
  }

  public async deleteUser(_id: string): Promise<void> {
    const userToDelete = await User.findByIdAndDelete(_id);
    if (!userToDelete) throw new ResourceNotFoundError(_id);

    const profilePic = await this.getOldImages(_id, "profilePicture");
    const coverPhoto = await this.getOldImages(_id, "coverPhoto");
    await Post.deleteMany({ author: _id });
    await Comment.deleteMany({ author: _id });
    await Reply.deleteMany({ author: _id });
    await Like.deleteMany({ userId: _id });
    await Chat.deleteMany({ participants: { $in: _id } });
    await Message.deleteMany({ sender: _id });
    await fileSaver.delete(profilePic);
    await fileSaver.delete(coverPhoto);
  }
  public async getOldImages(_id: string, oldImage: string): Promise<string> {
    const user = await User.findById(_id).select(oldImage);
    if (!user) {
      throw new ResourceNotFoundError(_id);
    }
    const oldImageName = user[oldImage] || "";
    return oldImageName;
  }
}
export const usersService = new UsersService();
