const initialState = {
  isAuthenticated: false,
  user: {}
};

//this function takes in the initial state and the action that's dispatched from the Action
export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
