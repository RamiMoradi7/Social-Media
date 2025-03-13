import mongoose from "mongoose";
import { ValidationError } from "../4-models/client-errors";
import {
  FriendRequestStatus,
  FriendShipActions,
  UserSelectFields,
} from "../4-models/enums";
import { IFriendRequest } from "../4-models/friend-request";
import { FriendRequest } from "./../4-models/friend-request";
import { usersService } from "./users-service";
import { notificationsService } from "./notifications-service";
import { NotificationTypes } from "../4-models/notification";

type FriendRequestAction = "add" | "accept" | "reject" | "cancel" | "delete";
type RequestTypes = {
  targetUserId?: mongoose.Types.ObjectId;
  currentUserId?: mongoose.Types.ObjectId;
  friendRequest?: IFriendRequest;
  action?: FriendShipActions;
};

class FriendRequestsService {
  public async getFriendRequest({
    currentUserId,
    targetUserId,
  }: RequestTypes): Promise<IFriendRequest | null> {
    const friendRequest = await FriendRequest.findOne({
      $or: [
        { targetUserId, currentUserId },
        { targetUserId: currentUserId, currentUserId: targetUserId },
      ],
    });

    return friendRequest || null;
  }

  public async handleFriendRequest({
    currentUserId,
    targetUserId,
    action,
  }: RequestTypes): Promise<IFriendRequest> {
    try {
      let friendRequest: IFriendRequest | null = await this.getFriendRequest({
        targetUserId,
        currentUserId,
      });

      switch (action) {
        case FriendShipActions.FRIEND_REQUEST:
          return await this.toggleFriendRequest({
            friendRequest,
            currentUserId,
            targetUserId,
          });

        case FriendShipActions.ACCEPT_REQUEST:
          if (!friendRequest) {
            throw new ValidationError(`No friend request found.`);
          }
          return await this.acceptRequest(friendRequest);
        case FriendShipActions.IGNORE_REQUEST:
          if (!friendRequest) {
            throw new ValidationError(`No friend request found.`);
          }
          return await this.rejectRequest(friendRequest);
        case FriendShipActions.DELETE_FRIENDSHIP:
          if (!friendRequest) {
            throw new ValidationError(`No friend request found.`);
          }
          //   await this.deleteFriendship(friendRequest);
          return null;
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  private async toggleFriendRequest({
    currentUserId,
    targetUserId,
    friendRequest,
  }: RequestTypes): Promise<IFriendRequest> {
    if (friendRequest) {
      switch (friendRequest.status) {
        case FriendRequestStatus.PENDING:
          return await this.cancelRequest(friendRequest);
        case FriendRequestStatus.NONE:
        case FriendRequestStatus.REJECTED:
          return await this.updateFriendRequest({ friendRequest });
      }
    }
    return await this.sendFriendRequest({ currentUserId, targetUserId });
  }

  private async sendFriendRequest({
    currentUserId,
    targetUserId,
  }: RequestTypes): Promise<IFriendRequest> {
    const newFriendRequest = new FriendRequest({
      targetUserId,
      currentUserId,
      status: FriendRequestStatus.PENDING,
    });

    const errors = newFriendRequest.validateSync();
    if (errors) throw new ValidationError(errors.message);

    await notificationsService.handleAddNotification({
      userId: targetUserId,
      type: NotificationTypes.FriendRequest,
      message: "Sent you a friend request!",
      referenceId: currentUserId,
      senderId: currentUserId,
    });

    return await newFriendRequest.save();
  }

  private async updateFriendRequest({
    friendRequest,
  }: RequestTypes): Promise<IFriendRequest> {
    if (!friendRequest) throw new ValidationError(`No friend request found.`);
    return await FriendRequest.findByIdAndUpdate(friendRequest?._id, {
      status: FriendRequestStatus.PENDING,
    });
  }

  private async cancelRequest(
    friendRequest: IFriendRequest
  ): Promise<IFriendRequest> {
    const { targetUserId, currentUserId } = friendRequest;

    if (friendRequest.status === FriendRequestStatus.NONE) {
      throw new ValidationError(
        "This friend request has already been cancelled."
      );
    }

    friendRequest.status = FriendRequestStatus.NONE;

    await notificationsService.handleRemoveNotification({
      userId: targetUserId,
      type: NotificationTypes.FriendRequest,
      referenceId: currentUserId,
      senderId: currentUserId,
    });

    await friendRequest.save();
    return friendRequest;
  }
  private async acceptRequest(
    friendRequest: IFriendRequest
  ): Promise<IFriendRequest> {
    const { targetUserId, currentUserId } = friendRequest;
    const targetUser = await usersService.getUser(targetUserId, ["_id"]);
    const currentUser = await usersService.getUser(currentUserId, ["_id"]);

    if (!targetUser || !currentUser) {
      throw new ValidationError("One or both users not exists.");
    }

    friendRequest.status = FriendRequestStatus.ACCEPTED;
    await notificationsService.handleAddNotification({
      userId: targetUserId,
      type: NotificationTypes.AcceptFriendRequest,
      message: "Accepted your friend request!",
      referenceId: currentUserId,
      senderId: currentUserId,
    });

    await friendRequest.save();
    return friendRequest;
  }

  private async rejectRequest(
    friendRequest: IFriendRequest
  ): Promise<IFriendRequest> {
    friendRequest.status = FriendRequestStatus.REJECTED;
    await friendRequest.save();
    return friendRequest;
  }
}

export const friendRequestsService = new FriendRequestsService();
