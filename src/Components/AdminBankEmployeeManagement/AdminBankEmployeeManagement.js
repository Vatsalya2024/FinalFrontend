import React, { useState, useEffect } from "react";
import "./AdminBankEmployeeManagement.css";

function AdminBankEmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [employeeById, setEmployeeById] = useState(null);
  const [showData, setShowData] = useState(false);
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    name: "",
    position: "",
    phone: "",
  });
  const [registrationResponse, setRegistrationResponse] = useState(null);
  const [message, setMessage] = useState("");
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [message4, setMessage4] = useState("");
  const [employeeIds, setEmployeeIds] = useState([]);
  const token = sessionStorage.getItem("token");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeCard, setActiveCard] = useState("employeeInfo");

  useEffect(() => {
    fetch("http://localhost:5134/api/AdminBankEmployees/GetAllEmployees", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Employees:", data);
        setEmployees(data);

        const employeeIds = data.map((employee) => employee.employeeID);
        setEmployeeIds(employeeIds);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, [token]);

  const handleShowData = () => {
    setShowData(true);
  };

  const handleClose = () => {
    setShowData(false);
  };

  const handleGetEmployeeById = () => {
    if (employeeIdInput === "") {
      setMessage("Please select an employee ID");
      return;
    }

    fetch(
      `http://localhost:5134/api/AdminBankEmployees/getemployeebyid?employeeId=${employeeIdInput}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Employee Data:", data);
        setEmployeeById(data);
        setMessage("");
      })
      .catch((error) => {
        console.error("Error fetching employee by ID:", error);
        setEmployeeById("");
        setMessage("Employee Not Found");
      });
  };

  const handleDeactivateEmployee = () => {
    if (employeeIdInput === "") {
      setMessage1("Employee ID cannot be empty");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to deactivate this employee?"
    );

    if (!confirmed) {
      setMessage1("Deactivation canceled by user");
      return;
    }

    fetch(
      `http://localhost:5134/api/AdminBankEmployees/DeactivateEmployee?employeeId=${employeeIdInput}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Employee Deactivated:", data);
        setMessage1("Employee Deactivated Successfully");
      })
      .catch((error) => {
        console.error("Error deactivating employee:", error);
        setMessage1("Employee with the given ID not found");
      });
  };

  const handleActivateEmployee = () => {
    if (employeeIdInput === "") {
      setMessage2("Employee ID cannot be empty");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to activate this employee?"
    );

    if (!confirmed) {
      setMessage2("Activation canceled by user");
      return;
    }

    fetch(
      `http://localhost:5134/api/AdminBankEmployees/ActivateEmployee?employeeId=${employeeIdInput}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Employee Activated:", data);
        setMessage2("Employee Activated Successfully");
      })
      .catch((error) => {
        console.error("Error activating employee:", error);
        setMessage2("Employee with the given ID not found");
      });
  };

  const handleInputChange = (event) => {
    setEmployeeIdInput(event.target.value);
  };

  const handleRegistrationInputChange = (event) => {
    const { name, value } = event.target;
    setRegistrationData({
      ...registrationData,
      [name]: value,
    });
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (registrationData.email && !emailRegex.test(registrationData.email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }, [registrationData.email]);

  useEffect(() => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (
      registrationData.password &&
      !passwordRegex.test(registrationData.password)
    ) {
      setPasswordError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character"
      );
    } else {
      setPasswordError("");
    }
  }, [registrationData.password]);

  const handleRegisterEmployee = () => {
    const requiredFields = ["email", "password", "name", "position", "phone"];
    const missingFields = requiredFields.filter(
      (field) => !registrationData[field]
    );

    if (missingFields.length > 0) {
      setMessage4(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    fetch("http://localhost:5134/api/AdminBankEmployees/RegisterBankEmployee", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(registrationData),
    }).then((response) => {
      if (response.ok) {
        setMessage4("Employee Registered Successfully !");
        alert("Employee registered successfully");
      } else {
        alert("Email already exists !");
      }
    });
  };

  const handleUpdateEmployee = () => {
    const requiredFields = ["position", "phone"];

    const missingFields = requiredFields.filter(
      (field) => !registrationData[field]
    );

    if (missingFields.length > 0) {
      setMessage3(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    fetch(
      `http://localhost:5134/api/AdminBankEmployees/UpdateBankEmployee?employeeId=${employeeIdInput}`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          position: registrationData.position,
          phone: registrationData.phone,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Update Response:", data);

        if (data && data.employeeID) {
          handleGetEmployeeById();
          setMessage3("Employee Updated");
        } else {
          setMessage3("Error Updating Employee");
        }
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
        setMessage3("Error Updating Employee");
      });
  };

  return (
    <div className="main">
      <div className="sidebar">
        <button onClick={() => setActiveCard("employeeInfo")}>
          Employee Info
        </button>
        <button onClick={() => setActiveCard("deactivateEmployee")}>
          Deactivate Employee
        </button>
        <button onClick={() => setActiveCard("activateEmployee")}>
          Activate Employee
        </button>
        <button onClick={() => setActiveCard("updateEmployee")}>
          Update Employee
        </button>
      </div>
      <div className="content">
        {activeCard === "employeeInfo" && (
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Show All Employees</h5>
                  <button
                    className="btn card-title"
                    onClick={handleShowData}
                    style={{
                      fontSize: "18px",
                      padding: "3px 8px",
                    }}
                  >
                    Show All Employees
                  </button>
                  <button
                    className="btn card-title"
                    onClick={handleClose}
                    style={{
                      fontSize: "18px",
                      padding: "3px 8px",
                      marginLeft: "10px",
                    }}
                  >
                    Close
                  </button>

                  {showData && (
                    <div>
                      <h2>All Employees</h2>
                      <ul>
                        {employees.map((employee) => (
                          <li key={employee.employeeID}>
                            <p>ID:{employee.employeeID}</p>
                            <p>Name: {employee.name}</p>
                            <p>Email: {employee.email}</p>
                            <p>Position: {employee.position}</p>
                            <p>Phone: {employee.phone}</p>
                            <hr />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Get Employee by ID</h5>
                  <div>
                    <label style={{ fontWeight: "bold" }}>
                      Select Employee ID:{" "}
                    </label>
                    <select
                      value={employeeIdInput}
                      onChange={handleInputChange}
                    >
                      <option value="">Select an employee ID</option>
                      {employeeIds.map((id) => (
                        <option key={id} value={id}>
                          {id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn card-title"
                    onClick={handleGetEmployeeById}
                    style={{
                      fontSize: "18px",
                      padding: "3px 8px",
                      marginTop: "20px",
                    }}
                  >
                    Get Employee by ID
                  </button>
                  {message && <p>{message}</p>}
                  {employeeById && (
                    <div>
                      <h2>Employee by ID</h2>
                      <p>Name: {employeeById.name}</p>
                      <p>Email: {employeeById.email}</p>
                      <p>Position: {employeeById.position}</p>
                      <p>Phone: {employeeById.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Register Employee</h5>
                  <div>
                    <label>Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                      name="email"
                      value={registrationData.email}
                      onChange={handleRegistrationInputChange}
                    />
                    {emailError && (
                      <div style={{ color: "red", marginTop: "5px" }}>
                        {emailError}
                      </div>
                    )}
                  </div>
                  <div>
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      name="password"
                      value={registrationData.password}
                      onChange={handleRegistrationInputChange}
                    />
                    {passwordError && (
                      <div style={{ color: "red", marginTop: "5px" }}>
                        {passwordError}
                      </div>
                    )}
                  </div>
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
                      name="name"
                      value={registrationData.name}
                      onChange={handleRegistrationInputChange}
                    />
                  </div>
                  <div>
                    <label>Position</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Position"
                      name="position"
                      value={registrationData.position}
                      onChange={handleRegistrationInputChange}
                    />
                  </div>
                  <div>
                    <label>Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone Number"
                      name="phone"
                      value={registrationData.phone}
                      onChange={handleRegistrationInputChange}
                    />
                  </div>
                  <button
                    className="btn card-title"
                    onClick={handleRegisterEmployee}
                    style={{
                      fontSize: "18px",
                      padding: "3px 8px",
                      marginTop: "20px",
                    }}
                  >
                    Register Employee
                  </button>
                  {message4 && <p>{message4}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCard === "deactivateEmployee" && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Deactivate Employee</h5>
              <div>
                <label style={{ fontWeight: "bold" }}>
                  Select Employee ID:{" "}
                </label>
                <select value={employeeIdInput} onChange={handleInputChange}>
                  <option value="">Select an employee ID</option>
                  {employeeIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn card-title"
                onClick={handleDeactivateEmployee}
                style={{
                  fontSize: "18px",
                  padding: "3px 8px",
                  marginTop: "20px",
                }}
              >
                Deactivate Employee
              </button>
              {message1 && <p>{message1}</p>}
            </div>
          </div>
        )}

        {activeCard === "activateEmployee" && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Activate Employee</h5>
              <div>
                <label style={{ fontWeight: "bold" }}>
                  Select Employee ID:{" "}
                </label>
                <select value={employeeIdInput} onChange={handleInputChange}>
                  <option value="">Select an employee ID</option>
                  {employeeIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn card-title"
                onClick={handleActivateEmployee}
                style={{
                  fontSize: "18px",
                  padding: "3px 8px",
                  marginTop: "20px",
                }}
              >
                Activate Employee
              </button>
              {message2 && <p>{message2}</p>}
            </div>
          </div>
        )}

        {activeCard === "updateEmployee" && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Update Employee</h5>
              <div>
                <label style={{ fontWeight: "bold" }}>
                  Select Employee ID:{" "}
                </label>
                <select value={employeeIdInput} onChange={handleInputChange}>
                  <option value="">Select an employee ID</option>
                  {employeeIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>New Position</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="New Position"
                  name="position"
                  value={registrationData.position}
                  onChange={handleRegistrationInputChange}
                />
              </div>
              <div>
                <label>New Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="New Phone Number"
                  name="phone"
                  value={registrationData.phone}
                  onChange={handleRegistrationInputChange}
                />
              </div>
              <button
                className="btn card-title"
                onClick={handleUpdateEmployee}
                style={{
                  fontSize: "18px",
                  padding: "3px 8px",
                  marginTop: "20px",
                }}
              >
                Update Employee
              </button>
              {message3 && <p>{message3}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBankEmployeeManagement;
