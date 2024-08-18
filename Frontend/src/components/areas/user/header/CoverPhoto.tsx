import { ChangeEvent } from "react";
import ImageInput from "../inputs/ImageInput";

type CoverPhotoProps = {
  coverPhoto: string;
  isCurrentUser: boolean;
  onImageChange: (
    event: ChangeEvent<HTMLInputElement>,
    imageType: string
  ) => Promise<void>;
  toggleModal: (type: string | null) => void;
};

export default function CoverPhoto({
  coverPhoto,
  isCurrentUser,
  onImageChange,
  toggleModal,
}: CoverPhotoProps): JSX.Element {
  return (
    <>
      <img
        src={coverPhoto || ""}
        onClick={() => toggleModal("coverPhoto")}
        alt="User Cover"
        className="w-full object-top xl:h-[22rem] lg:h-[22rem] md:h-[16rem] sm:h-[13rem] xs:h-[9.5rem]"
      />
      {isCurrentUser && (
        <ImageInput
          onChange={onImageChange}
          imageType="coverPhoto"
          id="upload_cover"
          label="Cover"
          className="max-w-20 right-12 text-black dark:text-dark-txt z-10 inline-flex justify-start gap-1 items-center cursor-pointer"
        />
      )}
    </>
  );
}
