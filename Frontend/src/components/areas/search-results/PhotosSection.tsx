import { NavLink } from "react-router-dom";
import { MediaItem } from "../../../types/UserTypes";

type PhotosSectionProps = {
  photos: MediaItem[];
};

export default function PhotosSection({
  photos,
}: PhotosSectionProps): JSX.Element {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {photos?.map((photo) => {
        const urls = Array.isArray(photo.url) ? photo.url : [photo.url];
        return (
          <div
            key={photo.createdAt.toString()}
            className="relative overflow-hidden rounded-lg shadow-lg bg-gray-200"
          >
            <NavLink to={`/post/${photo.postId}`}>
              <div className="relative w-full h-full">
                {urls.length > 1 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-semibold">
                    {urls.length} Photos
                  </div>
                )}
                <img
                  src={urls[0]}
                  alt={`Photo ${photo.createdAt.toString()}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </NavLink>
          </div>
        );
      })}
    </div>
  );
}
