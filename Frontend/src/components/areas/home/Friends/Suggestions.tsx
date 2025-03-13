import { useFetch } from "../../../../hooks/useFetch";
import { useTitle } from "../../../../hooks/useTitle";
import { useCurrentUser } from "../../../../redux/Selectors";
import { UserFilters, usersService } from "../../../../services/UsersService";
import Loader from "../../../common/loader/Loader";
import Suggestion from "./Suggestion";

export default function Suggestions(): JSX.Element {
    useTitle("Suggestions");
    const user = useCurrentUser();
    const filters: UserFilters = {
        location: user.address?.country,
        currentUserId: user?._id
    }

    const { data: users, isLoading } = useFetch(() => usersService.getUsers(filters), filters.location);
    console.log(users)
    return (
        <div className="container mx-auto px-4 py-8">
            {isLoading && <Loader />}
            {!isLoading && users?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <Suggestion key={user._id} user={user} />
                    ))}
                </div>
            ) : (
                !isLoading && <div>No users found</div>
            )}
        </div>
    );
}
