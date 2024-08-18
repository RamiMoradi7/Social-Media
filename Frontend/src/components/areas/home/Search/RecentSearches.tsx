type RecentSearchesProps = {
  localSearchValues: string[];
  handleSearchNavigate: (query: string) => void;
  removeItemFromStorage: (itemToRemove: string) => void;
};

export default function RecentSearches({
  localSearchValues,
  handleSearchNavigate,
  removeItemFromStorage,
}: RecentSearchesProps): JSX.Element {
  return (
    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-third border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto transition-transform duration-300 ease-in-out">
      <div className="p-4 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-third rounded-t-md">
        <h3 className="text-lg font-semibold dark:text-dark-txt">
          Recent Searches
        </h3>
      </div>
      <ul className="py-2">
        {localSearchValues?.map((value) => (
          <li
            key={value}
            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-third"
          >
            <i className="bx bx-history dark:text-dark-txt mr-3"></i>
            <span
              className="flex-1 dark:text-dark-txt"
              onClick={() => handleSearchNavigate(value)}
            >
              {value}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeItemFromStorage(value);
              }}
              className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
