import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './RegisterForm.css';

function RegisterForm() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const errors = useSelector((store) => store.errors);
  const [discipline, setDiscipline] = useState('');
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
        role: role,
        discipline: role === 'tutor' ? discipline : '',
      },
    });
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
          Email:
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
        <label htmlFor="firstname">
          First name:
          <input
            type="text"
            name="First name"
            value={firstname}
            required
            onChange={(event) => setFirstName(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="lastname">
          Last name:
          <input
            type="text"
            name="Last name"
            value={lastname}
            required
            onChange={(event) => setLastName(event.target.value)}
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
          <label>Select Discipline:</label>
          <div>
            <label>
              <input
                type="radio"
                value="History"
                onChange={(e) => setDiscipline(e.target.value)}
                checked={discipline === 'History'}
              />
              History
            </label>
            <label>
              <input
                type="radio"
                value="Science"
                onChange={(e) => setDiscipline(e.target.value)}
                checked={discipline === 'Science'}
              />
              Science
            </label>
            <label>
              <input
                type="radio"
                value="Math"
                onChange={(e) => setDiscipline(e.target.value)}
                checked={discipline === 'Math'}
              />
              Math
            </label>
            <label>
              <input
                type="radio"
                value="English"
                onChange={(e) => setDiscipline(e.target.value)}
                checked={discipline === 'English'}
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
