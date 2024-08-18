import mongoose, { FilterQuery, Types } from "mongoose";
import { fileSaver } from "uploaded-file-saver";
import { imageHandlers } from "../2-utils/image-handlers";
import {
  handleImageChange,
  updateRequests,
  userPopulateFields,
} from "../2-utils/user-utils";
import { UserProps } from "../3-types/user-types";
import { Chat } from "../4-models/chat";
import {
  ResourceNotFoundError,
  ValidationError,
} from "../4-models/client-errors";
import { Comment } from "../4-models/comment";
import { Like } from "../4-models/like";
import { Message } from "../4-models/message";
import { NotificationTypes } from "../4-models/notification";
import { Post } from "../4-models/post";
import { Reply } from "../4-models/reply";
import { IUser, User } from "../4-models/user";
import { notificationsService } from "./notifications-service";

class UsersService {
  public async getUsers(filters: FilterQuery<IUser>): Promise<IUser[]> {
    const users = await User.find(filters).populate(userPopulateFields).exec();
    return users;
  }

  public async getUser(userId: mongoose.Types.ObjectId): Promise<IUser> {
    const user = await User.findById(userId)
      .populate(userPopulateFields)
      .exec();

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

    const populatedUser = userProfile.toJSON();
    populatedUser.isFriendRequestSent =
      userProfile.isFriendRequestSentByUser(currentUserObjectId);

    return populatedUser as IUser;
  }

  public async getUserFriendsIds(userId: string): Promise<string[]> {
    const user = await User.findById(userId).select("friends").exec();
    const friendIds = user.friends.map((friend) => friend._id.toString());
    return friendIds || [];
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
      await handleImageChange(user, profilePicture, "profilePicture");
    }

    if (coverPhoto) {
      await handleImageChange(user, coverPhoto, "coverPhoto");
    }

    const savedUser = await user.save();
    if (!savedUser) throw new ResourceNotFoundError(user._id as string);
    const updatedUser = await this.fetchUserProfile(userId, senderUserId);
    return updatedUser;
  }

  public async sendFriendRequest(
    senderUserId: mongoose.Types.ObjectId & string,
    receiverUserId: mongoose.Types.ObjectId & string
  ): Promise<{ senderUser: IUser; receiverUser: IUser }> {
    const receiverUser = await this.getUser(receiverUserId);

    const updatedReceiver = await this.updateUser({
      userId: receiverUserId,
      userFields: {
        friendRequests: updateRequests(
          receiverUser.friendRequests,
          senderUserId
        ),
      },
      senderUserId: senderUserId,
    });

    await notificationsService.handleAddNotification({
      userId: receiverUserId,
      type: NotificationTypes.FriendRequest,
      message: "Sent you a friend request!",
      referenceId: senderUserId,
      senderId: senderUserId,
    });

    const senderUser = await this.getUser(senderUserId);

    const updatedSender = await this.updateUser({
      userId: senderUserId,
      userFields: {
        sentRequests: updateRequests(senderUser.sentRequests, receiverUserId),
      },
    });
    console.log({ updatedSender }, { updatedReceiver });
    return { senderUser: updatedSender, receiverUser: updatedReceiver };
  }

  public async acceptFriendRequest(
    senderUserId: string,
    receiverUserId: string
  ): Promise<{ senderUser: IUser; receiverUser: IUser }> {
    const receiverUser = await User.findById(receiverUserId);
    if (!receiverUser) throw new ResourceNotFoundError(receiverUserId);

    const updatedReceiver = await this.updateUser({
      userId: receiverUserId,
      senderUserId: receiverUserId,
      userFields: {
        friendRequests: updateRequests(
          receiverUser.friendRequests,
          new mongoose.Types.ObjectId(senderUserId)
        ),
        friends: [
          ...receiverUser.friends,
          new mongoose.Types.ObjectId(senderUserId),
        ],
      },
    });

    const senderUser = await User.findById(senderUserId);
    if (!senderUser) throw new ResourceNotFoundError(senderUserId);

    if (
      !senderUser.sentRequests.includes(
        new mongoose.Types.ObjectId(receiverUserId)
      )
    ) {
      throw new ValidationError(
        `User with ID ${receiverUserId} has not received a friend request from user with ID ${senderUserId}.`
      );
    }

    const updatedSender = await this.updateUser({
      userId: senderUserId,
      senderUserId: receiverUserId,
      userFields: {
        sentRequests: updateRequests(
          senderUser.sentRequests,
          new mongoose.Types.ObjectId(receiverUserId)
        ),
        friends: [
          ...senderUser.friends,
          new mongoose.Types.ObjectId(receiverUserId),
        ],
      },
    });

    return { senderUser: updatedSender, receiverUser: updatedReceiver };
  }

  public async deleteFriendRequest(
    senderUserId: Types.ObjectId,
    receiverUserId: string
  ): Promise<{ senderUser: IUser; receiverUser: IUser }> {
    const receiverUser = await User.findById(receiverUserId);
    if (!receiverUser) throw new ResourceNotFoundError(receiverUserId);

    const updatedReceiver = await this.updateUser({
      userId: receiverUserId,
      userFields: {
        friendRequests: updateRequests(
          receiverUser.friendRequests,
          senderUserId
        ),
      },
    });

    const senderUser = await User.findById(senderUserId);

    if (!senderUser) throw new ResourceNotFoundError(senderUserId.toString());
    const updatedSender = await this.updateUser({
      userId: senderUserId.toString(),
      userFields: {
        sentRequests: updateRequests(
          senderUser.sentRequests,
          new mongoose.Types.ObjectId(receiverUserId)
        ),
      },
    });

    return {
      senderUser: updatedSender,
      receiverUser: updatedReceiver,
    };
  }

  public async deleteFriendship(
    senderUserId: string,
    receiverUserId: string
  ): Promise<{ senderUser: IUser; receiverUser: IUser }> {
    const senderUser = await User.findById({ _id: senderUserId });
    const receiverUser = await User.findById({ _id: receiverUserId });

    if (!senderUser || !receiverUser) {
      throw new Error(
        `One or both users not found ${senderUserId},${receiverUserId}`
      );
    }

    const updatedSender = await this.updateUser({
      userId: senderUserId,
      userFields: {
        friends: updateRequests(
          senderUser.friends,
          new mongoose.Types.ObjectId(receiverUserId)
        ),
      },
    });

    const updatedReceiver = await this.updateUser({
      userId: receiverUserId,
      userFields: {
        friends: updateRequests(
          receiverUser.friends,
          new mongoose.Types.ObjectId(senderUserId)
        ),
      },
    });
    return { senderUser: updatedSender, receiverUser: updatedReceiver };
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
