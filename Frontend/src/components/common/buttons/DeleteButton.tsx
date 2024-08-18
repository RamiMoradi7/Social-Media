import { useState } from "react";
import { notify } from "../../../utilities/Notify";
import "./DeleteButton.css";
import ConfirmationPopup from "../ConfirmationPopup";

type DeleteButtonProps = {
  targetId: string;
  fnQuery: (targetId: string, userId?: string) => Promise<void>;
};

export default function DeleteButton({
  targetId,
  fnQuery,
}: DeleteButtonProps): JSX.Element {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      await fnQuery(targetId);
      setShowConfirmation(false);
    } catch (err: any) {
      notify.error(err);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button className="btn bg-white dark:bg-dark-second dark:text-dark-txt" onClick={() => setShowConfirmation(true)}>
        <p className="paragraph"> delete </p>
        <span className="icon-wrapper bg-white dark:bg-dark-second dark:text-dark-txt">
          <svg
            className="icon"
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </span>
      </button>

      {showConfirmation && (
        <ConfirmationPopup
          message={`Your'e about to delete ${targetId}`}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
