import { call, put, takeLatest, select } from "redux-saga/effects";

import jsonFetch from "json-fetch";

import {
  FETCH_CLIENTS,
  FETCH_REFERENCE_STATIONS,
  ADD_CLIENT,
  ADD_STATION,
  EDIT_CLIENT,
  EDIT_USER,
  EDIT_STATION,
  DELETE_CLIENT,
  DELETE_STATION,
} from "./constants";

import {
  fetchClients,
  fetchClientsSuccess,
  fetchClientsError,
  fetchReferenceStationsSuccess,
  fetchReferenceStationsError,
  addClientSuccess,
  addClientError,
  addStationError,
  addStationSuccess,
  editClientSuccess,
  editClientError,
  editUserSuccess,
  editUserError,
  editStationSuccess,
  editStationError,
  deleteClientSuccess,
  deleteClientError,
  deleteStationSuccess,
  deleteStationError,
} from "./actions";

import { requestHandler, errorHandler } from "../../utils/sagaHelpers";
import { fetchClientStationsRequest } from "../App/saga";

export const selectLoggedInUser = (state) => state.login.loggedInUser;

function* fetchClientsGenerator() {
  const errorObject = {
    action: fetchClientsError,
    message: "Error Fetching Clients",
  };

  try {
    const loggedInUser = yield select(selectLoggedInUser);
    const clientIds =
      loggedInUser && loggedInUser.admin
        ? []
        : loggedInUser.clients.map((client) => `id=${client.id}`);
    const response = yield call(
      jsonFetch,
      `${process.env.REACT_APP_API_URL}/clients?${clientIds.join("&")}`
    );

    const clients = [];
    for (let i = 0; i < response.body.length; i++) {
      const client = response.body[i];

      const clientStations = yield call(fetchClientStationsRequest, client.id);
      const clientAlerts = yield call(
        jsonFetch,
        `${process.env.REACT_APP_API_URL}/alerts/${client.id}`
      );

      clients.push({
        ...client,
        stations: clientStations,
        alerts: clientAlerts.body,
      });
    }

    yield requestHandler(
      { status: 200, body: clients },
      { action: fetchClientsSuccess },
      errorObject
    );
  } catch (e) {
    yield errorHandler(errorObject);
  }
}

function* fetchReferenceStationsGenerator() {
  const errorObject = {
    action: fetchReferenceStationsError,
    message: "Error Fetching Reference Stations",
  };

  try {
    const response = yield call(
      jsonFetch,
      `${process.env.REACT_APP_API_URL}/referenceStations`
    );

    yield requestHandler(
      response,
      { action: fetchReferenceStationsSuccess },
      errorObject
    );
  } catch (e) {
    yield errorHandler(errorObject);
  }
}

function* addClientGenerator(action) {
  const errorObject = {
    action: addClientError,
    message: "Error Adding Client",
  };

  const { name, username, password, alerts } = action.clientData;

  if (!name || !username || !password) {
    return yield errorHandler("Error Adding Client");
  }

  try {
    const clientResponse = yield call(
      jsonFetch,
      `${process.env.REACT_APP_API_URL}/clients`,
      {
        body: { name },
        method: "POST",
      }
    );

    const userResponse = yield call(
      jsonFetch,
      `${process.env.REACT_APP_API_URL}/users`,
      {
        body: { username, password },
        method: "POST",
      }
    );

    if (clientResponse && userResponse) {
      const userClientResponse = yield call(
        jsonFetch,
        `${process.env.REACT_APP_API_URL}/userClients`,
        {
          body: {
            userId: userResponse.body.insertId,
            clientId: clientResponse.body.insertId,
          },
          method: "POST",
        }
      );

      yield call(
        jsonFetch,
        `${process.env.REACT_APP_API_URL}/alerts/${clientResponse.body.insertId}`,
        {
          body: { alerts },
          method: "POST",
        }
      );

      yield requestHandler(
        userClientResponse,
        { action: addClientSuccess },
        errorObject
      );
      yield put(fetchClients());
    } else {
      yield errorHandler("Error Adding Client");
    }
  } catch (e) {
    yield errorHandler(errorObject);
  }
}

function* editClientGenerator(action) {
  const errorObject = {
    action: editClientError,
    message: "Error Editing Client",
  };

  try {
    const { id, name, alerts } = action.clientData;

    if (!id || !name) {
      return yield errorHandler("Error Editing Client");
    }

    const response = yield call(
      jsonFetch,
      `${process.env.REACT_APP_API_URL}/clients/${id}`,
      {
        body: { name },
        method: "PUT",
      }
    );

    yield call(jsonFetch, `${process.env.REACT_APP_API_URL}/alerts/${id}`, {
      body: { alerts },
      method: "POST",
    });

    yield requestHandler(response, { action: editClientSuccess }, errorObject);
    yield put(fetchClients());
  } catch (e) {
    yield errorHandler(errorObject);
  }
}

function* deleteClientGenerator(action) {
  const errorObject = {
    action: deleteClientError,
    message: "Error Editing Client",
  };

  try {
    const { id, userId } = action.clientData;

    yield call(jsonFetch, `${process.env.REACT_APP_API_URL}/alerts/${id}`, {
      method: "DELETE",
    });

    const response = yield call(
      jsonFetch,
      `${process.env.REACT_APP_API_URL}/clients/${id}`,
      { method: "DELETE" }
    );

    yield call(jsonFetch, `${process.env.REACT_APP_API_URL}/users/${userId}`, {
      method: "DELETE",
    });

    yield requestHandler(
      response,
      { action: deleteClientSuccess },
      errorObject
    );
    yield put(fetchClients());
  } catch (e) {
    yield errorHandler(errorObject);
  }
}

