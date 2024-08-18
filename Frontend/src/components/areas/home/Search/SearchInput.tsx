import { ChangeEvent } from "react";

type SearchInputProps = {
  value: string;
  handleSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  setIsOpen?: (isOpen: boolean) => void;
};

export default function SearchInput({
  value,
  setIsOpen,
  handleSearchValue,
}: SearchInputProps): JSX.Element {
  return (
    <div className="relative flex items-center bg-white dark:bg-dark-third shadow-lg rounded-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <i className="bx bx-search"></i>
      </div>
      <input
        type="text"
        className="w-full py-1 pl-12 pr-4 text-lg text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
        value={value}
        onChange={handleSearchValue}
        placeholder="Search Friends..."
        onClick={() => setIsOpen(true)}
        onKeyUp={() => setIsOpen(false)}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 100);
        }}
      />
    </div>
  );
}
