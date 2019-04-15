import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";

//this is the child state: this.props.parent.CHILD
const initialState = {};

//this function takes in the initial state and the action that's dispatched from the Action
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
}
