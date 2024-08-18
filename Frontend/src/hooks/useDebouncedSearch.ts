import _ from "lodash";
import { ChangeEvent, useState } from "react";
import { useCurrentUser } from "../context/UserContext";
import { User } from "../models/User";
import { usersService } from "../services/UsersService";

export const useDebouncedSearch = () => {
  const { user } = useCurrentUser();
  const [searchValue, setSearchValue] = useState<string>("");

  const [searchResults, setSearchResults] = useState<Partial<User>[]>([]);

  const deduplicateResults = (results: Partial<User>[]) => {
    const existingIds = new Set<string>();
    return results.filter((result) => {
      if (existingIds.has(result._id)) return false;
      existingIds.add(result._id);
      return true;
    });
  };

  const fetchResults = _.debounce(async (value: string) => {
    if (user?.friends && value.trim() !== "") {
      try {
        const filteredFriends = user.friends.filter((friend) => {
          `${friend.firstName} ${friend.lastName}`
            .toLowerCase()
            .includes(value.toLowerCase());
        });
        const users = await usersService.getUsers({ name: value });
        const results = deduplicateResults([
          ...filteredFriends,
          ...(users || []),
        ]);
        setSearchResults(results);
      } catch (err: any) {
        console.error(err);
      }
    }
  }, 400);

  const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValue(value);
    fetchResults(value);
  };

  const resetSearch = () => {
    setSearchValue("");
    setSearchResults([]);
  };

  return { searchValue, handleSearchChange, searchResults, resetSearch };
};
