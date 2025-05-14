// utils/calendarHelpers.ts

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import type { ScheduleInstance } from "../models/schedule";
import { getAssigmentById, getShiftById } from "./scheduleUtils";
import type { EventInput } from "@fullcalendar/core/index.js";

dayjs.extend(isSameOrBefore);

export const getPlugins = (plugins: any[]) => {
  return plugins;
};

export const validDates = (start: string, end: string) => {
  const dates = [];
  let currentDate = dayjs(start);
  while (currentDate.isSameOrBefore(end)) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.add(1, "day");
  }
  return dates;
};

export const getDatesBetween = (startDate: string, endDate: string) => {
  const dates = [];
  let current = dayjs(startDate, "DD.MM.YYYY");
  const end = dayjs(endDate, "DD.MM.YYYY");
  while (current.isSameOrBefore(end)) {
    dates.push(current.format("DD-MM-YYYY"));
    current = current.add(1, "day");
  }
  return dates;
};

const getPairDatesWithColor = (
  schedule: ScheduleInstance,
  selectedStaffId: string | null,
  classes: string[]
) => {
  const selectedStaff = schedule.staffs?.find((s) => s.id === selectedStaffId);

  if (!selectedStaff?.pairList) return [];

  let result: { date: string; colorClass: string }[] = [];

  selectedStaff.pairList.forEach((pair) => {
    const datesInRange = getDatesBetween(pair.startDate, pair.endDate);
    // const otherStaff = schedule.staffs.find((s) => s.id === pair.with);
    const colorIndex = schedule.staffs.findIndex((s) => s.id === pair.staffId);
    const colorClass = colorIndex !== -1 ? classes[colorIndex] : "";

    datesInRange.forEach((date) => {
      result.push({ date, colorClass });
    });
  });

  return result;
};

export const generateStaffBasedCalendar = (
  schedule: ScheduleInstance,
  selectedStaffId: string | null,
  classes: string[]
): any => {
  const works: EventInput[] = [];

  // Sadece seçilen personelin atamalarını filtrele
  const staffAssignments = selectedStaffId
    ? schedule?.assignments?.filter(
        (assignment) => assignment.staffId === selectedStaffId
      )
    : schedule.assignments;

  for (let i = 0; i < staffAssignments?.length; i++) {
    const className = schedule?.staffs?.findIndex(
      (staff) => staff.id === staffAssignments[i]?.staffId
    );

    const assignmentDate = dayjs
      .utc(staffAssignments[i]?.shiftStart)
      .format("YYYY-MM-DD");

    const isValidDate = validDates(
      schedule.scheduleStartDate,
      schedule.scheduleEndDate
    ).includes(assignmentDate);

    const work = {
      id: staffAssignments[i]?.id,
      title: getShiftById(schedule.shifts, staffAssignments[i]?.shiftId)?.name,
      duration: "01:00",
      date: assignmentDate,
      staffId: staffAssignments[i]?.staffId,
      shiftId: staffAssignments[i]?.shiftId,
      className: `event ${classes[className]} ${
        getAssigmentById(schedule.assignments, staffAssignments[i]?.id)
          ?.isUpdated
          ? "highlight"
          : ""
      } ${!isValidDate ? "invalid-date" : ""}`,
    };

    works.push(work);
  }

  // Tatil günlerini yine sadece seçilen personel için kontrol et
  const offDays = schedule?.staffs?.find(
    (staff) => staff.id === selectedStaffId
  )?.offDays;

  const dates = getDatesBetween(
    dayjs(schedule.scheduleStartDate).format("DD.MM.YYYY"),
    dayjs(schedule.scheduleEndDate).format("DD.MM.YYYY")
  );

  let highlightedDates: string[] = [];

  dates.forEach((date) => {
    const transformedDate = dayjs(date, "DD-MM-YYYY").format("DD.MM.YYYY");
    if (offDays?.includes(transformedDate)) highlightedDates.push(date);
  });

  // pairList, staffs, classes

  const pairDates = getPairDatesWithColor(schedule, selectedStaffId, classes);

  return { pairDates, events: works };
};
