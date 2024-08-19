import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import FullLogo from './FullLogo.png';

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <Link to="/home">
        <img src={FullLogo} alt="Study Buddies Logo" className="nav-logo" />
      </Link>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link className="navLink" to="/user">
              Profile
            </Link>

            <Link className="navLink" to="/info">
              Home
            </Link>

            <LogOutButton className="navLink" />
          </>
        )}

        <Link className="navLink" to="/about">
          About Us
        </Link>
      </div>
      
    </div>
  );
}

export default Nav;
