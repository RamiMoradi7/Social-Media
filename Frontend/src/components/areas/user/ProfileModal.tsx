import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { ContextType, initPosts } from "../../../redux/PostsSlice";
import { postsService } from "../../../services/PostsService";
import { usersService } from "../../../services/UsersService";
import { MediaItem } from "../../../types/UserTypes";
import PostsLoader from "../../common/loader/PostsLoader";
import Modal from "../../common/Modal";
import { PostCard } from "../home/Post/Post";
import { useCurrentUser, usePostSelector } from "../../../redux/Selectors";

type ProfileModalsProps = {
    isModalOpen: string | null;
    toggleModal: (type: string | null) => void;
    profileUserId: string
};

export default function ProfileModal({
    isModalOpen,
    toggleModal,
    profileUserId
}: ProfileModalsProps): JSX.Element {
    const [activeMediaItem, setActiveMediaItem] = useState<MediaItem | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const user = useCurrentUser()
    const { _id: currentUserId } = user
    const post = usePostSelector(activeMediaItem?.postId)

    const getActiveImagePost = async (imageType: string) => {
        if (!imageType) return
        try {
            setIsLoading(true)
            const userMediaItem = await usersService.getUserMediaItem(profileUserId, imageType)
            setActiveMediaItem(userMediaItem)

        } catch (err: any) {
            toast.error(`The post you are looking for is not available at this moment.`)
            setActiveMediaItem(null)
        } finally {
            setIsLoading(false)

        }
    };
    useEffect(() => {
        if (isModalOpen !== null) {
            getActiveImagePost(isModalOpen)
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (!post && activeMediaItem) {
            postsService.getPostByUser(activeMediaItem.postId, currentUserId)
                .then((post) => dispatch(initPosts({ posts: [post], context: ContextType.Profile })))
        }
    }, [activeMediaItem])

    if (!isModalOpen || !activeMediaItem || !post) {
        return null;
    }
    return (
        <>
            {isModalOpen && activeMediaItem && (
                <Modal
                    toggleModal={() => {
                        toggleModal(null);
                    }}
                    component={isLoading ? <PostsLoader /> : <PostCard post={post} />
                    }
                />
            )}
        </>
    );
}
