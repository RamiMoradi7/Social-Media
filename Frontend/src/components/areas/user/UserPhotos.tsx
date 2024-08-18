import { useState } from "react";
import { User } from "../../../models/User";
import { MediaItem } from "../../../types/UserTypes";
import PhotosSection from "../search-results/PhotosSection";

type MediaItemGroups = {
  [key in MediaItem["type"]]: MediaItem[];
};

type UserPhotosProps = {
  currentUser: User;
};

export default function UserPhotos({
  currentUser,
}: UserPhotosProps): JSX.Element {
  const { albums, firstName } = currentUser;
  const [selected, setSelected] = useState<"photos" | "albums">("photos");

  const flattenMediaItems: MediaItem[] = albums.flatMap(
    (album) => album.mediaItems
  );

  const groupedMediaItems: MediaItemGroups = flattenMediaItems.reduce(
    (acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    },
    {} as MediaItemGroups
  );
  console.log(groupedMediaItems?.photo);
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-thin dark:text-dark-txt">
          {" "}
          {firstName}'s Photos
        </h1>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
              selected === "photos"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300`}
            onClick={() => setSelected("photos")}
          >
            Photos
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
              selected === "albums"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300`}
            onClick={() => setSelected("albums")}
          >
            Albums
          </button>
        </div>
      </div>

      {selected === "photos" && (
        <div className="border-t border-gray-300 pt-4">
          {groupedMediaItems.photo?.length ? (
            <PhotosSection photos={groupedMediaItems.photo} />
          ) : (
            <p className="text-center dark:text-dark-txt">
              No photos available.
            </p>
          )}
        </div>
      )}

      {selected === "albums" && (
        <div className="space-y-8">
          <section className="border-t border-gray-300 pt-4">
            <h3 className="text-xl font-semibold dark:text-dark-txt mb-4">
              Cover Photos
            </h3>
            {groupedMediaItems.coverPhoto?.length ? (
              <PhotosSection photos={groupedMediaItems.coverPhoto} />
            ) : (
              <p className="text-center dark:text-dark-txt">
                No cover photos available.
              </p>
            )}
          </section>

          <section className="border-t border-gray-300 pt-4">
            <h3 className="text-xl font-semibold dark:text-dark-txt mb-4">
              Profile Photos
            </h3>
            {groupedMediaItems.profilePicture?.length ? (
              <PhotosSection photos={groupedMediaItems.profilePicture} />
            ) : (
              <p className="text-center dark:text-dark-txt">
                No profile photos available.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
