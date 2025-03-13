export const ErrMsg = () => {
    return (
        <p className="flex items-center justify-between bg-red-500 text-white p-4 rounded-lg shadow-lg">
            <span className="mr-2">Oops! Something went wrong.</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12" />
            </svg>
        </p>)
}