import React, {useState, useEffect} from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function UserPage() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const history = useHistory(); 

  const [username, setUsername] = useState(user.username);
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [password, setPassword] = useState('');
  const [discipline, setDiscipline] = useState(user.disciplines ? user.disciplines[0]?.id : '');
  const [availableDisciplines, setAvailableDisciplines] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user.role === 'tutor') {
      axios.get('/api/user/disciplines')
        .then((response) => {
          console.log('Available Disciplines:', response.data);
          setAvailableDisciplines(response.data);
        })
        .catch((error) => {
          console.error('Error fetching disciplines:', error);
        });
    }
  }, [user.role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedUser = {
      username,
      firstname,
      lastname,
      password: password ? password : undefined,
      discipline: user.role === 'tutor' ? discipline : undefined,
    };
    console.log('Updated User Data:', updatedUser);

    try {
      await axios.put('/api/user', updatedUser);
      dispatch({ type: 'SET_USER', payload: updatedUser });
      alert('Profile updated successfully');
      setEditMode(false); 
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const goToAvailabilityPage = () => {
    history.push('/availability');
  };

  return (
    <div className="container">
      <h2>Welcome, {user.firstname}!</h2>
      
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>First Name:</label>
            <input 
              type="text" 
              value={firstname} 
              onChange={(e) => setFirstname(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input 
              type="text" 
              value={lastname} 
              onChange={(e) => setLastname(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Password (Leave blank to keep current):</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          {user.role === 'tutor' && (
            <div>
              <label>Select Discipline:</label>
              <div>
                {availableDisciplines.map((disciplineOption) => (
                  <div key={disciplineOption.id}>
                    <input 
                      type="radio"
                      id={`discipline-${disciplineOption.id}`}
                      value={disciplineOption.name}
                      checked={discipline === disciplineOption.name}
                      onChange={(e) => setDiscipline(e.target.value)}
                    />
                    <label htmlFor={`discipline-${disciplineOption.id}`}>
                      {disciplineOption.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit">Commit Changes</button>
        </form>
      ) : (
        <div>
          <p>Username: {username}</p>
          <p>First Name: {firstname}</p>
          <p>Last Name: {lastname}</p>
          <p>Password: ******</p>
          {user.role === 'tutor' && (
            <p>Discipline: {discipline}</p>
          )}
          <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}

      <p>Your ID is: {user.id}</p>
      <LogOutButton className="btn" />
      {user.role === 'tutor' && (
      <button className="btn" onClick={goToAvailabilityPage}>Manage Availability</button>
      )}
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
