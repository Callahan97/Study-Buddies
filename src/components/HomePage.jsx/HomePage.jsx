import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container">
      <p>Home Page</p>
      <Link to="/scheduling-dashboard">
        <button className="btn">Go to Scheduling Dashboard</button>
      </Link>
    </div>
  );
}

export default HomePage;
