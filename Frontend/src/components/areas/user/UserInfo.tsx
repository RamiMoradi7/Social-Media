import { User } from "../../../models/User";
import { dateFormat } from "../../../utilities/DateFormat";
import LocationSvg from "../../common/svgs/Location";

type UserInfoProps = {
  user: User;
};

export default function UserInfo({ user }: UserInfoProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-dark-third  shadow rounded-lg p-10">
      <div className="flex justify-center items-center gap-2 my-3">
        <div className="font-semibold text-center mx-4">
          <p className="dark:text-dark-txt">{user?.posts?.length}</p>
          <span className="dark:text-dark-txt">Posts</span>
        </div>
        <div className="font-semibold text-center mx-4">
          <p className="dark:text-dark-txt">{user?.friends?.length}</p>
          <span className="dark:text-dark-txt">Friends</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-center items-center">
        <LocationSvg />
        <div className="text-sm leading-normal dark:text-dark-txt flex justify-center items-center">
          {user?.address?.country} {user?.address?.state}, {user?.address?.city}
        </div>
        <div className="font-semibold text-center mx-4">
          <p className="dark:text-dark-txt text-sm mt-4">
            Born at {dateFormat(user?.birthday)}
          </p>
        </div>
      </div>
    </div>
  );
}
