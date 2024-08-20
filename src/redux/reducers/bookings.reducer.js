const initialState = {
    bookedSessions: [],
  };
  
  const bookingsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_BOOKED_SESSIONS':
        return { ...state, bookedSessions: action.payload };
      default:
        return state;
    }
  };
  
  export default bookingsReducer;