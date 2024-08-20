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

function* bookingsSaga() {
  yield takeLatest('FETCH_BOOKED_SESSIONS', fetchBookedSessions);
}

export default bookingsSaga;

