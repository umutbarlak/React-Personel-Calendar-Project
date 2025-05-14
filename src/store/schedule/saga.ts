/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { Action } from "redux-actions";

import { put, takeEvery } from "redux-saga/effects";

import types from "./types";
import Logger from "../../utils/logger";
import * as actions from "./actions";
import { updateProgress } from "../ui/actions";

import type { Callbacks } from "../../utils/types";
import { scheduleReponse } from "../../constants/api";

function* asyncFetchSchedule({
  payload: { onSuccess, onError } = {},
}: Action<Callbacks>) {
  yield put(updateProgress());
  try {
    const response = scheduleReponse;
    yield put(actions.fetchScheduleSuccess(response.data));

    onSuccess && onSuccess(response);
  } catch (err) {
    Logger.error(err);
    onError && onError(err);

    yield put(actions.fetchScheduleFailed());
  } finally {
    yield put(updateProgress(false));
  }
}

function* asyncUpdateAssignmentDate({
  payload: { id, newDate, onSuccess, onError },
}: Action<{ id: number; newDate: string } & Callbacks>) {
  yield put(updateProgress());
  try {
    const response = JSON.parse(JSON.stringify(scheduleReponse));

    console.log(id);

    const assignment = response.data.assignments.find((a: any) => a.id === id);

    console.log(assignment);

    if (assignment) {
      assignment.shiftStart = newDate;
    }

    yield put(actions.fetchScheduleSuccess(response.data));
    onSuccess && onSuccess(response);
  } catch (err) {
    Logger.error(err);
    onError && onError(err);
    yield put(actions.fetchScheduleFailed());
  } finally {
    yield put(updateProgress(false));
  }
}

const scheduleSagas = [
  takeEvery(types.FETCH_SCHEDULE, asyncFetchSchedule),
  takeEvery(types.UPDATE_ASSIGNMENT_DATE, asyncUpdateAssignmentDate),
];

export default scheduleSagas;
