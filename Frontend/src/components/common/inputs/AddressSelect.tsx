import { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

type Address = {
  [key: string]: string;
};

type AddressSelectProps<T extends Address> = {
  name: string;
  onChange?: (value: string) => void;
  registerName: string;
  values: T[];
  field: keyof T;
  message?: string;
  defaultValue?: string;
};

export default function AddressSelect<T extends Address>({
  values,
  name,
  onChange,
  field,
  registerName,
  message,
  defaultValue,
}: AddressSelectProps<T>): JSX.Element {
  const { setValue } = useFormContext();
  const handleAddressChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value) {
      setValue(registerName, value);
    }
    if (onChange) {
      onChange(value);
    }
  };
  return (
    <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
      <select
        name={name}
        id={name}
        className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
        onChange={handleAddressChange}
        value={defaultValue || ""}
      >
        <option>{values ? name : defaultValue ? defaultValue : message}</option>
        {values?.map((v) => (
          <option key={v[field]} value={v[field]}>
            {v[field]}
          </option>
        ))}
      </select>
      <button
        tabIndex={-1}
        type="button"
        className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600"
      >
        <svg
          className="w-4 h-4 mx-2 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <button
        type="button"
        className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600"
      >
        <svg
          className="w-4 h-4 mx-2 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>
  );
}
