import { call, takeLatest } from "redux-saga/effects";

import jsonFetch from "json-fetch";

import moment from "moment";

import { requestHandler, errorHandler } from '../../utils/sagaHelpers'

import { FETCH_STATION_DATA } from "./constants";

import {
  fetchStationDataSuccess,
  fetchStationDataError
} from "./actions";

function* fetchStationData(action) {
  try {
    const { clientId, currentDay } = action;

    const chartStart = moment(currentDay).startOf("day");
    const chartEnd = moment(currentDay).endOf("day");

    const response = yield call(
      jsonFetch,
      `${process.env.REACT_APP_API_URL}/stationData/${clientId}/?start=${chartStart.toISOString()}&end=${chartEnd.toISOString()}`
    );

    yield requestHandler(response, {
      action: fetchStationDataSuccess
    }, {
      action: fetchStationDataError,
      message: 'Error Fetching Client Stations Data'
    });
  } catch (e) {
    yield errorHandler(fetchStationDataError, 'Error Fetching Client Stations Data');
  }
}

function* defaultSaga() {
  yield takeLatest(FETCH_STATION_DATA, fetchStationData);
}

export default defaultSaga;
