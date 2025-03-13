import { useTitle } from "../../hooks/useTitle";
import PostList from "../areas/home/Post/PostList";
import RightSideBar from "../areas/home/RightSideBar";

export default function Home(): JSX.Element {
  useTitle("Friendify");

  return (
    <section className="bg-gray-100 dark:bg-dark-main border-l border-r min-h-screen">
      <div className="w-full flex flex-col lg:flex-row">
        <main className="w-full pt-32 lg:pt-16 px-4 lg:px-20">
          <PostList />
        </main>
        <aside className="h-auto lg:w-2/5 xl:w-1/4 sticky top-0 hidden lg:block bg-gray-100 dark:bg-dark-main border-l-2 dark:border-white p-6 lg:p-10">
          <RightSideBar />
        </aside>
      </div>
    </section>
  );
}
