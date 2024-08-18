import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Datepicker from "tailwind-datepicker-react";
import { IOptions } from "tailwind-datepicker-react/types/Options";

type DateInputProps = {
  registerName: string;
  defaultValue?: Date;
};

export const DateInput = ({ registerName, defaultValue }: DateInputProps) => {
  const [show, setShow] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(
    defaultValue ? new Date(defaultValue) : null
  );
  const { setValue } = useFormContext();
  const handleChange = (selectedDate: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      setValue(registerName, selectedDate);
    }
  };
  const handleClose = (state: boolean) => {
    setShow(state);
  };

  return (
    <div>
      <Datepicker
        onChange={handleChange}
        show={show}
        setShow={handleClose}
        options={options}
        value={date || defaultValue}
      />
    </div>
  );
};

const options: IOptions = {
  title: "Your Birthday",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  clearBtnText: "Clear",
  maxDate: new Date(),
  minDate: new Date("1950-01-01"),

  icons: {
    prev: () => <span className="text-sm">Previous</span>,
    next: () => <span className="text-sm">Next</span>,
  },
  datepickerClassNames: "top-32",
  defaultDate: new Date(),
  language: "en",
  weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  inputNameProp: "date",
  inputIdProp: "date",
  inputPlaceholderProp: "Select Date",
  inputDateFormatProp: {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
};
