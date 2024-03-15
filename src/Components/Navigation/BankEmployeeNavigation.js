import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; 

function BankEmployeeNavigation() {
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
            {location.pathname !== '/bankemployeeprofile' && (
              <li className="nav-item m-2">
                <Link className="nav-link" to="/bankemployeeprofile">Profile</Link>
              </li>
            )}
            {location.pathname !== '/bankemployee/account' && (
              <li className="nav-item m-2">
                <Link className="nav-link" to="/bankemployee/account">Account</Link>
              </li>
            )}
            {location.pathname !== '/bankemployee/account/loans' && (
              <li className="nav-item m-2">
                <Link className="nav-link" to="/bankemployee/account/loans">Loan</Link>
              </li>
            )}
            {location.pathname !== '/bankemployee/account/transactions' && (
              <li className="nav-item m-2">
                <Link className="nav-link" to="/bankemployee/account/transactions">Transactions</Link>
              </li>
            )}
            <li className="nav-item m-2">
              <button className="nav-link" onClick={signOut}>Sign Out</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default BankEmployeeNavigation;
