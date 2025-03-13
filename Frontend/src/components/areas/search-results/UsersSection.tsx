import { useNavigate } from "react-router-dom";
import { User } from "../../../models/User";
import Suggestion from "../home/Friends/Suggestion";

type UserListProps = {
    users: User[];
};

export default function UsersSection({ users }: UserListProps): JSX.Element {
    const navigate = useNavigate();
    return (
        <div className="space-y-4">
            {users?.map((user) => (
                <div
                    key={user?._id}
                    className="relative max-w-sm mx-auto bg-white dark:bg-dark-second w-full shadow-sm rounded-lg overflow-hidden"
                >
                    <div className="flex justify-center mt-4 mb-4">
                        <Suggestion user={user} key={user?._id} />
                    </div>

                    <div className="px-4 py-3">
                        <button
                            className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 w-full"
                            onClick={() => navigate(`/user-profile/${user?._id}`)}
                        >
                            Go to Profile
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
