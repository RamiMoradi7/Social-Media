import React from "react";

type ConfirmationPopupProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-gray-800 bg-opacity-50 flex items-center justify-center w-full h-full">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              className="w-12 h-12 text-gray-600 fill-black mx-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 1C4.477 1 0 5.477 0 11s4.477 10 10 10 10-4.477 10-10S15.523 1 10 1zm-1.293 13.707a.999.999 0 01-1.414-1.414l4-4a.999.999 0 011.414 0l7 7a.999.999 0 11-1.414 1.414l-6.293-6.293-3.293 3.293z"
              />
            </svg>
            <h2 className="text-xl font-bold py-4 text-gray-700">
              Are you sure?
            </h2>
            <p className="font-bold text-sm text-gray-500 px-2">{message}</p>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={onCancel}
              className="bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-green-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-green-500 hover:border-green-500 text-white hover:text-green-500 rounded-full hover:bg-transparent transition ease-in duration-300"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
