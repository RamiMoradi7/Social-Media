import { useFormContext } from "react-hook-form";

type StringInputProps = {
  type: "email" | "text" | "password" | "textarea";
  name: string;
  placeholder: string;
  className: string;
  registerName: string;
};

export default function StringInput({
  type,
  name,
  placeholder,
  className,
  registerName,
}: StringInputProps): JSX.Element {
  const { register } = useFormContext();
  return type === "textarea" ? (
    <textarea
      name={name}
      placeholder={placeholder}
      className={className}
      {...register(registerName)}
      required
    />
  ) : (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={className}
      {...register(registerName)}
      required
    />
  );
}
