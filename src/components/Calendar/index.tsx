/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";

import type { ScheduleInstance } from "../../models/schedule";
import type { UserInstance } from "../../models/user";

import FullCalendar from "@fullcalendar/react";

import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

import type { EventInput } from "@fullcalendar/core/index.js";

import "../profileCalendar.scss";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import type { ModalI } from "../../models/modal";
import { updateAssignmentDate } from "../../store/schedule/actions";
import { useDispatch } from "react-redux";
import customParseFormat from "dayjs/plugin/customParseFormat";
import CalendarModal from "./calendarModal";
import DayCellItem from "./dayCellItem";
import {
  generateStaffBasedCalendar,
  validDates,
} from "../../utils/calendarHelpers";
import {
  getAssigmentById,
  getShiftById,
  getStaffById,
} from "../../utils/scheduleUtils";
import StaffList from "./staffList";
import RenderEventContent from "./renderEventContent";
import { classes } from "../../constants/bgColors";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

type CalendarContainerProps = {
  schedule: ScheduleInstance;
  auth: UserInstance;
};

const CalendarContainer = ({ schedule, auth }: CalendarContainerProps) => {
  const dispatch = useDispatch();
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [highlightedDates, setHighlightedDates] = useState<
    { date: string; colorClass: string }[]
  >([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [initialDate, setInitialDate] = useState<Date>(
    dayjs(schedule?.scheduleStartDate).toDate()
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<ModalI>();

  const getPlugins = () => {
    const plugins = [dayGridPlugin];

    plugins.push(interactionPlugin);
    return plugins;
  };

  useEffect(() => {
    if (selectedStaffId === "") return;

    const staffExists = schedule?.staffs?.some((s) => s.id === selectedStaffId);

    if (!staffExists) {
      setSelectedStaffId("");
    }
  }, [schedule]);

  useEffect(() => {
    const { events, pairDates } = generateStaffBasedCalendar(
      schedule,
      selectedStaffId,
      classes
    );

    setEvents(events);
    setHighlightedDates(pairDates);
  }, [selectedStaffId, schedule]);

  useEffect(() => {
    const firstEvent = schedule.assignments
      ?.map((a) => dayjs.utc(a.shiftStart))
      .sort((a, b) => a.valueOf() - b.valueOf())[0];

    const dateToSet = firstEvent?.isValid()
      ? firstEvent.toDate()
      : dayjs(schedule?.scheduleStartDate).toDate();

    setInitialDate(dateToSet);
    // setSelectedStaffId(schedule?.staffs?.[0]?.id);

    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(dateToSet);
    }
  }, [schedule]);

  const clickEvent = (clickInfo: any) => {
    const assignment = getAssigmentById(schedule.assignments, clickInfo.id);

    if (!assignment) return;

    const shift = getShiftById(schedule.shifts, assignment?.shiftId);
    const staff = getStaffById(schedule.staffs, assignment?.staffId);

    if (!assignment || !shift || !staff) return;

    const start = dayjs(assignment.shiftStart).format("DD.MM.YYYY HH:mm");
    const end = dayjs(assignment.shiftEnd).format("DD.MM.YYYY HH:mm");

    const info = {
      staff_name: staff?.name,
      shift_name: shift?.name,
      date: start.split(" ")[0],
      start: start.split(" ")[1],
      end: end.split(" ")[1],
    };
    setShowModal(true);
    setModalInfo(info);
  };

  const handleUpdate = (e: any) => {
    const localDate = new Date(e.event.start);

    const isoPreserved = dayjs(localDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    dispatch(updateAssignmentDate(e.event.id, isoPreserved) as any);
  };

  return (
    <div className="calendar-section staff-calendar-container">
      <div className="calendar-wrapper">
        <StaffList
          staffs={schedule.staffs}
          selectedStaffId={selectedStaffId}
          setSelectedStaffId={setSelectedStaffId}
        />

        <FullCalendar
          eventClick={(e) => {
            clickEvent(e.event);
          }}
          ref={calendarRef}
          locale={auth.language}
          plugins={getPlugins()}
          // contentHeight={400}
          height={"auto"}
          handleWindowResize={true}
          selectable={true}
          editable={true}
          eventDrop={(e) => handleUpdate(e)}
          eventOverlap={true}
          initialView="dayGridMonth"
          initialDate={initialDate}
          events={events}
          firstDay={1}
          dayMaxEventRows={4}
          fixedWeekCount={true}
          showNonCurrentDates={true}
          eventContent={(eventInfo: any) => {
            return (
              <RenderEventContent eventInfo={eventInfo} schedule={schedule} />
            );
          }}
          dayCellContent={({ date }) => {
            const found = validDates(
              schedule.scheduleStartDate,
              schedule.scheduleEndDate
            ).includes(dayjs(date).format("YYYY-MM-DD"));

            const formattedDate = dayjs(date).format("DD-MM-YYYY");

            console.log(highlightedDates);

            const pairMatch = highlightedDates.find(
              (d) => d.date === formattedDate
            );

            const isHighlighted = !!pairMatch;

            console.log(pairMatch);

            return (
              <DayCellItem
                found={found}
                date={date}
                isHighlighted={isHighlighted}
                color={pairMatch?.colorClass}
              />
            );
          }}
        />
        {showModal && modalInfo && (
          <CalendarModal
            modalInfo={modalInfo}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarContainer;
