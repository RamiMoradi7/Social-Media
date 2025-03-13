import { useParams } from "react-router-dom";
import { usePosts } from "../../../hooks/usePosts";
import { ContextType } from "../../../redux/PostsSlice";
import { ErrMsg } from "../../common/ErrMsg";
import PostsLoader from "../../common/loader/PostsLoader";
import { PostCard } from "../home/Post/Post";
import { useCurrentUser } from "../../../redux/Selectors";

export default function ProfilePostList(): JSX.Element {
    const user = useCurrentUser();
    const { _id: userId } = useParams();
    const { userProfilePosts, status } = usePosts({
        userId,
        currentUserId: user?._id,
        context: ContextType.Profile,   
    });

    if (status === "loading") return <PostsLoader />;
    // if (status === "error") return <ErrMsg />
    return (
        <div>
            {Object.values(userProfilePosts)?.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    );
}
