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

function* bookingsSaga() {
  yield takeLatest('FETCH_BOOKED_SESSIONS', fetchBookedSessions);
  yield takeLatest('DELETE_BOOKED_SESSION', deleteBookedSession);
}

export default bookingsSaga;

