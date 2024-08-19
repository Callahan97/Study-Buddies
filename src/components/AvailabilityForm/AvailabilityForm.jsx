import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function AvailabilityForm() {
    const dispatch = useDispatch();
    const availabilityFromStore = useSelector((store) => store.availability);

  const [availability, setAvailability] = useState([
    { day: 'Monday', startTime: '', endTime: '', duration: '' },
    { day: 'Tuesday', startTime: '', endTime: '', duration: '' },
    { day: 'Wednesday', startTime: '', endTime: '', duration: '' },
    { day: 'Thursday', startTime: '', endTime: '', duration: '' },
    { day: 'Friday', startTime: '', endTime: '', duration: '' },
    { day: 'Saturday', startTime: '', endTime: '', duration: '' },
    { day: 'Sunday', startTime: '', endTime: '', duration: '' },
  ]);

  useEffect(() => {
    dispatch({ type: 'FETCH_AVAILABILITY' });
  }, [dispatch]);

  useEffect(() => {
    if (availabilityFromStore && availabilityFromStore.length > 0) {
      setAvailability(availabilityFromStore);
    }
  }, [availabilityFromStore]);

  const handleInputChange = (index, field, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index][field] = value || '';
    setAvailability(updatedAvailability);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (const slot of availability) {
        if (!slot.startTime || !slot.endTime || !slot.duration) {
          alert('Please fill in all fields for each day.');
          return;
        }
      }
      
    dispatch({ type: 'UPDATE_AVAILABILITY', payload: availability });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Set Availability</h3>
      {availability.map((slot, index) => (
        <div key={index}>
          <label>{slot.day}</label>
          <input
            type="time"
            value={slot.startTime || ''}
            onChange={(e) => handleInputChange(index, 'startTime', e.target.value)}
            placeholder="Start Time"
          />
          <input
            type="time"
            value={slot.endTime || ''}
            onChange={(e) => handleInputChange(index, 'endTime', e.target.value)}
            placeholder="End Time"
          />
          <input
            type="number"
            value={slot.duration || ''}
            onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
            placeholder="Duration (in minutes)"
          />
        </div>
      ))}
      <button type="submit">Save Availability</button>
    </form>
  );
}

export default AvailabilityForm;