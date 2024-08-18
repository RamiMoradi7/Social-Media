import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import registerBackground from "../../assets/images/register-wallpaper.jpg";
import { User } from "../../models/User";
import { authService } from "../../services/AuthService";
import { notify } from "../../utilities/Notify";
import { DateInput } from "../common/inputs/DatePicker";
import SelectInput from "../common/inputs/SelectInput";
import StringInput from "../common/inputs/StringInput";
import ArrowRight from "../common/svgs/ArrowRight";

export default function Register(): JSX.Element {
  const methods = useForm<User>();
  const navigate = useNavigate();

  const register = async (user: User) => {
    try {
      console.log(user);
      await authService.register(user);
      notify.success(`Welcome ${user.firstName}`);
      navigate("/");
    } catch (err: any) {
      notify.error(err);
    }
  };
  return (
    <section className="bg-white">
      <div className="flex justify-center min-h-screen">
        <div
          className="hidden lg:block lg:w-2/5 bg-cover bg-center rounded-l-lg"
          style={{
            backgroundImage: `url(${registerBackground})`,
          }}
        ></div>

        <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
          <div className="w-full">
            <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize">
              Get your free account now.
            </h1>

            <p className="mt-4 text-gray-500">
              Let’s get you all set up so you can verify your personal account
              and begin setting up your profile.
            </p>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(register)}
                className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
              >
                <div>
                  <label className="block mb-2 text-sm text-gray-600">
                    First Name
                  </label>
                  <StringInput
                    name="firstName"
                    registerName="firstName"
                    type="text"
                    placeholder="John"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring-opacity-40"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-600">
                    Last name
                  </label>
                  <StringInput
                    name="lastName"
                    registerName="lastName"
                    type="text"
                    placeholder="Snow"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring-opacity-40"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-600">
                    Email address
                  </label>
                  <StringInput
                    registerName="email"
                    name="email"
                    type="email"
                    placeholder="johnsnow@example.com"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring-opacity-40"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-600">
                    Gender
                  </label>
                  <SelectInput
                    options={["Male", "Female", "Other"]}
                    registerName="gender"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-600">
                    Password
                  </label>
                  <StringInput
                    name="password"
                    registerName="password"
                    type="password"
                    placeholder="Enter your password"
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring-opacity-40"
                  />
                </div>

                <div>
                  <DateInput registerName="birthday" />
                </div>

                <button className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                  <span>Sign Up </span>
                  <ArrowRight />
                </button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
