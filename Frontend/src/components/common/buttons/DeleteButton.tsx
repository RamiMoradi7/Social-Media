import toast from "react-hot-toast";
import Swal from "sweetalert2";

type TargetType = "Post" | "Comment" | "Reply"

type DeleteButtonProps = {
    fnQuery: (targetId: string, userId?: string) => Promise<void>;
    targetId: string;
    targetType: TargetType

};
export default function DeleteButton({
    targetId,
    fnQuery,
    targetType
}: DeleteButtonProps): JSX.Element {
    const handleConfirmDelete = async () => {
        try {
            const result = await Swal.fire({
                title: `Are you sure you want to delete this ${targetType}?`,
                text: `This action cannot be undone. Please confirm that you'd like to proceed.`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });
            if (result.isConfirmed) {
                await fnQuery(targetId);
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
        } catch (err: any) {
            toast.error(err);
        }
    };

    return (
        <>
            <button
                onClick={handleConfirmDelete}
                className=" bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-2 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
            >
                <svg
                    className="h-8 w-8 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
            </button>
        </>
    );
}


