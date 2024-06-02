import React, { useState, useEffect } from "react";
import "../Customer/Customer.css";

function Customer() {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const token = sessionStorage.getItem("token");
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [activeCard, setActiveCard] = useState("customerInfo");

  const handleCancel = () => {
    setMessage1("");
    setMessage2("");
    setMessage3("");
    setMessage("");
  };

  useEffect(() => {
    const emailFromStorage = sessionStorage.getItem("email");
    setEmail(emailFromStorage);
  }, []);

  useEffect(() => {
    if (email) {
      fetch(
        `http://localhost:5134/api/Customer/GetCustomerInfoByEmail?email=${email}`
      )
        .then((response) => response.json())
        .then((data) => {
          setCustomerInfo(data);
          sessionStorage.setItem("customerId", data.customerID);
        });
    }
  }, [email]);

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      setMessage3("New Password and Confirm Password must match.");
      return;
    }
    if (newPassword === "") {
      setMessage3("New Password Cannot be empty");
      return;
    }
    if (confirmPassword === "") {
      setMessage3("New Password Cannot be empty");
      return;
    }
    fetch(
      `http://localhost:5134/api/Customer/UpdatePassword?email=${email}&newPassword=${newPassword}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    )
      .then((response) => response.text())
      .then((data) => {
        setMessage3(data);
        setNewPassword("");
        setConfirmPassword("");
      });
  };

  const handleChangePhoneNumber = () => {
    if (phone === "") {
      setMessage("Field Cannot be Empty.");
      return;
    }
    if (phone.length < 10) {
      setMessage("Phone Number Should Have 10 Digits");
      return;
    }
    if (customerInfo) {
      const customerId = customerInfo.customerID;

      fetch(
        `http://localhost:5134/api/Customer/ChangePhoneNumber?id=${customerId}&phone=${phone}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({}),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setCustomerInfo((prevCustomerInfo) => ({
            ...prevCustomerInfo,
            phoneNumber: data.phoneNumber,
          }));
          setMessage("Phone Number changed successfully.");
        });
    }
  };

  const handleChangeName = () => {
    if (name === "") {
      setMessage1("Name Cannot be Empty");
      return;
    }
    if (customerInfo) {
      if (name === customerInfo.name) {
        setMessage1("New name is the same as the current name.");
        return;
      }
      const customerId = customerInfo.customerID;
      fetch(
        `http://localhost:5134/api/Customer/ChangeName?id=${customerId}&name=${name}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({}),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setCustomerInfo((prevCustomerInfo) => ({
            ...prevCustomerInfo,
            name: data.name,
          }));
          setMessage1("Name changed successfully.");
        });
    }
  };

  const handleChangeAddress = () => {
    if (address === "") {
      setMessage2("Address cannot be Empty");
      return;
    }
    if (customerInfo) {
      const customerId = customerInfo.customerID;
      fetch(
        `http://localhost:5134/api/Customer/ChangeAddress?id=${customerId}&address=${address}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({}),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setCustomerInfo((prevCustomerInfo) => ({
            ...prevCustomerInfo,
            address: data.address,
          }));
          setMessage2("Address changed successfully.");
        });
    }
  };

  return (
    <div className="main">
      <div className="sidebar">
        <button onClick={() => setActiveCard("customerInfo")}>
          Customer Info
        </button>
        <button onClick={() => setActiveCard("passwordReset")}>
          Password Reset
        </button>
        <button onClick={() => setActiveCard("changePhoneNumber")}>
          Change Phone Number
        </button>
        <button onClick={() => setActiveCard("changeName")}>Change Name</button>
        <button onClick={() => setActiveCard("changeAddress")}>
          Change Address
        </button>
      </div>
      <div className="content">
        {activeCard === "customerInfo" && customerInfo && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Customer Information</h2>
              <div>
                <p>
                  <strong>Name:</strong> {customerInfo.name}
                </p>
                <p>
                  <strong>Customer Id:</strong> {customerInfo.customerID}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {customerInfo.dob}
                </p>
                <p>
                  <strong>Age:</strong> {customerInfo.age}
                </p>
                <p>
                  <strong>Phone Number:</strong> {customerInfo.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong> {customerInfo.address}
                </p>
                <p>
                  <strong>Email:</strong> {customerInfo.email}
                </p>
              </div>
            </div>
          </div>
        )}
        {activeCard === "passwordReset" && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Password Reset</h2>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button onClick={handleResetPassword} className="btn buttons">
                Reset Password
              </button>
              <button
                onClick={handleCancel}
                className="btn cancel mt-1 mx-auto"
              >
                Cancel
              </button>
              {message3 && <p>{message3}</p>}
            </div>
          </div>
        )}
        {activeCard === "changePhoneNumber" && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Change Phone Number</h2>
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="number"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button onClick={handleChangePhoneNumber} className="btn buttons">
                Change Phone Number
              </button>
              <button onClick={handleCancel} className="btn cancel mt-1">
                Cancel
              </button>
              {message && <p>{message}</p>}
            </div>
          </div>
        )}
        {activeCard === "changeName" && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Change Name</h2>
              <div className="form-group">
                <label>New Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <button onClick={handleChangeName} className="btn buttons">
                Change Name
              </button>
              <button
                onClick={handleCancel}
                className="btn cancel mt-1 mx-auto"
              >
                Cancel
              </button>
              {message1 && <p>{message1}</p>}
            </div>
          </div>
        )}
        {activeCard === "changeAddress" && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Change Address</h2>
              <div className="form-group">
                <label>New Address:</label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <button onClick={handleChangeAddress} className="btn buttons">
                Change Address
              </button>
              <button
                onClick={handleCancel}
                className="btn cancel mt-1 mx-auto"
              >
                Cancel
              </button>
              {message2 && <p>{message2}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customer;
