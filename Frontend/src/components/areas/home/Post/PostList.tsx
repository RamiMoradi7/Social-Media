import { useMemo } from "react";
import { useCurrentUser } from "../../../../context/UserContext";
import { usePosts } from "../../../../hooks/usePosts";
import Loader from "../../../common/loader/Loader";
import AddPost from "./AddPost";
import { PostCard } from "./Post";

export default function PostList(): JSX.Element {
  const {
    user: { _id: userId },
  } = useCurrentUser();

  const { posts, isLoading } = usePosts({ userId, context: "home" });
  const memorizedPosts = useMemo(() => posts, [posts]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <AddPost />
      {memorizedPosts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
