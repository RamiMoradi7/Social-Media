import { dateFormat } from "../../../../utilities/DateFormat";

type PostMetaProps = {
  privacy: string;
  postedAt: Date;
};

export default function PostMeta({ postedAt, privacy }: PostMetaProps) {
  return (
    <div className="flex w-full justify-center mt-1 pb-2">
      <div className="text-blue-700 font-bold text-md mr-2">{privacy}</div>
      <div className="dark:text-dark-tx font-thin text-md">
        {dateFormat(postedAt)}
      </div>
    </div>
  );
}
