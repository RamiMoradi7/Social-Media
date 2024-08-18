import { User } from "../../../../models/User";
import { DateInput } from "../../../common/inputs/DatePicker";
import StringInput from "../../../common/inputs/StringInput";
import AddressSelectForm from "../AddressSelectForm";
import NotificationsInput from "../inputs/NotificationsInput";

type FormFieldsProps = {
    user: User
    notificationsEnabled: boolean
}

export default function FormFields({ user, notificationsEnabled }: FormFieldsProps): JSX.Element {
    return (
        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-3">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-4 lg:grid-cols-4">
                    <div className="md:col-span-3">
                        <label htmlFor="firstName">First Name</label>
                        <StringInput
                            className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                            name="firstName"
                            placeholder={user?.firstName}
                            registerName="firstName"
                            type="text"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="lastName">Last Name</label>
                        <StringInput
                            className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                            name="lastName"
                            placeholder={user?.lastName}
                            registerName="lastName"
                            type="text"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label htmlFor="email">Email Address</label>
                        <StringInput
                            name="email"
                            placeholder={user?.email}
                            type="email"
                            registerName="email"
                            className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        />
                    </div>
                    <div className="md:col-span-2 mt-1">
                        <label>Birthday</label>
                        <DateInput
                            registerName="birthday"
                            defaultValue={user?.birthday}
                        />
                    </div>
                    <AddressSelectForm
                        defaultValues={{
                            country: user?.address?.country,
                            state: user?.address?.state,
                            city: user?.address?.city,
                        }}
                    />
                    <div className="md:col-span-1">
                        <NotificationsInput notificationsEnabled={notificationsEnabled} />
                    </div>

                    <div className="md:col-span-5 text-right">
                        <div className="inline-flex items-end">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}