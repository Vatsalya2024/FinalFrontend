import React, { useState, useEffect } from "react";
import "../CustomerLoan/CustomerLoan.css"; // Importing CSS for styling

// Main React component for handling customer loans
function CustomerLoan() {
  // State variables for managing loan details and UI elements
  const [loanAmount, setLoanAmount] = useState("");
  const [loanType, setLoanType] = useState("");
  const [interest, setInterest] = useState("");
  const [tenure, setTenure] = useState("");
  const [purpose, setPurpose] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [availedLoans, setAvailedLoans] = useState([]);
  const [availableLoans, setAvailableLoans] = useState([]);
  const [selectedAvailableLoan, setSelectedAvailableLoan] = useState(null);
  const customerId = sessionStorage.getItem("customerId"); // Retrieve customer ID from session storage
  const token = sessionStorage.getItem("token"); // Retrieve auth token from session storage
  const [err, setErr] = useState("");
  const [noAvailableLoans, setNoAvailableLoans] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("availableLoans"); // State to manage active UI section

  // Effect hook to fetch available loans on component mount
  useEffect(() => {
    handleGetAvailableLoans();
  }, []);

  // Function to reset form and error states
  const handleCancel = () => {
    setErr("");
    setSuccessMessage("");
    setAvailedLoans([]);
    setLoanAmount("");
    setLoanType("");
    setInterest("");
    setTenure("");
    setPurpose("");
  };

  // Function to handle loan application
  const handleApplyForLoan = () => {
    if (!selectedAvailableLoan) {
      setErr("Please select a loan to apply.");
      return;
    }

    const requestBody = {
      loanAmount: selectedAvailableLoan.loanAmount,
      loanType: selectedAvailableLoan.loanType,
      interest: selectedAvailableLoan.interest,
      tenure: selectedAvailableLoan.tenure,
      purpose: purpose,
      customerID: customerId,
    };

    if (
      loanAmount === "" ||
      loanType === "" ||
      interest === "" ||
      tenure === "" ||
      purpose === ""
    ) {
      setErr("Fill all the fields");
      return;
    }

    fetch("http://localhost:5134/api/CustomerLoan/ApplyForLoan", {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.text())
      .then((data) => {
        setSuccessMessage(data);
        setErr("");
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        setErr("Please Fill the details");
      });
  };

  // Function to fetch availed loans
  const handleGetAvailedLoans = () => {
    fetch(
      `http://localhost:5134/api/CustomerLoan/AvailedLoans?customerId=${customerId}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setAvailedLoans(data);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  // Function to fetch available loans
  const handleGetAvailableLoans = () => {
    fetch("http://localhost:5134/api/AvailableLoansUser/getAllLoans", {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setNoAvailableLoans(true);
        } else {
          setAvailableLoans(data);
          setNoAvailableLoans(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  const filteredAvailableLoans = availableLoans.filter((loan) =>
    loan.loanType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle loan selection
  const handleSelectAvailableLoan = (loan) => {
    setSelectedAvailableLoan(loan);
    setLoanAmount(loan.loanAmount);
    setLoanType(loan.loanType);
    setInterest(loan.interest);
    setTenure(loan.tenure);
    setErr("");

    // Show alert and navigate to "Apply for Loan" section
    if (window.confirm("Do you want to apply for this loan?")) {
      setActiveSection("applyLoan");
    }
  };

  // Render function to display UI
  return (
    <div className="main">
      <div className="sidebar">
        <button onClick={() => setActiveSection("availableLoans")}>
          Available Loans
        </button>
        <button onClick={() => setActiveSection("applyLoan")}>
          Apply for Loan
        </button>
        <button onClick={() => setActiveSection("availedLoans")}>
          Availed Loans
        </button>
      </div>
      <div className="content">
        {activeSection === "availableLoans" && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Available Loans</h2>
              <input
                type="text"
                placeholder="Search by loan type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {noAvailableLoans ? (
                <p>No available loans.</p>
              ) : (
                <div>
                  {filteredAvailableLoans.map((loan, index) => (
                    <div key={index} className="mb-3">
                      <p>
                        <b>Loan Amount: </b>
                        {loan.loanAmount}
                      </p>
                      <p>
                        <strong>Loan Type:</strong> {loan.loanType}
                      </p>
                      <p>
                        <strong>Interest (in %):</strong> {loan.interest}
                      </p>
                      <p>
                        <strong>Tenure (in years):</strong> {loan.tenure}
                      </p>
                      <button
                        className="btn buttons"
                        onClick={() => handleSelectAvailableLoan(loan)}
                      >
                        Select
                      </button>
                      <hr />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeSection === "applyLoan" && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Apply For Loan</h2>
              <div className="mb-3">
                <label className="form-label">Loan Amount:</label>
                <input
                  type="Number"
                  className="form-control"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Loan Type:</label>
                <input
                  type="text"
                  className="form-control"
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Interest(%):</label>
                <input
                  type="Number"
                  className="form-control"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tenure(in years):</label>
                <input
                  type="Number"
                  className="form-control"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Purpose:</label>
                <input
                  type="text"
                  className="form-control"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>
              <button className="btn buttons" onClick={handleApplyForLoan}>
                Apply for Loan
              </button>
              <button className="btn cancel" onClick={handleCancel}>
                Close
              </button>
              {err && <p>{err}</p>}
              {successMessage && <p className="mt-3">{successMessage}</p>}
            </div>
          </div>
        )}
        {activeSection === "availedLoans" && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Availed Loans</h2>
              <div className="button-container">
                <button
                  className="btn buttons mb-3"
                  onClick={handleGetAvailedLoans}
                >
                  Get Availed Loans
                </button>
                <button className="btn cancel" onClick={handleCancel}>
                  Close
                </button>
              </div>
              <div>
                {availedLoans.length > 0 &&
                  availedLoans.map((loan, index) => (
                    <div key={index} className="mb-3">
                      <p>Loan ID: {loan.loanID}</p>
                      <p>Loan Amount: {loan.loanAmount}</p>
                      <p>Loan Type: {loan.loanType}</p>
                      <p>Interest: {loan.interest}</p>
                      <p>Tenure: {loan.tenure}</p>
                      <p>Purpose: {loan.purpose}</p>
                      <p>Status: {loan.status}</p>
                      <hr />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerLoan;
