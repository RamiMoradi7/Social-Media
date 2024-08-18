import { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import Image from "../svgs/Image";

type UploadImageProps = {
  registerName: string;
  id: string;
  defaultImageUrl?: string;
  required: boolean;
};

export default function UploadImage({
  registerName,
  id,
  defaultImageUrl,
  required,
}: UploadImageProps): JSX.Element {
  const { setValue, formState } = useFormContext();
  const [imageUrl, setImageUrl] = useState<string | null>(
    defaultImageUrl ? defaultImageUrl : null
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files[0];
    if (image) {
      setValue(registerName, image);
      const url = URL.createObjectURL(image);
      setImageUrl(url);
    }
  };
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      setImageUrl(null);
    }
  }, [formState.isSubmitSuccessful]);

  return (
    <>
      {imageUrl && (
        <div className="mr-4">
          <img
            src={imageUrl}
            width={50}
            className="rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
            alt="Uploaded preview"
          />
        </div>
      )}
      <input
        id={id}
        type="file"
        className="hidden"
        required={required}
        onChange={handleImageChange}
      />
      <label htmlFor={id} className="cursor-pointer">
        <span className="flex items-center transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 w-8 h-8 px-2 rounded-full text-blue-400 cursor-pointer">
          <Image />
        </span>
      </label>
    </>
  );
}
