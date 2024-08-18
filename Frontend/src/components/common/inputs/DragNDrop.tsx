import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { PostMediaItem } from "../../../models/Post";

type DragNDropProps = {
  registerName: string;
  existingImageUrls?: PostMediaItem[];
  required?: boolean;
};

async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

const DragNDrop = ({
  registerName,
  existingImageUrls,
  required,
}: DragNDropProps) => {
  const [files, setFiles] = useState<(File | string)[]>([]);
  const { setValue } = useFormContext();

  useEffect(() => {
    const loadExistingImages = async () => {
      if (existingImageUrls) {
        const filesFromUrls = await Promise.all(
          existingImageUrls.map((mediaItem) =>
            urlToFile(mediaItem.imageUrl, `image_${Date.now()}.png`)
          )
        );
        setFiles(filesFromUrls);
        setValue(registerName, filesFromUrls);
      }
    };
    loadExistingImages();
  }, [existingImageUrls]);

  const humanFileSize = (size: number) => {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${
      ["B", "kB", "MB", "GB", "TB"][i]
    }`;
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, idx) => idx !== index);
    setFiles(newFiles);
    setValue(registerName, newFiles);
  };

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setValue(registerName, [...files, ...newFiles]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 border border-gray-200">
        <div className="relative flex flex-col text-gray-600 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:border-blue-500 hover:bg-gray-100 cursor-pointer">
          <input
            accept="*"
            type="file"
            required={required}
            multiple
            className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
            onChange={addFiles}
            onDragOver={(e) => e.preventDefault()}
          />
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="mt-2 text-sm text-gray-500 font-semibold">
              Drag & drop your files here or{" "}
              <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                click to upload
              </span>
              .
            </p>
          </div>
        </div>
        {files.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center bg-white border border-gray-300 rounded-md p-2 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <button
                  className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-bl hover:bg-red-700 focus:outline-none transition-colors duration-200"
                  type="button"
                  onClick={() => removeFile(index)}
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                {typeof file === "string" ? (
                  <img
                    src={file}
                    alt={`Existing Image ${index}`}
                    className="w-full h-auto rounded-md mb-2"
                  />
                ) : (
                  file.type.includes("image/") && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-auto rounded-md mb-2"
                    />
                  )
                )}

                <div className="flex flex-col p-2 text-xs bg-gray-100 rounded-b-md">
                  {typeof file !== "string" && (
                    <span className="text-xs text-gray-600">
                      {humanFileSize(file.size)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DragNDrop;
