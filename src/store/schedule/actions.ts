import { createAction } from "redux-actions";

import types from "./types";
import type { Callbacks } from "../../utils/types";

export const fetchSchedule = createAction(types.FETCH_SCHEDULE);
export const fetchScheduleSuccess = createAction(types.FETCH_SCHEDULE_SUCCESS);
export const fetchScheduleFailed = createAction(types.FETCH_SCHEDULE_FAILED);
export const updateAssignmentDate = createAction(
  types.UPDATE_ASSIGNMENT_DATE,
  (id: number, newDate: string, callbacks?: Callbacks) => ({
    id,
    newDate,
    ...callbacks,
  })
);
