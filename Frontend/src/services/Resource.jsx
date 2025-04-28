import * as React from "react";
import UrlPattern from "url-pattern";
import { API_BASE_URL } from "../config";

const ResourceContext = React.createContext();

const DEFAULT_EMPTY_RESOURCE = {
  data: [],
  loading: false,
  loaded: false,
  error: false,
  // params: ,
  // pagination: ,
  // pending: ,
};

function resourceReducer(state, action) {

  switch (action.type) {
    case "USING_RESOURCE":
      return {
        [action.resource]: {
          data: [],
          loading: false,
          loaded: false,
          error: false,
          // params: ,
          // pagination: ,
          // pending: ,
        },
        ...state,
      };

    case "FETCH_STARTED":
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          loading: true,
        },
      };
    case "FETCH_SUCCEEDED":
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          loaded: true,
          loading: false,
          data: action.updateStateWithFetchedData
            ? action.payload.data
            : state[action.resource].data,
        },
      };
    case "FETCH_FAILED":
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          loaded: false,
          loading: false,
          error: action.payload.error,
        },
      };
    default: {
      throw new Error(`Unsupported action type: ${action.type}`);
    }
  }
}

function ResourceProvider({ routes, ...props }) {
  const initialState = {};
  for (const key in routes) {
    initialState[key] = { ...DEFAULT_EMPTY_RESOURCE };
  }
  const [resource, dispatchResource] = React.useReducer(
    resourceReducer,
    initialState
  );
  return (
    <ResourceContext.Provider
      value={[resource, dispatchResource, routes]}
      {...props}
    />
  );
}

const useResource = (resource) => {
  const context = React.useContext(ResourceContext);
  if (!context) {
    throw new Error(`useResource must be used within a Provider`);
  }

  const [state, dispatch, routes] = context;

  const fetch = (
    params = {},
    options = {},
    action = "get",
    updateStateWithFetchedData = true
  ) => {
    const url = `${API_BASE_URL}/school_centers`
    /*       const url = new UrlPattern(
              routes[resource]?.[action]?.url || routes[resource].url
          ); */
    const promise = window
      .fetch(url, {
        ...routes[resource].options,
        ...options,
      })
      .then((response) => response.json())
      .then((data) =>
        dispatch({
          type: "FETCH_SUCCEEDED",
          resource,
          payload: {
            data: data,
          },
          updateStateWithFetchedData,
        })
      )
      .catch((error) =>
        dispatch({
          type: "FETCH_FAILED",
          resource,
          payload: {
            error,
          },
          updateStateWithFetchedData,
        })
      );

    dispatch({ type: "FETCH_STARTED", resource, updateStateWithFetchedData });
    return promise;
  };

  const get = (params = {}, options = {}, updateStateWithFetchedData = true) =>
    fetch(
      params,
      { method: "GET", ...options },
      "get",
      updateStateWithFetchedData
    );
  const post = (
    params = {},
    options = {},
    updateStateWithFetchedData = false
  ) =>
    fetch(
      params,
      { method: "POST", ...options },
      "post",
      updateStateWithFetchedData
    );
  const put = (params = {}, options = {}, updateStateWithFetchedData = false) =>
    fetch(
      params,
      { method: "PUT", ...options },
      "put",
      updateStateWithFetchedData
    );
  const remove = (
    params = {},
    options = {},
    updateStateWithFetchedData = false
  ) =>
    fetch(
      params,
      { method: "DELETE", ...options },
      "delete",
      updateStateWithFetchedData
    );

  if (!state[resource]) {
    throw new Error(`No routes for resource "${resource}".`);
  }

  return [state[resource], { get, post, put, remove, fetch }];
};

export { ResourceProvider, useResource };
