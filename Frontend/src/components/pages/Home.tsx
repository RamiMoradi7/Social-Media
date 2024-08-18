import { useMenuContext } from "../../context/MenuContext";
import { useTitle } from "../../hooks/useTitle";
import LeftSideBar from "../areas/home/LeftSideBar";
import PostList from "../areas/home/Post/PostList";
import RightSideBar from "../areas/home/RightSideBar";
import Drawer from "../areas/layout/Menu/Drawer";

export default function Home(): JSX.Element {
    useTitle("Friendify");
    const { isOpen, toggleOpen } = useMenuContext();

    return (
        <section className="bg-gray-100 dark:bg-dark-main border-l border-r">
            <div className="w-full flex lg:flex-row">
                <aside className="h-screen hidden lg:w-1/5 sticky top-0 xl:flex bg-gray-100 dark:bg-dark-main  md:block">
                    <LeftSideBar />
                </aside>
                <main className="w-full lg:w-2/3 xl:w-3/5 pt-32 lg:pt-16 px-2">
                    <PostList />
                </main>
                <aside className="h-screen lg:w-1/5 sticky top-0 xl:flex bg-gray-100 dark:bg-dark-main hidden md:block">
                    <RightSideBar />
                </aside>
            </div>
            {isOpen === "menu" && <Drawer open={isOpen} toggleMenu={toggleOpen} element={<RightSideBar toggleOpen={toggleOpen} />} />}
        </section>
    );
}
