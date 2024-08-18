import { useCurrentUser } from "../../../../context/UserContext";
import { useFetch } from "../../../../hooks/useFetch";
import { UserFilters, usersService } from "../../../../services/UsersService";
import Loader from "../../../common/loader/Loader";
import UsersSection from "../../search-results/UsersSection";

export default function Suggestions(): JSX.Element {
    const { user } = useCurrentUser();
    const filters: UserFilters = {
        location: user.address?.country,
        currentUserId: user?._id
    }

    const { data: users, isLoading } = useFetch(() => usersService.getUsers(filters), filters.location);
    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && <UsersSection users={users || []} />}
            {!isLoading && users?.length === 0 && <div>No users found</div>}
        </>
    );
}
