import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import './HomePage.css'

function HomePage() {
  const dispatch = useDispatch();
  const bookedSessions = useSelector((store) => store.bookings.bookedSessions);
  const currentUser = useSelector((store) => store.user);

  useEffect(() => {
    console.log('Fetching booked sessions for user ID:', currentUser.id); 
    
    dispatch({
      type: 'FETCH_BOOKED_SESSIONS',
      payload: { userId: currentUser.id },
    });
  }, [dispatch, currentUser.id]);
  
  useEffect(() => {
    console.log('Booked sessions:', bookedSessions); 
  }, [bookedSessions]);

  return (
    <div className="homepage">
      <h2 className="page-title">Upcoming Booked Sessions</h2>

      <div className="booked-sessions-table">
        <div className="table-header">
          <span>Date</span>
          <span>Start Time</span>
          <span>End Time</span>
          <span>Duration</span>
          <span>{currentUser.role === 'tutor' ? 'Tutee' : 'Tutor'}</span>
          <span>Actions</span> {/* Added Actions column */}
        </div>

        {bookedSessions.length > 0 ? (
          bookedSessions.map((session, index) => (
            <div key={index} className="table-row">
              <span>{moment(session.date).format('dddd, MMMM D, YYYY')}</span>
              <span>{session.start_time}</span>
              <span>{session.end_time}</span>
              <span>
                {moment(session.end_time, "HH:mm:ss").diff(
                  moment(session.start_time, "HH:mm:ss"),
                  'minutes'
                )}{' '}
                minutes
              </span>
              <span>
                {currentUser.role === 'tutor' 
                  ? `${session.tutee_firstname} ${session.tutee_lastname}`
                  : `${session.tutor_firstname} ${session.tutor_lastname}`}
              </span>
              <span>
                <button className="edit-button">Edit</button>
                <button className="delete-button">Delete</button>
              </span> {/* Added Edit and Delete buttons */}
            </div>
          ))
        ) : (
          <p>No booked sessions.</p>
        )}
      </div>
      <Link to="/scheduling-dashboard">
        <button className="btn">Go to Scheduling Dashboard</button>
      </Link>
    </div>
  );
}

export default HomePage;
