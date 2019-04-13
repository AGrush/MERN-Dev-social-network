import axios from "axios";

import { GET_PROFILE, CLEAR_CURRENT_PROFILE, PROFILE_LOADING } from "./types";

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