function* editUserGenerator(action) {
  const errorObject = {
    action: editUserError,
    message: "Error Editing User",
  };

  try {
    const { id, username, password } = action.clientData;

    if (!id || !username || !password) {
      return yield errorHandler("Error Editing User");
    }

    const userClientResponse = yield call(
      jsonFetch,
      `${process.env.REACT_APP_API_URL}/userClients/${id}`,
      {
        method: "GET",
      }
    );

    const userId =
      userClientResponse &&
      userClientResponse.body &&
      userClientResponse.body.length > 0 &&
      userClientResponse.body[0].userId;

    // Edit User if it exists
    if (userId) {
      const response = yield call(
        jsonFetch,
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        {
          body: { username, password },
          method: "PUT",
        }
      );
      yield requestHandler(response, { action: editUserSuccess }, errorObject);
    }
    // Create new User if it doesn't exist
    else {
      const userResponse = yield call(
        jsonFetch,
        `${process.env.REACT_APP_API_URL}/users`,
        {
          body: { username, password },
          method: "POST",
        }
      );

      if (userResponse) {
        const response = yield call(
          jsonFetch,
          `${process.env.REACT_APP_API_URL}/userClients`,
          {
            body: {
              userId: userResponse.body.insertId,
              clientId: id,
            },
            method: "POST",
          }
        );

        yield requestHandler(
          response,
          { action: editUserSuccess },
          errorObject
        );
      } else {
        return yield errorHandler("Error Editing User");
      }
    }
  } catch (e) {
    yield errorHandler(errorObject);
  }
}

function* addStationGenerator(action) {
  const errorObject = {
    action: addStationError,
    message: "Error Adding Station",
  };

  const {
    clientId,
    stationId,
    name,
    referenceStationId,
    coefficient,
    latitude,
    longitude,
    ipAddress,
    deviceType,
    hasRain,
    hasSnow,
    hasWind,
    hasHydro,
    localisation,
    address,
    city,
    province,
    postalCode,
  } = action.stationData;

  if (!clientId || !stationId || !name || !referenceStationId || !coefficient) {
    return yield errorHandler("Error Adding Station");
  }

  try {
    const stationResponse = yield call(
      jsonFetch,
      `${process.env.REACT_APP_API_URL}/stations`,
      {
        body: {
          clientId,
          stationId,
          name,
          referenceStationId,
          latitude,
          longitude,
          ipAddress,
          deviceType,
          hasRain: hasRain ? 1 : 0,
          hasSnow: hasSnow ? 1 : 0,
          hasWind: hasWind ? 1 : 0,
          hasHydro: hasHydro ? 1 : 0,
          localisation,
          address,
          city,
          province,
          postalCode,
        },
        method: "POST",
      }
    );

    if (stationResponse) {
      const coefficientsResponse = yield call(
        jsonFetch,
        `${process.env.REACT_APP_API_URL}/coefficients`,
        {
          body: {
            stationId: stationResponse.body.insertId,
            coefficient,
          },
          method: "POST",
        }
      );
      yield requestHandler(
        coefficientsResponse,
        { action: addStationSuccess },
        errorObject
      );
      yield put(fetchClients());
    }
  } catch (e) {
    yield errorHandler(errorObject);
  }
}

function* editStationGenerator(action) {
  const errorObject = {
    action: editStationError,
    message: "Error Editing Station",
  };

  try {
    const {
      id,
      name,
      coefficient,
      hasRain,
      hasSnow,
      hasWind,
      hasHydro,
    } = action.stationData;

    if (!id || !name || !coefficient) {
      return yield errorHandler("Error Editing Station");
    }

    const stationResponse = yield call(
      jsonFetch,
      `${process.env.REACT_APP_API_URL}/stations/${id}`,
      {
        body: {
          name,
          hasRain: hasRain ? 1 : 0,
          hasSnow: hasSnow ? 1 : 0,
          hasWind: hasWind ? 1 : 0,
          hasHydro: hasHydro ? 1 : 0,
        },
        method: "PUT",
      }
    );

    if (stationResponse) {
      const coefficientsResponse = yield call(
        jsonFetch,
        `${process.env.REACT_APP_API_URL}/coefficients`,
        {
          body: {
            stationId: id,
            coefficient,
          },
          method: "POST",
        }
      );
      yield requestHandler(
        coefficientsResponse,
        { action: editStationSuccess },
        errorObject
      );
      yield put(fetchClients());
    }
  } catch (e) {
    yield errorHandler(errorObject);
  }
}

function* deleteStationGenerator(action) {
  const errorObject = {
    action: deleteStationError,
    message: "Error Editing Station",
  };

  try {
    const { id } = action.stationData;
    const response = yield call(
      jsonFetch,
      `${process.env.REACT_APP_API_URL}/stations/${id}`,
      { method: "DELETE" }
    );

    yield requestHandler(
      response,
      { action: deleteStationSuccess },
      errorObject
    );
    yield put(fetchClients());
  } catch (e) {
    yield errorHandler(errorObject);
  }
}

function* defaultSaga() {
  yield takeLatest(FETCH_CLIENTS, fetchClientsGenerator);
  yield takeLatest(FETCH_REFERENCE_STATIONS, fetchReferenceStationsGenerator);

  yield takeLatest(ADD_CLIENT, addClientGenerator);
  yield takeLatest(EDIT_CLIENT, editClientGenerator);
  yield takeLatest(DELETE_CLIENT, deleteClientGenerator);

  yield takeLatest(EDIT_USER, editUserGenerator);

  yield takeLatest(ADD_STATION, addStationGenerator);
  yield takeLatest(EDIT_STATION, editStationGenerator);
  yield takeLatest(DELETE_STATION, deleteStationGenerator);
}

export default defaultSaga;
