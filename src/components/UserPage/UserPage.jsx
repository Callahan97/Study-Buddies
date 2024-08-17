import React, {useState} from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';

function UserPage() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(user.username);
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedUser = {
      username,
      firstname,
      lastname,
      password: password ? password : undefined,
    };

    try {
      await axios.put('/api/user', updatedUser);
      dispatch({ type: 'SET_USER', payload: updatedUser });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="container">
      <h2>Welcome, {user.firstname}!</h2>
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
        <button type="submit">Update Profile</button>
      </form>
      <p>Your ID is: {user.id}</p>
      <LogOutButton className="btn" />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
