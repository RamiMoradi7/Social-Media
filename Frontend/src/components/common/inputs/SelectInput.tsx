import { useFormContext } from "react-hook-form";

type SelectInputProps = {
  options: string[];
  registerName: string;
  className: string;
  defaultOption?: string;
};

export default function SelectInput({
  options,
  registerName,
  className,
  defaultOption,
}: SelectInputProps): JSX.Element {
  const { register } = useFormContext();

  return (
    <select
      defaultValue={""}
      {...register(registerName)}
      className={className}
      required
    >
      <option value={""} disabled>
        {defaultOption}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
