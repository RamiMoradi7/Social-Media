import mongoose, { Types } from "mongoose";
import { updateRequests } from "../2-utils/user-utils";
import { UserProps } from "../3-types/user-types";
import { ResourceNotFoundError } from "../4-models/client-errors";
import { UserSelectFields } from "../4-models/enums";
import { NotificationTypes } from "../4-models/notification";
import { IUser, User } from "../4-models/user";
import { notificationsService } from "./notifications-service";
import { usersService } from "./users-service";

interface UserRequests {
  friends?: IUser["friends"];
  friendRequests?: IUser["friendRequests"];
  sentRequests?: IUser["sentRequests"];
  isRequestSent?: boolean;
}

class UserRequestsService {
  public async updateUsersRequests({
    userId,
    userFields,
    senderUserId,
  }: UserProps) {
    const user = await User.findById(userId);
    if (!user) throw new ResourceNotFoundError(userId);
    if (userFields) {
      Object.assign(user, userFields);
    }
    await user.save();

    const updatedUser = await usersService.getUser(
      new mongoose.Types.ObjectId(userId),
      [
        UserSelectFields.FRIEND_REQUESTS,
        UserSelectFields.SENT_REQUESTS,
        UserSelectFields.IS_REQUEST_SENT,
      ]
    );
    const upUser: IUser = updatedUser.toJSON();

    if (senderUserId) {
      upUser.isFriendRequestSent = updatedUser.isFriendRequestSentByUser(
        new mongoose.Types.ObjectId(senderUserId)
      );
    }
    return upUser;
  }

  public async toggleFriendRequest(
    senderUserId: mongoose.Types.ObjectId & string,
    receiverUserId: mongoose.Types.ObjectId & string
  ): Promise<{ senderUser: UserRequests; receiverUser: UserRequests }> {
    const receiverUser = await usersService.getUser(receiverUserId, [
      UserSelectFields.FRIEND_REQUESTS,
      UserSelectFields.SENT_REQUESTS,
    ]);

    const updatedReceiver = await this.updateUsersRequests({
      userId: receiverUserId,
      userFields: {
        friendRequests: updateRequests(
          receiverUser.friendRequests,
          senderUserId
        ),
      },
      senderUserId,
    });

    const isRequestSent = updatedReceiver.friendRequests.some(
      (request) => request._id.toString() === senderUserId.toString()
    );

    if (isRequestSent) {
      await notificationsService.handleAddNotification({
        userId: receiverUserId,
        type: NotificationTypes.FriendRequest,
        message: "Sent you a friend request!",
        referenceId: senderUserId,
        senderId: senderUserId,
      });
    } else {
      await notificationsService.handleRemoveNotification({
        userId: receiverUserId,
        type: NotificationTypes.FriendRequest,
        referenceId: senderUserId,
        senderId: senderUserId,
      });
    }

    const senderUser = await usersService.getUser(senderUserId, [
      UserSelectFields.FRIEND_REQUESTS,
      UserSelectFields.SENT_REQUESTS,
    ]);

    const updatedSender = await this.updateUsersRequests({
      userId: senderUserId,
      userFields: {
        sentRequests: updateRequests(senderUser.sentRequests, receiverUserId),
      },
      senderUserId: receiverUserId,
    });

    return { senderUser: updatedSender, receiverUser: updatedReceiver };
  }

  public async acceptFriendRequest(
    senderUserId: Types.ObjectId & string,
    receiverUserId: Types.ObjectId & string
  ): Promise<{ senderUser: UserRequests; receiverUser: UserRequests }> {
    const receiverUser = await usersService.getUser(receiverUserId, [
      UserSelectFields.FRIENDS,
      UserSelectFields.FRIEND_REQUESTS,
      UserSelectFields.SENT_REQUESTS,
    ]);

    const updatedReceiver = await this.updateUsersRequests({
      userId: receiverUserId,
      senderUserId: receiverUserId,
      userFields: {
        friendRequests: updateRequests(
          receiverUser.friendRequests,
          senderUserId
        ),
        friends: [...receiverUser.friends, senderUserId],
      },
    });

    const senderUser = await usersService.getUser(senderUserId, [
      UserSelectFields.FRIENDS,
      UserSelectFields.FRIEND_REQUESTS,
      UserSelectFields.SENT_REQUESTS,
    ]);

    const updatedSender = await this.updateUsersRequests({
      userId: senderUserId,
      senderUserId: receiverUserId,
      userFields: {
        sentRequests: updateRequests(senderUser.sentRequests, receiverUserId),
        friends: [...senderUser.friends, receiverUserId],
      },
    });
    await notificationsService.handleAddNotification({
      userId: senderUserId,
      type: NotificationTypes.AcceptFriendRequest,
      message: "Accepted your friend request!",
      referenceId: receiverUserId,
      senderId: receiverUserId,
    });

    return { senderUser: updatedSender, receiverUser: updatedReceiver };
  }

  public async deleteFriendRequest(
    senderUserId: Types.ObjectId & string,
    receiverUserId: Types.ObjectId & string
  ): Promise<{ senderUser: UserRequests; receiverUser: UserRequests }> {
    const receiverUser = await usersService.getUser(receiverUserId, [
      UserSelectFields.FRIEND_REQUESTS,
      UserSelectFields.SENT_REQUESTS,
    ]);
    const updatedReceiver = await this.updateUsersRequests({
      userId: receiverUserId,
      userFields: {
        friendRequests: updateRequests(
          receiverUser.friendRequests,
          senderUserId
        ),
      },
    });

    const senderUser = await usersService.getUser(senderUserId, [
      UserSelectFields.FRIEND_REQUESTS,
      UserSelectFields.SENT_REQUESTS,
    ]);
    const updatedSender = await this.updateUsersRequests({
      userId: senderUserId.toString(),
      senderUserId: receiverUserId,
      userFields: {
        sentRequests: updateRequests(senderUser.sentRequests, receiverUserId),
      },
    });

    return {
      senderUser: updatedSender,
      receiverUser: updatedReceiver,
    };
  }

  public async deleteFriendship(
    senderUserId: Types.ObjectId & string,
    receiverUserId: Types.ObjectId & string
  ): Promise<{ senderUser: UserRequests; receiverUser: UserRequests }> {
    const senderUser = await usersService.getUser(senderUserId, [
      UserSelectFields.FRIENDS,
    ]);
    const receiverUser = await usersService.getUser(receiverUserId, [
      UserSelectFields.FRIENDS,
    ]);

    if (!senderUser || !receiverUser) {
      throw new Error(
        `One or both users not found ${senderUserId},${receiverUserId}`
      );
    }

    const updatedSender = await this.updateUsersRequests({
      userId: senderUserId,
      userFields: {
        friends: updateRequests(senderUser.friends, receiverUserId),
      },
    });

    const updatedReceiver = await this.updateUsersRequests({
      userId: receiverUserId,
      userFields: {
        friends: updateRequests(receiverUser.friends, senderUserId),
      },
    });
    return { senderUser: updatedSender, receiverUser: updatedReceiver };
  }
}

export const userRequestsService = new UserRequestsService();
