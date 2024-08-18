import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../redux/AppState";
import { PostsResponse, postsService } from "../services/PostsService";
import { notify } from "../utilities/Notify";
import { ContextType } from "../redux/PostsSlice";
import _ from "lodash";

type usePostsProps = {
  userId: string;
  context: ContextType;
  currentUserId?: string;
};

export const usePosts = ({ userId, currentUserId, context }: usePostsProps) => {
  const { posts, userProfilePosts, isLoading } = useSelector(
    (appState: AppState) => appState.postsState
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = _.debounce(
    useCallback(
      async (page: number) => {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
          let postsResponse: PostsResponse;
          if (context === "home") {
            postsResponse = await postsService.getPosts(userId, null, page);
          } else if (context === "profile") {
            postsResponse = await postsService.getUserProfilePosts(
              userId,
              currentUserId,
              page
            );
          }
          if (postsResponse) {
            setPage(postsResponse.currentPage);
            setHasMore(postsResponse.currentPage < postsResponse.totalPages);
          }
          return postsResponse;
        } catch (err: any) {
          notify.error(err.message || "An error occurred while fetching posts");
          setLoading(false);
        } finally {
          setLoading(false);
        }
      },
      [context, userId, currentUserId, loading]
    ),
    500
  );

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (hasMore) {
          fetchPosts(page + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, fetchPosts, page]);

  //initial fetching.
  useEffect(() => {
    fetchPosts(page);
  }, []);

  return {
    posts,
    userProfilePosts,
    isLoading,
  };
};
