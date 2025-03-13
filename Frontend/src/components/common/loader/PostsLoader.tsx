export default function PostsLoader(): JSX.Element {
    return (
      <div className="bg-white mt-4 p-2 sm:p-4 sm:h-64 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-5 select-none transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
        <div className="h-52 sm:h-full sm:w-72 rounded-xl bg-gray-200 animate-pulse transition-all duration-500"></div>
  
        <div className="text-lg font-semibold text-gray-600 animate-pulse transition-opacity duration-500 opacity-80 sm:mt-0 mt-4 sm:ml-4">
          Loading...
        </div>
        <div className="flex flex-col flex-1 gap-5 sm:p-2">
          <div className="flex flex-1 flex-col gap-3">
            <div className="bg-gray-200 w-full animate-pulse h-14 rounded-2xl transition-all duration-500"></div>
            <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl transition-all duration-500"></div>
            <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl transition-all duration-500"></div>
            <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl transition-all duration-500"></div>
            <div className="bg-gray-200 w-full animate-pulse h-3 rounded-2xl transition-all duration-500"></div>
          </div>
  
          <div className="mt-auto flex gap-3">
            <div className="bg-gray-200 w-20 h-8 animate-pulse rounded-full transition-all duration-500"></div>
            <div className="bg-gray-200 w-20 h-8 animate-pulse rounded-full transition-all duration-500"></div>
            <div className="bg-gray-200 w-20 h-8 animate-pulse rounded-full ml-auto transition-all duration-500"></div>
          </div>
        </div>
      </div>
    );
  }
  