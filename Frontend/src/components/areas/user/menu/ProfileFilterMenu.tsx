export type FilterOption = "posts" | "about" | "photos" | "friends";

type ProfileFilterMenuProps = {
    selectedFilter: FilterOption;
    setSelectedFilter: (selectedFilter: FilterOption) => void;
};

export default function ProfileFilterMenu({
    selectedFilter,
    setSelectedFilter,
}: ProfileFilterMenuProps): JSX.Element {
    const filterOptions: FilterOption[] = ["posts", "photos", "about", "friends"];
    return (
        <>
            <div className="flex justify-center mb-6">
                <div className="flex border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                    {filterOptions.map((option) => (
                        <Button
                            key={option}
                            filterOption={option}
                            isActive={selectedFilter === option}
                            onClick={setSelectedFilter}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
type ButtonProps = {
    filterOption: FilterOption;
    isActive: boolean;
    onClick: (filterOption: FilterOption) => void;
};

function Button({ filterOption, isActive, onClick }: ButtonProps) {
    return (
        <button
            className={`px-6 py-2 font-thin transition-colors duration-200 ease-in-out ${isActive
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:text-dark-txt dark:bg-dark-third hover:bg-gray-400 "
                }`}
            onClick={() => onClick(filterOption)}
        >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
        </button>
    );
}
