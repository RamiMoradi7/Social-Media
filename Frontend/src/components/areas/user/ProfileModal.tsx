import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Album } from "../../../models/User";
import { AppState } from "../../../redux/AppState";
import { initPosts } from "../../../redux/PostsSlice";
import { store } from "../../../redux/Store";
import { postsService } from "../../../services/PostsService";
import Modal from "../../common/Modal";
import { PostCard } from "../home/Post/Post";

type ProfileModalsProps = {
  isModalOpen: string;
  toggleModal: (type: string | null) => void;
  albums: Album[];
  currentUserId: string;
};

export default function ProfileModal({
  isModalOpen,
  toggleModal,
  albums,
  currentUserId,
}: ProfileModalsProps): JSX.Element {

    const getActiveImagePost = (imageType: string) => {
    if (!albums || !imageType) return null;

    const userAlbum = albums.find(
      (album) => album.title.toLowerCase() === imageType.toLowerCase()
    );

    if (!userAlbum) return null;

    const profilePictures = userAlbum.mediaItems.filter(
      (item) => item.type.toLowerCase() === imageType.toLowerCase()
    );

    if (profilePictures.length === 0) return null;

    return profilePictures.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  };

  const activeImagePost = getActiveImagePost(isModalOpen || "");

  const fetchPost = async (postId: string) => {
    try {
      if (postId) {
        const post = await postsService.getPostByUser(postId, currentUserId);
        store.dispatch(initPosts({ posts: [post], context: "profile" }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const post = useSelector((appState: AppState) =>
    appState.postsState.userProfilePosts.find(
      (post) => post?._id === activeImagePost?.postId
    )
  );

  useEffect(() => {
    if (activeImagePost && !post) {
      fetchPost(activeImagePost.postId);
    }
  }, [activeImagePost, post, currentUserId]);

  return (
    <>
      {isModalOpen && activeImagePost && (
        <Modal
          toggleModal={() => {
            toggleModal(null);
          }}
          component={post ? <PostCard post={post} /> : <div>Loading...</div>}
        />
      )}
    </>
  );
}
