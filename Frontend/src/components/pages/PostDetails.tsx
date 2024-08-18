import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "../../context/UserContext";
import { useTitle } from "../../hooks/useTitle";
import { AppState } from "../../redux/AppState";
import { initPosts } from "../../redux/PostsSlice";
import { postsService } from "../../services/PostsService";
import { PostCard } from "../areas/home/Post/Post";
import Loader from "../common/loader/Loader";

export default function PostDetails(): JSX.Element {
  useTitle("Friendify");
  const { postId } = useParams<{ postId: string }>();
  const {
    user: { _id: userId },
  } = useCurrentUser();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, isLoading } = useSelector(
    (appState: AppState) => appState.postsState
  );
  const storedPost = posts.find((post) => post._id === postId);

  const fetchPost = async () => {
    if (!postId || !userId) return;

    try {
      const post = await postsService.getPostByUser(postId, userId);
      dispatch(initPosts({ posts: [post], context: "home" }));
    } catch (err: any) {
      console.error("Failed to fetch post:", err.message);
    }
  };

  useEffect(() => {
    if (!storedPost && postId) {
      fetchPost();
    }
  }, [storedPost, postId, userId, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="max-w-[1200px] mt-10 bg-white dark:bg-dark-second dark:text-dark-txt mx-auto flex flex-col border-l border-r">
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md shadow-md transition duration-300 text-sm"
          onClick={() => navigate(-1)}
        >
          Return
        </button>
      </div>
      {storedPost ? (
        <PostCard post={storedPost} />
      ) : (
        <p className="text-lg text-center h-screen">
          Sorry, the post you're looking for has been deleted or does not exist.
        </p>
      )}
    </div>
  );
}
