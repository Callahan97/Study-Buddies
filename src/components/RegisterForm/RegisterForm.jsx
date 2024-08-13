import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './RegisterForm.css';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const errors = useSelector((store) => store.errors);
  const [disciplines, setDisciplines] = useState([]);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
        role: role,
        disciplines: role === 'tutor' ? disciplines : [],
      },
    });
  }; 

  const handleDisciplineChange = (event) => {
    const value = event.target.value;
    setDisciplines((prevDisciplines) =>
      prevDisciplines.includes(value)
        ? prevDisciplines.filter((discipline) => discipline !== value)
        : [...prevDisciplines, value]
    );
  };

  return (
    <form className="formPanel" onSubmit={registerUser}>
      <h2>Register User</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      <div>
        <label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
      </div>
      <div className="role-selection">
        <label>Role: </label>
        <button
          type="button"
          className={`role-button ${role === 'tutee' ? 'selected' : ''}`}
          onClick={() => setRole('tutee')}
        >
          Tutee
        </button>
        <button
          type="button"
          className={`role-button ${role === 'tutor' ? 'selected' : ''}`}
          onClick={() => setRole('tutor')}
        >
          Tutor
        </button>
      </div>
      {role === 'tutor' && (
        <div>
          <label>Select Disciplines:</label>
          <div>
            <label>
              <input
                type="checkbox"
                value="History"
                onChange={handleDisciplineChange}
                checked={disciplines.includes('History')}
              />
              History
            </label>
            <label>
              <input
                type="checkbox"
                value="Science"
                onChange={handleDisciplineChange}
                checked={disciplines.includes('Science')}
              />
              Science
            </label>
            <label>
              <input
                type="checkbox"
                value="Math"
                onChange={handleDisciplineChange}
                checked={disciplines.includes('Math')}
              />
              Math
            </label>
            <label>
              <input
                type="checkbox"
                value="English"
                onChange={handleDisciplineChange}
                checked={disciplines.includes('English')}
              />
              English
            </label>
          </div>
        </div>
      )}
      <div>
        <input className="btn" type="submit" name="submit" value="Register" />
      </div>
    </form>
  );
}

export default RegisterForm;
