import { GET_ERRORS } from "./types";
import axios from "axios";

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
