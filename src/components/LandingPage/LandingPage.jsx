import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
  const [heading, setHeading] = useState('Welcome to Study Buddies!');
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <div className="container">

      <div className="grid">
        <div className="grid-col grid-col_8">
        <div className="landing-message">
        <h2>{heading}</h2>
          <p>
          Thank you for choosing Study Buddies for your tutelage needs. We are dedicated to providing a simple yet intuitive platform where tutors and tutees can connect and schedule study sessions.
          </p>
  
          <p>
          Our mission is guided by the motto: <strong><em>"Docendo Discimus"</em></strong> — which means, <strong>"by teaching, we learn."</strong> We believe that education is a two-way street, and not only do our tutees gain valuable knowledge, but our tutors also grow through the process of teaching and helping others.
          </p>
  
          <p>
          We sincerely appreciate your trust in Study Buddies. While we currently serve the Rochester, MN area, we are excited about the future and plan to expand our services in the coming months.
          </p>
  
          <p className="signature">
          Sincerely,<br></br>
          <strong>Conor Callahan</strong>
          </p>
        </div>
        </div>
        <div className="grid-col grid-col_4">
          <RegisterForm />

          <center>
            <h4>Already a Member?</h4>
            <button className="btn btn_sizeSm" onClick={onLogin}>
              Login
            </button>
          </center>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
