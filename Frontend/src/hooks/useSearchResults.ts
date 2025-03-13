import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { postsService } from "../services/PostsService";
import { usersService } from "../services/UsersService";
import { MediaItem } from "../types/UserTypes";
import { useCurrentUser } from "../redux/Selectors";

export type SearchState = {
  users: User[];
  posts: Post[];
  photos: MediaItem[];
};

export type Status = "loading" | "error" | "success" | "idle";

enum FilterTypes {
  POSTS = "posts",
  PHOTOS = "photos",
  PEOPLE = "people",
}

const initialSearchState: SearchState = {
  users: [],
  posts: [],
  photos: [],
};

export const useSearchResults = (type: FilterTypes) => {
  const user = useCurrentUser();
  const location = useLocation();
  const [searchResults, setSearchResults] =
    useState<SearchState>(initialSearchState);
  const [status, setStatus] = useState<Status>("idle");

  const resetStateEntity = (state: keyof SearchState) => {
    setSearchResults((prevResults) => ({
      ...prevResults,
      [state]: [],
    }));
  };

  const query = new URLSearchParams(location.search).get("q") || "";

  const fetchUsers = async (query: string) => {
    try {
      resetStateEntity("users");
      setStatus("loading");
      const users = await usersService.getUsers({
        name: query,
        currentUserId: user?._id,
      });
      setSearchResults((prevResults) => ({ ...prevResults, users }));
    } catch (err: any) {
      setStatus("error");
    } finally {
      setStatus("success");
    }
  };

  const fetchPosts = async (query: string) => {
    try {
      resetStateEntity("posts");
      setStatus("loading");
      const posts = (await postsService.getPosts(user._id, query)).posts;
      setSearchResults((prevResults) => ({ ...prevResults, posts }));
    } catch (err: any) {
      setStatus("error");
    } finally {
      setStatus("success");
    }
  };

  const fetchPhotos = async (query: string) => {
    try {
      resetStateEntity("photos");
      setStatus("loading");
      const users = await usersService.getUsers({ name: query });

      const allPhotos = await Promise.all(
        users.map(async (user) => {
          const userAlbums = await usersService.getUserAlbums(user._id);

          return userAlbums.flatMap((album) => album.mediaItems);
        })
      );

      const photos = allPhotos.flat();

      setSearchResults((prevResults) => ({ ...prevResults, photos }));
    } catch (err: any) {
      setStatus("error");
    } finally {
      setStatus("success");
    }
  };

  const handleSearchQuery = async (type: FilterTypes) => {
    try {
      switch (type) {
        case FilterTypes.PEOPLE:
          await fetchUsers(query);
          break;
        case FilterTypes.POSTS:
          await fetchPosts(query);
          break;
        case FilterTypes.PHOTOS:
          await fetchPhotos(query);
          break;
      }
    } catch (err: any) {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (query && type) {
      handleSearchQuery(type);
    }
  }, [query, type]);

  return { searchResults, query, status };
};
