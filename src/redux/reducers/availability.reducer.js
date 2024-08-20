const availabilityReducer = (state = { availability: [], tutorAvailability: [] }, action) => {
  switch (action.type) {
    case 'SET_AVAILABILITY':
      return { ...state, availability: action.payload };
      
    case 'SET_TUTOR_AVAILABILITY':
      return { 
        ...state, 
        tutorAvailability: [...state.tutorAvailability, ...action.payload] // Append new data to the existing array
      };
      
    case 'CLEAR_AVAILABILITY':
      return { ...state, availability: [], tutorAvailability: [] }; // Clear both arrays
      
    default:
      return state;
  }
};

export default availabilityReducer;