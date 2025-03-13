import { SearchState, Status } from "../../../hooks/useSearchResults";
import { PostCard } from "../home/Post/Post";
import PhotosSection from "./PhotosSection";
import { FilterTypes } from "./SearchMenuFilter";
import UsersSection from "./UsersSection";

type FilteredResultsProps = {
    searchResults: SearchState;
    selectedFilter: FilterTypes;
    status: Status
};

export default function FilteredResults({
    searchResults,
    selectedFilter,
    status,
}: FilteredResultsProps): JSX.Element {
    const renderSection = (title: string, content: React.ReactNode) => (
        <section className="mb-8">
            <h2 className="text-3xl font-thin mb-4 text-gray-800 dark:text-dark-txt">
                {title}
            </h2>
            {content}
        </section>
    );

    const renderNoResultsMsg = (value: string) => {
        if (status !== "loading") {
            return <div className="p-6 text-center text-lg font-medium text-gray-600 dark:text-gray-300">
                <p>No {value} found.</p>
            </div>
        }
    };

    const { users, posts, photos } = searchResults;

    const getResultsSection = (filter: FilterTypes) => {
        switch (filter) {
            case FilterTypes.PEOPLE:
                return renderSection(
                    FilterTypes.PEOPLE,
                    users && users.length > 0 ? (
                        <UsersSection users={users} />
                    ) : (
                        renderNoResultsMsg(FilterTypes.PEOPLE)
                    )
                );
            case FilterTypes.POSTS:
                return renderSection(
                    FilterTypes.POSTS,
                    posts && posts.length > 0 ? (
                        posts.map((post) => <PostCard post={post} key={post._id} />)
                    ) : (
                        renderNoResultsMsg(FilterTypes.POSTS)
                    )
                );
            case FilterTypes.PHOTOS:
                return renderSection(
                    FilterTypes.PHOTOS,
                    photos && photos.length > 0 ? (
                        <PhotosSection photos={photos} />
                    ) : (
                        renderNoResultsMsg("photos")
                    )
                );
            default:
                return null;
        }
    };

    return <div className="container mx-auto px-4 py-6">{getResultsSection(selectedFilter)}</div>;
}
