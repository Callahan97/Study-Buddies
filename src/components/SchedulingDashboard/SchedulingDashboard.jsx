import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import './SchedulingDashboard.css';

function SchedulingDashboard() {
  const dispatch = useDispatch();
  const currentUser = useSelector((store) => store.user);
  const tutorAvailability = useSelector((store) => store.availability.tutorAvailability);
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('week'));

  useEffect(() => {
    if (selectedDiscipline) {
      fetchAvailability();
    }
  }, [currentWeekStart, selectedDiscipline]);

  const fetchAvailability = () => {
    for (let i = 0; i < 7; i++) {
      const dayMoment = currentWeekStart.clone().add(i, 'days');
      const startTime = dayMoment.startOf('day').format('HH:mm:ss');
      const endTime = dayMoment.endOf('day').format('HH:mm:ss');
      
      console.log(`Fetching availability for: ${dayMoment.format('dddd')}`, { startTime, endTime, discipline: selectedDiscipline });
      
      dispatch({
        type: 'FETCH_TUTOR_AVAILABILITY',
        payload: { startTime, endTime, discipline: selectedDiscipline },
      });
    }
  };

  const handleBooking = (availability) => {
    const dayIndex = moment().day(availability.day_of_week).day();
    const date = currentWeekStart.clone().add(dayIndex, 'days').format('YYYY-MM-DD');
  
    const bookingDetails = {
      tutor_id: availability.tutor_id,
      tutee_id: currentUser.id,
      date: date,
      start_time: availability.start_time,
      end_time: availability.end_time,
    };
  
    dispatch({
      type: 'BOOK_SESSION',
      payload: bookingDetails,
    });
  };
  
  const handleNextWeek = () => {
    setCurrentWeekStart(currentWeekStart.clone().add(1, 'week'));
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(currentWeekStart.clone().subtract(1, 'week'));
  };

  const handleDisciplineChange = (event) => {
    const selectedDiscipline = event.target.value;
    dispatch({ type: 'CLEAR_AVAILABILITY' });
  
    setSelectedDiscipline(selectedDiscipline);
  };

  
  const daysInWeek = [];
  for (let i = 0; i < 7; i++) {
    const dayMoment = currentWeekStart.clone().add(i, 'days');
    daysInWeek.push({
      date: dayMoment.format('YYYY-MM-DD'),
      dayOfWeek: dayMoment.format('dddd'), 
      displayDate: dayMoment.format('dddd, MMMM D, YYYY'),
    });
  }

  return (
    <div className="scheduling-dashboard">
      <h2 className="dashboard-title">Book Sessions Below</h2>

      <div className="week-selector-container">
  <span className="arrow" onClick={handlePreviousWeek}>&#8592;</span>
  <span>{currentWeekStart.format('MMM D')} - {currentWeekStart.clone().endOf('week').format('MMM D, YYYY')}</span>
  <span className="arrow" onClick={handleNextWeek}>&#8594;</span>
  
  <select value={selectedDiscipline} onChange={handleDisciplineChange}>
    <option value="">Select Discipline</option>
    <option value="Math">Math</option>
    <option value="Science">Science</option>
    <option value="History">History</option>
    <option value="English">English</option>
  </select>
</div>

      <div className="availability-table">
        <div className="availability-header">
          <span>Date</span>
          <span>Start Time</span>
          <span>End Time</span>
          <span>Duration</span>
          <span>Tutor</span>
          <span>Action</span>
        </div>
        {daysInWeek.map((day) => (
          <React.Fragment key={day.date}>
            <div className="availability-row">
              <div className="date-column">
                <span>{day.displayDate}</span>
                <span className="day-of-week">{day.dayOfWeek}</span>
              </div>
              {tutorAvailability
                .filter((availability) => availability.day_of_week === day.dayOfWeek)
                .length > 0 ? (
                tutorAvailability
                  .filter((availability) => availability.day_of_week === day.dayOfWeek)
                  .map((availability, index) => (
                    <React.Fragment key={index}>
                     <span>{moment(availability.start_time, "HH:mm:ss").format("h:mm A")}</span>
                      <span>{moment(availability.end_time, "HH:mm:ss").format("h:mm A")}</span>
                      <span>
                      {moment(availability.end_time, "HH:mm:ss").diff(moment(availability.start_time, "HH:mm:ss"), 'minutes')} minutes
                      </span>
                      <span>{availability.firstname} {availability.lastname}</span>
                      <span>
                      <button className="book-button" onClick={() => handleBooking(availability)}>Book Now</button>
                      </span>
                    </React.Fragment>
                  ))
              ) : (
                <span className="no-availability">No availability</span>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default SchedulingDashboard;