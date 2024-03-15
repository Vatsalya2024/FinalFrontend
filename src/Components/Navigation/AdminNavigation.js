import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; 

function AdminNavigation() {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <nav id="navbarNav" className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#400440' }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGbrZCdHlfhEVvjShAvvV3z7TEuU21PGPPNg&usqp=CAU" alt="Maverick Bank Logo" width="50" height="50" className="d-inline-block rounded-circle" />
          <strong><b>MAVERICK BANK</b></strong>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav">
            {location.pathname !== '/admincustomermanagement' && (
              <li className="nav-item m-2">
                <Link className="nav-link" to="/admincustomermanagement">Admin Customer Management</Link>
              </li>
            )}
            {location.pathname !== '/adminbankemployeemanagement' && (
              <li className="nav-item m-2">
                <Link className="nav-link" to="/adminbankemployeemanagement">Admin Bank Employee Management</Link>
              </li>
            )}
            <li className="nav-item m-2">
              <button className="nav-link btn btn-link" onClick={signOut}>Sign Out</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavigation;
