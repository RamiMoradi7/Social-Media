import { Route, Routes } from "react-router-dom";
import Login from "../../../pages/Login";
import Register from "../../../pages/Register";
import { Toaster } from "react-hot-toast";

function GuestRouting(): JSX.Element {
    const routes = [
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "*",
            element: <Login />,
        },
    ];

    return (
        <main className="flex-1 dark:bg-dark-third bg-white md:p-4 lg:p-2 mt-12">
            <Toaster position="top-right" />
            <Routes>
                {routes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
            </Routes>
        </main>
    );
}

export default GuestRouting;
