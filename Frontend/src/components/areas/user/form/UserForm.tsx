import { useEffect } from "react";
import {
    FieldValues,
    FormProvider,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { useCurrentUser } from "../../../../context/UserContext";
import { User } from "../../../../models/User";
import { usersService } from "../../../../services/UsersService";
import { notify } from "../../../../utilities/Notify";
import FormFields from "./FormFields";


type UserFormProps = {
    toggleModal?: () => void;
};

export default function UserForm({ toggleModal }: UserFormProps): JSX.Element {
    const methods = useForm();
    const { setValue, reset, watch } = methods;
    const { user } = useCurrentUser();

    useEffect(() => {
        if (user) {
            Object.entries(user).forEach(([key, value]) => {
                setValue(key, value);
            });
        }
    }, [user, setValue]);

    const editUser: SubmitHandler<User> = async (updatedUser: User) => {
        try {
            await usersService.updateUser({
                userId: user._id,
                userFields: {
                    ...updatedUser,
                },
            });
            reset();
            if (toggleModal) {
                toggleModal();
            }
        } catch (err: any) {
            notify.error(err);
        }
    };

    const notificationsEnabled = watch("notificationsEnabled")

    return (
        <div className="min-h-screen bg-white py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 lg:max-w-3xl lg:max-h-screen sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-200 border-black shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-full mx-auto">
                        <p className="text-gray-500 mb-6">
                            {user?.firstName}, here's your information.
                        </p>
                        <FormProvider {...methods}>
                            <form
                                onSubmit={methods.handleSubmit(
                                    editUser as SubmitHandler<FieldValues>
                                )}
                                className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6"
                            >
                                <FormFields user={user} notificationsEnabled={notificationsEnabled} />
                            </form>
                        </FormProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}
