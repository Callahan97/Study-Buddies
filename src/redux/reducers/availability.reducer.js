const availabilityReducer = (state = { availability: [], tutorAvailability: [] }, action) => {
  switch (action.type) {
    case 'SET_AVAILABILITY':
      return { ...state, availability: action.payload };
      
    case 'SET_TUTOR_AVAILABILITY':
      return { 
        ...state, 
        tutorAvailability: action.payload 
      };
    case 'REMOVE_BOOKED_SESSION':
      return {
        ...state,
        tutorAvailability: state.tutorAvailability.filter(
          session => 
            session.tutor_id !== action.payload.tutor_id ||
            session.start_time !== action.payload.start_time ||
            session.end_time !== action.payload.end_time
        )
      };
      
    case 'CLEAR_AVAILABILITY':
      return { ...state, availability: [], tutorAvailability: [] };
      
    default:
      return state;
  }
};

export default availabilityReducer;