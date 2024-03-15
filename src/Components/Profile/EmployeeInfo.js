import React, { useState, useEffect } from 'react';

function EmployeeInfo() {
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [newName, setNewName] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem('email');

    if (email) {
      fetchEmployeeInfo(email);
    }
  }, []);

  const fetchEmployeeInfo = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:5134/api/BankEmployeeLogin/GetEmployeeInfoByEmail?email=${encodeURIComponent(email)}`
      );
  
      if (response.ok) {
        const data = await response.json();
        setEmployeeInfo(data);
      } else {
        console.error('Failed to fetch employee info');
      }
    } catch (error) {
      console.error('Error fetching employee info:', error);
    }
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleUpdateName = async () => {
    try {
      const response = await fetch('http://localhost:5134/api/BankEmployee/UpdateBankEmployeeName', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeID: employeeInfo.employeeID,
          name: newName
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        setEmployeeInfo(updatedData);
        setNewName(''); 
        setUpdateSuccess(true);
      } else {
        console.error('Failed to update employee name');
      }
    } catch (error) {
      console.error('Error updating employee name:', error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card text-center mb-4">
            <div className="card-body">
              <h2 className="card-title">Employee Information</h2>
              {employeeInfo ? (
                <div>
                  <p className="card-text">Name: {employeeInfo.name}</p>
                  <p className="card-text">Email: {employeeInfo.email}</p>
                  <p className="card-text">Position: {employeeInfo.position}</p>
                  <p className="card-text">Phone: {employeeInfo.phone}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Update Name</h5>
              <div className="mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="New Name" 
                  value={newName} 
                  onChange={handleNameChange} 
                />
              </div>
              <button className="btn btn-primary" onClick={handleUpdateName}>Update Name</button>
              {updateSuccess && <p className="text-success mt-2">Name updated successfully!</p>}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default EmployeeInfo;
