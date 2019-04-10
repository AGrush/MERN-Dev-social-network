import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt/decode";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("api/users/register", userData)
    .then(res => {
      //once they register and theyre successful they will redirect to login page
      history.push("login");
    })
    .catch(err =>
      //returning wouldn't work here as we are dealing with asynchronous data, we set the error to state with the thunk middleware as it waits for the response unlike 'return'
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginrUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //save to local storage
      const { token } = res.data;
      //set token to localstorage. Local storage only stores strings
      localStorage.setItem("jwtToken", token);
      // set token to auth header (we need to put that token into the header )
      setAuthToken(token);
      //Decode token to get user data, issued at date and the expiration date
      const decoded = jwt_decode(token);
      //Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
