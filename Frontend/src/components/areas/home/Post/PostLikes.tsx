import React from "react";
import Favorites from "../../../common/svgs/Favorites";
import { NavLink } from "react-router-dom";
import { User } from "../../../../models/User";

function PostLikes({ likes }: { likes: User[] }) {
  return (
    <div className="flex w-full mt-1 pt-2 pl-5">
      <span className="bg-white transition ease-out duration-300 hover:text-red-500 border w-8 h-8 px-2 pt-2 text-center rounded-full text-gray-400 cursor-pointer mr-2">
        <Favorites />
      </span>
      {likes?.map((like) => (
        <NavLink
          key={like._id}
          to={`/user-profile/${like._id}`}
        >
          <img
            className="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
            src={like?.photos?.profilePhoto}
            alt=""
          />
        </NavLink>
      ))}
    </div>
  );
}

export default PostLikes;
