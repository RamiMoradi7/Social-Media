import { NavLink } from "react-router-dom";

type UserProfileLinkProps = {
  userId: string;
  profilePhotoUrl: string;
  firstName: string;
  lastName: string;
};

export default function UserProfileLink({
  userId,
  profilePhotoUrl,
  firstName,
  lastName,
}: UserProfileLinkProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <NavLink to={`/user-profile/${userId}`}>
        <img
          className="w-16 h-16 object-cover rounded-full shadow cursor-pointer"
          alt="User avatar"
          src={profilePhotoUrl}
        />
      </NavLink>
      <NavLink to={`/user-profile/${userId}`}>
        <div className="text-gray-600 dark:text-dark-txt text-md font-bold mt-1">
          {firstName} {lastName}
        </div>
      </NavLink>    
    </div>
  );
}
