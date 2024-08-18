import { useFormContext } from "react-hook-form"
type NotificationsInputProps = {
    notificationsEnabled?: boolean
}


export default function NotificationsInput({ notificationsEnabled }: NotificationsInputProps): JSX.Element {
    const { register } = useFormContext()

    return <>
        <label htmlFor="notificationsEnabled" className="flex items-center space-x-3">
            <span className="text-gray-700">Notifications</span>
            <div className="relative">
                <input
                    id="notificationsEnabled"
                    type="checkbox"
                    {...register("notificationsEnabled")}
                    className="sr-only"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                <div
                    className={`absolute top-0 left-0 w-6 h-6 bg-blue-500 rounded-full shadow transition-transform transform ${notificationsEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                ></div>
            </div>
        </label>
    </>
}