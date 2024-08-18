import { Route, Routes } from "react-router-dom";
import Login from "../../../pages/Login";
import Register from "../../../pages/Register";

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
    <div>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

export default GuestRouting;
