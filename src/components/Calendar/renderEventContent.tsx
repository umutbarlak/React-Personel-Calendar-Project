import { getAssigmentById, getStaffById } from "../../utils/scheduleUtils";

const RenderEventContent = ({ eventInfo, schedule }: any) => {
  const assignment = getAssigmentById(schedule.assignments, eventInfo.event.id);

  if (!assignment) return;

  const staff = getStaffById(schedule.staffs, assignment?.staffId);
  const className = eventInfo.event.classNames[1];
  return (
    <div className={`${className}  event-content`}>
      <p>{staff?.name}</p>
    </div>
  );
};

export default RenderEventContent;
