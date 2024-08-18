import { useNavigate } from "react-router-dom";
import { PostMediaItem } from "../../../../models/Post";

type PostPhotosProps = {
  postId: string;
  photos: PostMediaItem[];
};

export default function PostPhotos({
  photos,
  postId,
}: PostPhotosProps): JSX.Element {
  const navigate = useNavigate();
  const numPhotos = photos.length;

  return (
    <div className="relative mb-7 mt-6 mx-3 px-2">
      <div
        onClick={() => navigate(`/post/${postId}`)}
        className={`grid ${
          numPhotos === 1
            ? "grid-cols-1"
            : numPhotos === 2
            ? "grid-cols-2 space-x-2"
            : numPhotos === 3
            ? "grid-cols-3 space-x-2"
            : numPhotos === 4
            ? "grid-cols-2 gap-2"
            : "grid-cols-3 gap-2"
        } cursor-pointer`}
      >
        {photos.map((media, index) => (
          <div
            key={media.imageUrl}
            className={`relative overflow-hidden rounded-lg ${
              numPhotos === 1
                ? "col-span-1"
                : numPhotos === 2
                ? "col-span-1"
                : numPhotos === 3
                ? "col-span-1"
                : numPhotos === 4
                ? "col-span-1"
                : "col-span-1"
            }`}
          >
            {media.type === "image" ? (
              <img
                className="h-full w-full object-cover"
                src={media.imageUrl}
                alt={`Media ${index + 1}`}
              />
            ) : media.type === "video" ? (
              <video
                className="h-full w-full object-cover"
                controls
                src={media.imageUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        ))}
        {numPhotos > 4 && (
          <div className="relative overflow-hidden rounded-lg col-span-1">
            <img
              className="h-full w-full object-cover"
              src={photos[4].imageUrl}
              alt={`Media 5`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-xl font-semibold">
              + {numPhotos - 4}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
