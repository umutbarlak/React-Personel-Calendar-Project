// File: components/calendar/EventContent.tsx
import { getAssigmentById, getStaffById } from "../../utils/scheduleUtils";
import type { EventContentArg } from "@fullcalendar/core";
import type { ScheduleInstance } from "../../models/schedule";

type EventContentProps = {
  eventInfo: EventContentArg;
  schedule: ScheduleInstance;
};

const EventContent = ({ eventInfo, schedule }: EventContentProps) => {
  const assignment = getAssigmentById(schedule.assignments, eventInfo.event.id);
  const staff = getStaffById(schedule.assignments, assignment?.staffId || "");

  return (
    <div className="fc-event-title-container">
      <div className="fc-event-title fc-staff-name">
        {staff?.name || eventInfo.event.title}
      </div>
    </div>
  );
};

export default EventContent;
