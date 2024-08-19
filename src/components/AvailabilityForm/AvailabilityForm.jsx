import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function AvailabilityForm() {
  const dispatch = useDispatch();
  const availabilityFromStore = useSelector((store) => store.availability);

  const [availability, setAvailability] = useState([
    { day: 'Monday', isEnabled: false, startTime: '', endTime: '', duration: '' },
    { day: 'Tuesday', isEnabled: false, startTime: '', endTime: '', duration: '' },
    { day: 'Wednesday', isEnabled: false, startTime: '', endTime: '', duration: '' },
    { day: 'Thursday', isEnabled: false, startTime: '', endTime: '', duration: '' },
    { day: 'Friday', isEnabled: false, startTime: '', endTime: '', duration: '' },
    { day: 'Saturday', isEnabled: false, startTime: '', endTime: '', duration: '' },
    { day: 'Sunday', isEnabled: false, startTime: '', endTime: '', duration: '' },
  ]);

  useEffect(() => {
    dispatch({ type: 'FETCH_AVAILABILITY' });
  }, [dispatch]);

  useEffect(() => {
    if (availabilityFromStore && availabilityFromStore.length > 0) {
      const updatedAvailability = availability.map((day) => {
        const storedDay = availabilityFromStore.find(
          (stored) => stored.day_of_week === day.day
        );
        if (storedDay) {
          return {
            ...day,
            isEnabled: true,
            startTime: storedDay.start_time,
            endTime: storedDay.end_time,
            duration: storedDay.duration,
          };
        }
        return day;
      });
      setAvailability(updatedAvailability);
    }
  }, [availabilityFromStore]);

  const handleInputChange = (index, field, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index][field] = value;
    setAvailability(updatedAvailability);
  };

  const handleCheckboxChange = (index) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].isEnabled = !updatedAvailability[index].isEnabled;
    setAvailability(updatedAvailability);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enabledAvailability = availability.filter((slot) => slot.isEnabled);
    dispatch({ type: 'UPDATE_AVAILABILITY', payload: enabledAvailability });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Set Availability</h3>
      {availability.map((slot, index) => (
        <div key={index}>
          <label>
            <input
              type="checkbox"
              checked={slot.isEnabled}
              onChange={() => handleCheckboxChange(index)}
            />
            {slot.day}
          </label>
          {slot.isEnabled && (
            <div>
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
          )}
        </div>
      ))}
      <button className="btn" type="submit">Save Availability</button>
    </form>
  );
}

export default AvailabilityForm;