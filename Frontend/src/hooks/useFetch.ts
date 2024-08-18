import { useCallback, useEffect, useState } from "react";
import { notify } from "../utilities/Notify";

export type FetchResponse<T> = {
  data: T | null;
  isLoading: boolean;
  setData: React.Dispatch<React.SetStateAction<T>>;
};

export const useFetch = <T>(
  fnQuery: (_id?: string) => Promise<T>,
  _id?: string
): FetchResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    (id?: string) => {
      setIsLoading(true);
      fnQuery(id)
        .then((data) => setData(data))
        .catch((err: any) => notify.error(err))
        .finally(() => setIsLoading(false));
    },
    [fnQuery]
  );

  useEffect(() => {
    fetchData();
  }, [_id]);

  return { data, isLoading, setData };
};
