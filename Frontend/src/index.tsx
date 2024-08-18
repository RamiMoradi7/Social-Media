import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/areas/layout/Layout/Layout";
import { UserProvider } from "./context/UserContext";
import "./index.css";
import { store } from "./redux/Store";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <UserProvider>
        <Layout />
      </UserProvider>
    </Provider>
  </BrowserRouter>
);

reportWebVitals();
