const availabilityReducer = (state = { availability: [], tutorAvailability: [] }, action) => {
  switch (action.type) {
    case 'SET_AVAILABILITY':
      return { ...state, availability: action.payload };
    case 'SET_TUTOR_AVAILABILITY':
      return { ...state, tutorAvailability: action.payload };
    case 'CLEAR_AVAILABILITY':
      return { ...state, availability: [] };
    default:
      return state;
  }
};

export default availabilityReducer;