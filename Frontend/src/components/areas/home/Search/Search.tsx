import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedSearch } from "../../../../hooks/useDebouncedSearch";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import RecentSearches from "./RecentSearches";
import SearchInput from "./SearchInput";
import SearchbarResults from "./SearchbarResults";

export default function Search(): JSX.Element {
  const { searchValue, searchResults, handleSearchChange, resetSearch } =
    useDebouncedSearch();

  const [localSearchValues, setLocalSearchValues, removeItemFromStorage] =
    useLocalStorage<string[]>("searchValues", []);

  const [isRecentSearchesVisible, setIsRecentSearchesVisible] = useState(false);
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    resetSearch();
    navigate(`/user-profile/${userId}`);
  };

  const handleSearchNavigate = (query: string) => {
    setLocalSearchValues((prevSearchValues) => {
      if (!prevSearchValues.includes(query)) {
        return [...prevSearchValues, query];
      }
      return prevSearchValues;
    });
    resetSearch();
    navigate(`/search/people?q=${query}`);
  };

  return (
    <div className="relative w-52">
      <SearchInput
        value={searchValue}
        handleSearchValue={handleSearchChange}
        setIsOpen={setIsRecentSearchesVisible}
      />
      {isRecentSearchesVisible && (
        <RecentSearches
          localSearchValues={localSearchValues}
          handleSearchNavigate={handleSearchNavigate}
          removeItemFromStorage={removeItemFromStorage}
        />
      )}
      {searchValue && (
        <SearchbarResults
          searchResults={searchResults}
          searchValue={searchValue}
          handleUserClick={handleUserClick}
          handleSearchNavigate={handleSearchNavigate}
        />
      )}
    </div>
  );
}
