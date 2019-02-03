import {
  FETCH_CLIENTS,
  FETCH_CLIENTS_SUCCESS,
  FETCH_CLIENTS_ERROR,
  ADD_CLIENT,
  ADD_CLIENT_SUCCESS,
  ADD_CLIENT_ERROR,
  EDIT_CLIENT,
  EDIT_CLIENT_SUCCESS,
  EDIT_CLIENT_ERROR,
  DELETE_CLIENT,
  DELETE_CLIENT_SUCCESS,
  DELETE_CLIENT_ERROR,
  TOGGLE_CLIENT_MODAL,
  SET_CLIENT_DATA,
} from "./constants";

export const fetchClients = () => ({
  type: FETCH_CLIENTS,
});

export const fetchClientsSuccess = res => ({
  type: FETCH_CLIENTS_SUCCESS,
  res
});

export const fetchClientsError = error => ({
  type: FETCH_CLIENTS_ERROR,
  error
});

export const addClient = clientData => ({
  type: ADD_CLIENT,
  clientData
});

export const addClientSuccess = res => ({
  type: ADD_CLIENT_SUCCESS,
  res
});

export const addClientError = error => ({
  type: ADD_CLIENT_ERROR,
  error
});

export const editClient = clientData => ({
  type: EDIT_CLIENT,
  clientData
});

export const editClientSuccess = res => ({
  type: EDIT_CLIENT_SUCCESS,
  res
});

export const editClientError = error => ({
  type: EDIT_CLIENT_ERROR,
  error
});

export const deleteClient = clientData => ({
  type: DELETE_CLIENT,
  clientData
});

export const deleteClientSuccess = res => ({
  type: DELETE_CLIENT_SUCCESS,
  res
});

export const deleteClientError = error => ({
  type: DELETE_CLIENT_ERROR,
  error
});

export const toggleClientModal = isAdd => ({
  type: TOGGLE_CLIENT_MODAL,
  isAdd
});

export const setClientData = clientData => ({
  type: SET_CLIENT_DATA,
  clientData
});
