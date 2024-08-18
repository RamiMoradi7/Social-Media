import { useNavigate } from "react-router-dom";

export type SelectedFilterType =  "posts" | "people" | "photos";

type SearchMenuFilterProps = {
  query: string;
  selectedFilter: SelectedFilterType;
  setSelectedFilter: (type: SelectedFilterType) => void;
};

export default function SearchMenuFilter({
  query,
  selectedFilter,
  setSelectedFilter,
}: SearchMenuFilterProps): JSX.Element {
  const navigate = useNavigate();
  
  const handleFilterChange = (type: SelectedFilterType) => {
    setSelectedFilter(type);
    navigate(`/search/${type}?q=${query}`);
  };

  return (
    <div className="mt-28 lg:mt-6 md:mt-6 py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-lg shadow-md">
      <div className="text-center mb-4 text-white">
        <p className="text-lg font-medium">Searching for:</p>
        <h1 className="text-3xl font-extrabold mt-1">"{query}"</h1>
      </div>
      <div className="flex flex-wrap justify-center gap-2 md:gap-6">
        {["people", "posts", "photos"].map((type) => (
          <label
            key={type}
            htmlFor={type}
            className={`relative flex flex-col items-center justify-center w-16 h-16 p-1 border rounded-lg shadow-lg transition-transform duration-300 ease-in-out cursor-pointer transform hover:scale-105 ${
              selectedFilter === type
                ? "bg-white border-blue-500 text-blue-600"
                : "bg-gray-100 border-gray-300 text-gray-700"
            }`}
            onClick={() => handleFilterChange(type as SelectedFilterType)}
          >
            <input
              className="hidden"
              type="radio"
              name="filter"
              id={type}
              checked={selectedFilter === type}
              onChange={() => handleFilterChange(type as SelectedFilterType)}
            />
            <svg
              className={`w-12 h-12 mb-2 transition-transform duration-300 ease-in-out ${
                selectedFilter === type
                  ? "text-blue-600 transform scale-125"
                  : "text-gray-500"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              {type === "people" && (
                <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z" />
              )}
              {type === "posts" && (
                <>
                  <path d="M5 18v3.766l1.515-.909L11.277 18H16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h1zM4 8h12v8h-5.277L7 18.234V16H4V8z" />
                  <path d="M20 2H8c-1.103 0-2 .897-2 2h12c1.103 0 2 .897 2 2v8c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z" />
                </>
              )}
              {type === "photos" && (
                <>
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </>
              )}
            </svg>
            <span
              className={`text-sm font-medium ${
                selectedFilter === type ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
