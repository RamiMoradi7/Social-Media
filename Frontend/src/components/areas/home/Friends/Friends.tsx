import { useCurrentUser } from "../../../../redux/Selectors";
import FriendRequests from "../../user/FriendRequests";
import Suggestions from "./Suggestions";


export default function Friends(): JSX.Element {
    const user = useCurrentUser();

    return (
        <div className="flex flex-col items-center p-4 mt-24 md:mt-8 lg:mt-4 dark:bg-dark:third min-h-screen">
            <div className="flex flex-col md:flex-row gap-4 lg:gap-8 max-w-6xl w-full">
                <div className="flex-1  shadow-lg rounded-lg p-6 dark:bg-dark-second">
                    <h2 className="text-xl font-semibold mb-4 dark:text-dark-txt">Requests</h2>
                    <FriendRequests
                        friendRequests={user?.friendRequests}
                        receiverUserId={user?._id}
                    />
                </div>
                <div className="flex-3 dark:bg-dark-second shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 dark:text-dark-txt">People You May Know</h2>
                    <Suggestions />
                </div>
            </div>
        </div>
    );
}
