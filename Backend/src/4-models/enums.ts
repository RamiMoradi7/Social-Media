export enum StatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export enum RoleModel {
  Admin = 1,
  User = 2,
}

export enum PrivacyOptions {
  Public = "Public",
  Private = "Private",
  Friends = "Friends",
}

export enum UserSelectFields {
  FRIENDS = "friends",
  FRIEND_REQUESTS = "friendRequests",
  SENT_REQUESTS = "sentRequests",
  IS_REQUEST_SENT = "isFriendRequestSent",
}

export enum MediaTypes {
  POST_PHOTO = "photo",
  PROFILE_PHOTO = "profilePicture",
  COVER_PHOTO = "coverPhoto",
  VIDEO = "video",
}

export enum FriendRequestStatus {
  NONE = "none",
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export enum FriendShipActions {
  FRIEND_REQUEST = "friendRequest",
  REMOVE_REQUEST = "removeRequest",
  ACCEPT_REQUEST = "acceptRequest",
  IGNORE_REQUEST = "ignoreRequest",
  DELETE_FRIENDSHIP = "deleteFriendship",
}
