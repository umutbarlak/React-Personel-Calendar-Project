import dayjs from "dayjs";

type Props = {
  found: boolean;
  date: Date;
  isHighlighted: boolean;
  color: string | undefined;
};

const DayCellItem = ({ found, date, isHighlighted, color }: Props) => {
  return (
    <div
      className={`${found ? "" : "date-range-disabled"} calendar-date-number`}
    >
      {dayjs(date).date()}
      <div className={isHighlighted ? `${color} underline-div` : ""} />
    </div>
  );
};

export default DayCellItem;
