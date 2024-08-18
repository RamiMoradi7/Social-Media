import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SelectedFilterType } from "../components/areas/search-results/SearchMenuFilter";
import { useCurrentUser } from "../context/UserContext";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { postsService } from "../services/PostsService";
import { usersService } from "../services/UsersService";
import { MediaItem } from "../types/UserTypes";

export type SearchState = {
  users: User[];
  posts: Post[];
  photos: MediaItem[];
};

type Status = "loading" | "error" | "success" | "idle";

const initialSearchState: SearchState = {
  users: [],
  posts: [],
  photos: [],
};

export const useSearchResults = (type: SelectedFilterType) => {
  const { user } = useCurrentUser();
  const location = useLocation();
  const [searchResults, setSearchResults] =
    useState<SearchState>(initialSearchState);
  const [status, setStatus] = useState<Status>("idle");

  const query = new URLSearchParams(location.search).get("q") || "";

  const fetchUsers = async (query: string) => {
    try {
      setStatus("loading");
      const users = await usersService.getUsers({ name: query });
      setSearchResults((prevResults) => ({ ...prevResults, users }));
    } catch (err: any) {
      setStatus("error");
    } finally {
      setStatus("success");
    }
  };

  const fetchPosts = async (query: string) => {
    try {
      setStatus("loading");
      const posts = (await postsService.getPosts(user._id, query)).posts;
      console.log(posts);
      setSearchResults((prevResults) => ({ ...prevResults, posts }));
    } catch (err: any) {
      setStatus("error");
    } finally {
      setStatus("success");
    }
  };

  const fetchPhotos = async (query: string) => {
    try {
      setStatus("loading");
      const users = await usersService.getUsers({ name: query });
      const photos = users.flatMap((user) =>
        user.albums.flatMap((album) =>
          album.mediaItems
            .filter((mediaItem) => mediaItem.type === "photo")
            .flatMap((mediaItem) => {
              const urls = Array.isArray(mediaItem.url)
                ? mediaItem.url
                : [mediaItem.url];
              return urls.map((url) => ({
                ...mediaItem,
                url,
              }));
            })
        )
      );

      setSearchResults((prevResults) => ({ ...prevResults, photos }));
    } catch (err: any) {
      setStatus("error");
    } finally {
      setStatus("success");
    }
  };

  const handleSearchQuery = async (type: SelectedFilterType) => {
    try {
      if (type === "people") {
        await fetchUsers(query);
      }

      if (type === "posts") {
        await fetchPosts(query);
      }
      if (type === "photos") {
        await fetchPhotos(query);
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
