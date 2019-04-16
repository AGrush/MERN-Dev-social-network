import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

//since we called it index.js it knows to open it
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];
//takes in three things: root reducer, preloaded state, enhancer/middleware
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware)
    //,
    //  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
