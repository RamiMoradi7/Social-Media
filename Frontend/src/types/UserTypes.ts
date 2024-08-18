export type userAddress = {
  city: string;
  state: string;
  country: string;
};
export enum PrivacyOptions {
  Public = "public",
  Friends = "friends",
  Private = "private",
}
export type MediaItem = {
  type: "profilePicture" | "coverPhoto" | "photo" | "video";
  url: string | string[];
  createdAt: Date;
  postId?: string;
};
