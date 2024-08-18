import { User } from "../../../../models/User";
import defaultAvatar from "../../../../assets/images/default-profile-pic.jpg";

type SearchResultsProps = {
  searchResults: Partial<User>[];
  searchValue: string;
  handleUserClick: (userId: string) => void;
  handleSearchNavigate: (searchValue: string) => void;
};

export default function SearchbarResults({
  searchResults,
  searchValue,
  handleUserClick,
  handleSearchNavigate,
}: SearchResultsProps): JSX.Element {
  return (
    <ul className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-third border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
      {searchResults ? (
        searchResults.map((friend) => (
          <li
            key={friend._id}
            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-third"
            onClick={() => {
              handleUserClick(friend._id);
            }}
          >
            <img
              src={friend.photos?.profilePhoto || defaultAvatar}
              alt={`${friend.firstName} ${friend.lastName}`}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-dark-txt">
                {`${friend.firstName} ${friend.lastName}`}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {friend.email}
              </p>
            </div>
          </li>
        ))
      ) : (
        <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
          No users found.
        </li>
      )}
      <li
        className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-third"
        onClick={() => handleSearchNavigate(searchValue)}
      >
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 dark:text-dark-txt">
            Search for "{searchValue}"
          </p>
        </div>
      </li>
    </ul>
  );
}
