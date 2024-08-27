import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchBookedSessions(action) {
  try {
    const response = yield axios.get('/api/bookings', {
      params: { tutee_id: action.payload.tutee_id },
    });
    yield put({ type: 'SET_BOOKED_SESSIONS', payload: response.data });
  } catch (error) {
    console.error('Error fetching booked sessions:', error);
  }
}

function* deleteBookedSession(action) {
  try {
    yield axios.delete(`/api/bookings/${action.payload}`);
    yield put({ type: 'FETCH_BOOKED_SESSIONS', payload: { userId: action.payload.userId } });
  } catch (error) {
    console.error('Error deleting booked session:', error);
  }
}

function* bookSession(action) {
  try {
    yield axios.post('/api/bookings', action.payload);
    
    yield put({
      type: 'REMOVE_BOOKED_SESSION',
      payload: {
        tutor_id: action.payload.tutor_id,
        start_time: action.payload.start_time,
        end_time: action.payload.end_time
      }
    });

    yield put({ type: 'FETCH_BOOKED_SESSIONS', payload: { tutee_id: action.payload.tutee_id } });
  } catch (error) {
    console.error('Error booking session:', error);
  }
}

function* bookingsSaga() {
  yield takeLatest('FETCH_BOOKED_SESSIONS', fetchBookedSessions);
  yield takeLatest('DELETE_BOOKED_SESSION', deleteBookedSession);
  yield takeLatest('BOOK_SESSION', bookSession);
}

export default bookingsSaga;

