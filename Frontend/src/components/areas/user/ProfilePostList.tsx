import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../../context/UserContext";
import Loader from "../../common/loader/Loader";
import { usePosts } from "../../../hooks/usePosts";
import AddPost from "../home/Post/AddPost";
import { PostCard } from "../home/Post/Post";

export default function ProfilePostList(): JSX.Element {
  const {
    user: { _id: currentUserId },
  } = useCurrentUser();
  const { _id: userId } = useParams();
  const { userProfilePosts, isLoading } = usePosts({
    userId,
    currentUserId,
    context: "profile",
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <AddPost />
      {userProfilePosts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
