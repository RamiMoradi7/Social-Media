import toast from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSockets } from "../../../../hooks/useSockets";
import { useCurrentUser } from "../../../../redux/Selectors";
import { usersService } from "../../../../services/UsersService";
import Home from "../../../pages/Home";
import Page404 from "../../../pages/Page404";
import PostDetails from "../../../pages/PostDetails";
import SearchResults from "../../../pages/SearchResults";
import UserProfile from "../../../pages/UserProfile";
import Friends from "../../home/Friends/Friends";
import UserForm from "../../user/form/UserForm";

function Routing(): JSX.Element {
    const user = useCurrentUser();
    const { _id: userId, notificationsEnabled } = user
    useSockets()

    const handleEnableNotifications = async () => {
        try {
            await usersService.updateUser({
                userId,
                userFields: {
                    notificationsEnabled: true,
                },
            });
        } catch (error) {
            toast.error("Oops! Something went wrong. Please try again.")
        }
    };

    const routes = [
        {
            path: "/home",
            element: <Home />,
        },
        {
            path: "/user-profile/:_id", element:
                <UserProfile />
        },
        { path: "/post/:postId", element: <PostDetails /> },
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/suggestions",
            element: <Friends />,
        },
        {
            path: "/user/settings",
            element: <UserForm />,
        },
        {
            path: "/search/:type",
            element: <SearchResults />,
        },
        {
            path: "/login",
            element: <Navigate to="/" />,
        },
        {
            path: "/register",
            element: <Navigate to="/" />,
        },
        {
            path: "*",
            element: <Page404 />,
        },
    ];
    if (userId && !notificationsEnabled) {
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 max-w-sm w-full text-center">
            <p className="text-gray-700 mb-2">
                Enable sound notifications for new messages?
            </p>
            <button
                onClick={handleEnableNotifications}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full transition duration-300 hover:bg-blue-600"
            >
                Enable Notifications
            </button>
        </div>
    }

    return (
        <main className="flex-1 dark:bg-dark-third bg-white md:p-4 lg:p-2 mt-12">
            <Routes>
                {routes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
            </Routes>
        </main>
    );
}

export default Routing;
