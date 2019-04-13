import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";

//this.props.X
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer
});
