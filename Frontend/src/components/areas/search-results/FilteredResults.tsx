import { SearchState } from "../../../hooks/useSearchResults";
import { PostCard } from "../home/Post/Post";
import PhotosSection from "./PhotosSection";
import { SelectedFilterType } from "./SearchMenuFilter";
import UsersSection from "./UsersSection";

type FilteredResultsProps = {
  searchResults: SearchState;
  selectedFilter: SelectedFilterType;
};

export default function FilteredResults({
  searchResults,
  selectedFilter,
}: FilteredResultsProps): JSX.Element {
  const renderSection = (title: string, content: React.ReactNode) => (
    <section className="mb-8">
      <h2 className="text-3xl font-thin mb-4 text-gray-800 dark:text-dark-txt">
        {title}
      </h2>
      {content}
    </section>
  );

  const renderNoResultsMsg = (value: string) => (
    <div className="p-6 text-center text-lg font-medium text-gray-600 dark:text-gray-300">
      <p>No {value} found.</p>
    </div>
  );

  const { users, posts, photos } = searchResults;
  const hasUsers = users && users.length > 0;
  const hasPosts = posts && posts.length > 0;
  const hasPhotos = photos && photos.length > 0;

  const peopleContent = hasUsers ? (
    <UsersSection users={users} />
  ) : (
    renderNoResultsMsg("people")
  );

  const postsContent = hasPosts
    ? posts.map((post) => <PostCard post={post} key={post._id} />)
    : renderNoResultsMsg("posts");

  const photosContent = hasPhotos ? (
    <PhotosSection photos={photos} />
  ) : (
    renderNoResultsMsg("photos")
  );

  const getResultsSection = (filter: SelectedFilterType) => {
    switch (filter) {
      case "people":
        return renderSection("People", peopleContent);
      case "posts":
        return renderSection("Posts", postsContent);
      case "photos":
        return renderSection("Photos", photosContent);

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {getResultsSection(selectedFilter)}
    </div>
  );
}
