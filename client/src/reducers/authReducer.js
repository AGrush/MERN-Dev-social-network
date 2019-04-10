import { SET_CURRENT_USER } from "../actions/types";
import isEmptyAG from "../validation/is-empty";

const initialState = {
  isAuthenticated: false,
  user: {}
};

//this function takes in the initial state and the action that's dispatched from the Action
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmptyAG(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
