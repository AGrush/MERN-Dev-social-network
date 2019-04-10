import { GET_ERRORS } from "../actions/types";

const initialState = {};

//this function takes in the initial state and the action that's dispatched from the Action
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
}
