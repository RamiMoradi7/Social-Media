import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ContextType } from "../redux/PostsSlice";
import { PostsResponse, postsService } from "../services/PostsService";
import { Status } from "./useSearchResults";
import { usePostsSelector } from "../redux/Selectors";

type usePostsProps = {
  userId: string;
  context: ContextType;
  currentUserId?: string;
};

export const usePosts = ({ userId, currentUserId, context }: usePostsProps) => {
  const posts = usePostsSelector();
  const [status, setStatus] = useState<Status>("idle");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (page: number) => {
    if (!hasMore) return;
    setStatus("loading");
    try {
      let postsResponse: PostsResponse;

      switch (context) {
        case ContextType.Home:
          postsResponse = await postsService.getPosts(userId, null, page);
          break;
        case ContextType.Profile:
          postsResponse = await postsService.getUserProfilePosts(
            userId,
            currentUserId,
            page
          );
          break;
      }
      if (postsResponse) {
        setPage(postsResponse.currentPage);
        setHasMore(postsResponse.currentPage < postsResponse.totalPages);
      }
      setStatus("success");
    } catch (err: any) {
      toast.error(err?.message || "An error occurred while fetching posts");
      setStatus("error");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (hasMore && status !== "loading") {
          fetchPosts(page + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, status]);

  useEffect(() => {
    fetchPosts(page);
  }, []);

  return {
    posts,
    userProfilePosts: posts,
    status,
  };
};
