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
                className="w-full object-fit xl:h-[32rem] lg:h-[28rem] md:h-[23rem] sm:h-[20rem] xs:h-[22rem]"
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
