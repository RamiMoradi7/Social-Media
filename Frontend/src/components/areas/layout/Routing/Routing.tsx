import { Navigate, Route, Routes } from "react-router-dom";
import { useSockets } from "../../../../hooks/useSockets";
import { usersService } from "../../../../services/UsersService";
import { notify } from "../../../../utilities/Notify";
import Home from "../../../pages/Home";
import UserDetails from "../../../pages/UserProfile";

import Page404 from "../../../pages/Page404";
import PostDetails from "../../../pages/PostDetails";
import SearchResults from "../../../pages/SearchResults";
import Friends from "../../home/Friends/Friends";
import UserForm from "../../user/form/UserForm";

function Routing(): JSX.Element {
    const { notificationsEnabled, _id } = useSockets();

    const handleEnableNotifications = async () => {
        try {
            await usersService.updateUser({
                userId: _id,
                userFields: {
                    notificationsEnabled: true,
                },
            });
        } catch (error) {
            notify.error(error);
        }
    };

    const routes = [
        {
            path: "/home",
            element: <Home />,
        },
        { path: "/user-profile/:_id", element: <UserDetails /> },
        { path: "/post/:postId", element: <PostDetails /> },
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/friends",
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

    return (
        <div>
            <Routes>
                {routes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
            </Routes>
            {!notificationsEnabled && (
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
            )}
        </div>
    );
}

export default Routing;
