import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";
import { Credentials } from "../../models/Credentials";
import StringInput from "../common/inputs/StringInput";
import { authService } from "../../services/AuthService";
import { store } from "../../redux/Store";
import { notify } from "../../utilities/Notify";

export default function Login(): JSX.Element {
  useTitle("Login");
  const methods = useForm<Credentials>();
  const navigate = useNavigate();

  const login = async (credentials: Credentials) => {
    try {
      await authService.login(credentials);
      const firstName = store.getState().user?.firstName;
      notify.success(`Welcome back ${firstName} :)`);
      navigate("/");
    } catch (err: any) {
      notify.error(err);
    }
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-12 mx-auto flex flex-wrap items-center justify-center">
        <div className="w-full lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-bold text-5xl lg:text-7xl text-blue-600 text-center mb-4">
            friendify
          </h1>
          <p className="title-font font-bold text-2xl lg:text-3xl text-zinc-600 text-center mb-4">
            Friendify helps you connect and share with the people in your life.
          </p>
        </div>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(login)}
            className="w-full lg:w-2/5 md:w-1/2 bg-white shadow-lg rounded-lg p-8 flex flex-col items-center md:ml-auto mt-8 md:mt-0"
          >
            <div className="relative mb-6 w-full">
              <StringInput
                type="text"
                name="email"
                placeholder="Email address"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg outline-none text-gray-700 py-3 px-4 leading-8 transition-colors duration-200 ease-in-out"
                registerName="email"
              />
            </div>
            <div className="relative mb-6 w-full">
              <StringInput
                type="password"
                name="password"
                placeholder="Password"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-lg text-gray-700 py-3 px-4 leading-8 transition-colors duration-200 ease-in-out"
                registerName="password"
              />
            </div>
            <button className="text-white border-0 py-3 px-8 focus:outline-none font-medium rounded text-lg bg-blue-600 hover:bg-blue-700 mt-4 w-full">
              Log In
            </button>
            <p className="text-sm text-blue-500 py-3 text-center">
              Forgotten password?
            </p>
            <hr className="my-5 w-full" />
            <button
              onClick={() => navigate("/register")}
              className="text-white border-0 py-3 px-8 focus:outline-none font-medium rounded text-lg bg-green-500 hover:bg-green-600 w-full"
            >
              Create New Account
            </button>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
