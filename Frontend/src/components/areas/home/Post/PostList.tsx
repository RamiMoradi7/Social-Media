import { useMemo } from "react";
import { usePosts } from "../../../../hooks/usePosts";
import { ContextType } from "../../../../redux/PostsSlice";
import PostsLoader from "../../../common/loader/PostsLoader";
import AddPost from "./AddPost";
import { PostCard } from "./Post";
import { ErrMsg } from "../../../common/ErrMsg";
import { useCurrentUser, useStateStatus } from "../../../../redux/Selectors";

export default function PostList(): JSX.Element {
    const user = useCurrentUser();
    const { _id: userId } = user

    const { posts, status } = usePosts({ userId, context: ContextType.Home });
    const isStateLoading = useStateStatus()
    const memorizedPosts = useMemo(() => posts, [posts]);

    if (isStateLoading) return <PostsLoader />;

    return (
        <div>
            <AddPost />
            {Object.values(memorizedPosts)?.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
            {status === "loading" && <PostsLoader />}
            {status === "error" && <ErrMsg />}
        </div>
    );
}
