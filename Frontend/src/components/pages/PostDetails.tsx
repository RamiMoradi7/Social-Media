import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Status } from "../../hooks/useSearchResults";
import { useTitle } from "../../hooks/useTitle";
import { ContextType, initPosts } from "../../redux/PostsSlice";
import { postsService } from "../../services/PostsService";
import { PostCard } from "../areas/home/Post/Post";
import Loader from "../common/loader/Loader";
import { useCurrentUser, usePostSelector } from "../../redux/Selectors";

export default function PostDetails(): JSX.Element {
    const { postId } = useParams<{ postId: string }>();
    const post = usePostSelector(postId)
    const [status, setStatus] = useState<Status>("idle")
    useTitle(`${post ? post.author.firstName + "'s Post" : "Friendify"}`);
    const user = useCurrentUser();
    const { _id: userId } = user

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const fetchPost = async () => {
        if (!postId || !userId) return;

        try {
            setStatus("loading")
            await new Promise((resolve) => setTimeout(resolve, 700));
            const post = await postsService.getPostByUser(postId, userId);
            dispatch(initPosts({ posts: [post], context: ContextType.Home }));
            setStatus("success")
        } catch (err: any) {
            console.error("Failed to fetch post:", err.message);
            setStatus("error")
        }
    };

    useEffect(() => {
        if (!post && postId) {
            fetchPost();
        }
    }, [post, postId, userId]);

    if (status === "loading") return <Loader />;
    if (status === "error") {
        return <p className="text-lg text-center h-screen">
            Sorry, the post you're looking for has been deleted or does not exist.
        </p>
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
            {post && (<PostCard post={post} />)}
        </div>
    );
}