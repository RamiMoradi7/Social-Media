import React from "react";
import { NavLink } from "react-router-dom";

export default function PostContent({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) {
  return (
    <NavLink to={`/post/${postId}`}>
      <div className="text-gray-400 dark:text-dark-txt text-lg mb-6 mx-3 px-2">
        {content}
      </div>
    </NavLink>
  );
}
