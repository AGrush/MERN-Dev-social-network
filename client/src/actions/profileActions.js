import axios from "axios";

import {
  GET_PROFILE,
  CLEAR_CURRENT_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS
} from "./types";

// Get current profile action
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    //get the current users profile
    .get("/api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// Create Profile // to be able to redirect with withrouter we have to pass in history here
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Profile loading, no need for payload this just lets the reduxer know that its loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear current profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
