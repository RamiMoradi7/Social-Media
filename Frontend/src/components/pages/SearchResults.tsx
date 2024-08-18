import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchMenuFilter, {
  SelectedFilterType,
} from "../areas/search-results/SearchMenuFilter";
import { useSearchResults } from "../../hooks/useSearchResults";
import Loader from "../common/loader/Loader";
import FilteredResults from "../areas/search-results/FilteredResults";

export default function SearchResults(): JSX.Element {
  const { type } = useParams<{ type: SelectedFilterType }>();
  const { searchResults, query, status } = useSearchResults(type);
  const [selectedFilter, setSelectedFilter] =
    useState<SelectedFilterType>(type);

  useEffect(() => {
    if (type) {
      setSelectedFilter(type);
    }
  }, [type]);

  return (
    <div className="mx-auto max-w-[850px] px-4">
      <SearchMenuFilter
        query={query}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      <div>
        <FilteredResults
          searchResults={searchResults}
          selectedFilter={selectedFilter}
        />
        {status === "loading" && <Loader />}
        {status === "error" && (
          <p className="text-red-500">An error occurred while fetching data.</p>
        )}
      </div>
    </div>
  );
}
