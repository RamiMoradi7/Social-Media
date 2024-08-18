type EditButtonProps = {
  onClick: () => void;
};

export default function EditButton({ onClick }: EditButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer text-zinc-900 font-semibold tracking-widest rounded-md shadow-lg hover:bg-blue-300 transition-all duration-300 transform hover:scale-105"
    >
      <span>Edit</span>
      <svg
        className="h-6 w-6"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    </button>
  );
}
