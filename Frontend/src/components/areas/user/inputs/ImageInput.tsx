import Photo from "../../../common/svgs/Photo";

type ImageInputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, imageType: string) => void;
  imageType: string;
  id: string;
  className: string;
  label?: string;
};

export default function ImageInput({
  onChange,
  imageType,
  id,
  className,
  label,
}: ImageInputProps): JSX.Element {
  return (
    <>
      <input
        type="file"
        onChange={(e) => onChange(e, imageType)}
        id={id}
        className="hidden"
        required
      />
      <label htmlFor={id} className={className}>
        {label}
        <Photo />
      </label>
    </>
  );
}
