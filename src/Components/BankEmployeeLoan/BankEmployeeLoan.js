import React, { useState, useEffect } from "react";
import "../BankEmployeeLoan/BankEmployeeLoan.css";

function BankEmployeeLoan() {
  const [loanId, setLoanId] = useState("");
  const [loanData, setLoanData] = useState(null);
  const [accountCredit, setAccountCredit] = useState({});
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [disburseAccountNumber, setDisburseAccountNumber] = useState("");
  const [allLoans, setAllLoans] = useState([]);
  const [message, setMessage] = useState("");
  const [message1, setMessage1] = useState("");
  const [loanNotFound, setLoanNotFound] = useState("");
  const [err, setErr] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCard, setActiveCard] = useState("allLoans"); // Set default to 'allLoans'
  const token = sessionStorage.getItem("token");

  const handleCancel = () => {
    setLoanData("");
    setLoanNotFound("");
    setMessage("");
    setApproved("");
    setRejected("");
    setErr("");
    setMessage1("");
  };

  useEffect(() => {
    fetchAllLoans();
    // eslint-disable-next-line
  }, []);

  const filteredLoans = allLoans.filter((loan) => {
    const { loanID, customerID, status } = loan;
    const query = searchQuery.toLowerCase();
    return (
      loanID.toString().includes(query) ||
      customerID.toString().includes(query) ||
      status.toLowerCase().includes(query)
    );
  });

  const handleInputChange = (event) => {
    setLoanId(event.target.value);
  };

  const fetchAllLoans = () => {
    fetch("http://localhost:5134/api/BankEmployeeLoan/GetAllLoans", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => setAllLoans(data))
      .catch((error) => {
        console.error("Error fetching all loans:", error);
      });
  };

  const reviewLoanApplication = () => {
    fetch(
      `http://localhost:5134/api/BankEmployeeLoan/ReviewLoanApplication/${loanId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setLoanData(data);
        setLoanNotFound("");
      })
      .catch((error) => {
        console.error("Error reviewing loan application:", error);
        setLoanData("");
        setLoanNotFound("Loan Id not found");
      });
  };

  const checkCredit = (accountNumber) => {
    fetch(
      `http://localhost:5134/api/BankEmployeeLoan/check-credit/${accountNumber}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("No Transactions");
        }
      })
      .then((data) => {
        setAccountCredit((prevState) => ({
          ...prevState,
          [accountNumber]: data.value,
        }));
        setDisburseAccountNumber(accountNumber);
      })
      .catch((error) => {
        console.error("Error checking credit:", error);
        alert("No Transactions");
      });
  };

  const makeLoanDecision = () => {
    if (!approved && !rejected) {
      alert("Please approve or reject the loan.");
      return;
    }
    fetch(
      `http://localhost:5134/api/BankEmployeeLoan/MakeLoanDecision/${loanId}?approved=${approved}`,
      {
        method: "POST",
        headers: {
          accept: "text/plain",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        setMessage(data);
      })
      .catch((error) => console.error("Error making loan decision:", error));
  };

  const disburseLoan = () => {
    if (loanId === "") {
      setErr("Loan Id is needed");
      return;
    }
    if (disburseAccountNumber === "") {
      setErr("Account Number needed");
      return;
    }
    fetch(
      `http://localhost:5134/api/BankEmployeeLoan/ReviewLoanApplication/${loanId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "Rejected") {
          setErr("Cannot Disburse Loan: Loan application is rejected");
        } else if (data.status === "Pending") {
          setErr("Cannot Disburse Loan: Loan application status is pending");
        } else if (data.status === "Disbursed") {
          setErr("Cannot Disburse Loan: Loan already disbursed");
        } else {
          fetch(
            `http://localhost:5134/api/BankEmployeeLoan/disburse-loan/${loanId}/${disburseAccountNumber}`,
            {
              method: "POST",
              headers: {
                accept: "text/plain",
                Authorization: "Bearer " + token,
              },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              setMessage1("Loan Disbursed");
              setErr("");
            })
            .catch((error) => {
              console.error("Error disbursing loan:", error);
              setMessage1("");
              setErr("Account Not Active");
            });
        }
      })
      .catch((error) => {
        console.error("Error checking loan status:", error);
        setErr("Error checking loan status");
      });
  };

  return (
    <div className="main">
      <div className="sidebar">
        <button onClick={() => setActiveCard("allLoans")}>All Loans</button>
        <button onClick={() => setActiveCard("reviewLoan")}>
          Review Loan Application
        </button>
        <button onClick={() => setActiveCard("decisionAndDisburse")}>
          Loan Decision & Disburse
        </button>
      </div>
      <div className="content">
        {activeCard === "allLoans" && (
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">All Loans</h3>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by Loan ID, Customer ID, or Status"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ul className="list-group">
                {filteredLoans.map((loan) => (
                  <li key={loan.loanID} className="list-group-item">
                    Loan ID: {loan.loanID}, Loan Amount: {loan.loanAmount},
                    Status: {loan.status}, Customer ID: {loan.customerID}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeCard === "reviewLoan" && (
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">
                Review Loan Application and Check Credit
              </h3>
              <div className="form-group">
                <label htmlFor="loanId">Loan ID:</label>
                <select
                  className="form-control"
                  id="loanId"
                  value={loanId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a Loan ID</option>
                  {allLoans.map((loan) => (
                    <option key={loan.loanID} value={loan.loanID}>
                      {loan.loanID}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button className="btn buttons" onClick={reviewLoanApplication}>
                  Review Loan Application
                </button>
                <button className="btn cancel" onClick={handleCancel}>
                  Close
                </button>
              </div>
              {loanNotFound && <p>{loanNotFound}</p>}

              {loanData && (
                <div className="mt-3">
                  <div className="card">
                    <div className="card-body">
                      <h4>Loan Details</h4>
                      <p>Loan ID: {loanData.loanID}</p>
                      <p>Loan Amount: {loanData.loanAmount}</p>
                      <p>Loan Type: {loanData.loanType}</p>
                      <p>Interest: {loanData.interest}</p>
                      <p>Tenure: {loanData.tenure}</p>
                      <p>Purpose: {loanData.purpose}</p>
                      <p>Status: {loanData.status}</p>
                      <p>Customer ID: {loanData.customerID}</p>
                      <div>
                        <h5>Customer Accounts</h5>
                        <ul>
                          {loanData.customers.accounts
                            .filter((account) => account.status !== "Inactive")
                            .map((account) => (
                              <li key={account.accountNumber}>
                                Account Number: {account.accountNumber},
                                Balance: {account.balance}
                                <button
                                  onClick={() =>
                                    checkCredit(account.accountNumber)
                                  }
                                >
                                  Check Credit
                                </button>
                                <hr />
                                {accountCredit[account.accountNumber] && (
                                  <div>
                                    <p>
                                      Total Inbound:{" "}
                                      {
                                        accountCredit[account.accountNumber]
                                          .inboundAmount
                                      }
                                    </p>
                                    <p>
                                      Total Outbound :{" "}
                                      {
                                        accountCredit[account.accountNumber]
                                          .outboundAmount
                                      }
                                    </p>
                                    <p>
                                      Credit Score:{" "}
                                      {
                                        accountCredit[account.accountNumber]
                                          .creditScore
                                      }
                                    </p>
                                  </div>
                                )}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeCard === "decisionAndDisburse" && (
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Make Loan Decision & Disburse</h3>
              <div className="form-group">
                <label htmlFor="decisionLoanId">Loan ID:</label>
                <input
                  type="number"
                  className="form-control"
                  id="decisionLoanId"
                  value={loanId}
                  onChange={handleInputChange}
                />
              </div>
              <label htmlFor="approved">Approved:</label>
              <input
                type="checkbox"
                id="approved"
                checked={approved}
                onChange={() => {
                  setApproved(!approved);
                  if (rejected) setRejected(false);
                }}
              />
              <label htmlFor="rejected">Rejected:</label>
              <input
                type="checkbox"
                id="rejected"
                checked={rejected}
                onChange={() => {
                  setRejected(!rejected);
                  if (approved) setApproved(false);
                }}
              />
              <div>
                <button className="btn buttons" onClick={makeLoanDecision}>
                  Make Loan Decision
                </button>
                <button className="btn cancel" onClick={handleCancel}>
                  Close
                </button>
              </div>
              {message && <p>{message}</p>}

              <div className="form-group">
                <label htmlFor="disburseAccountNumber">Account Number:</label>
                <input
                  type="number"
                  className="form-control"
                  id="disburseAccountNumber"
                  value={disburseAccountNumber}
                  onChange={(e) => setDisburseAccountNumber(e.target.value)}
                  readOnly
                />
              </div>
              <div>
                <button className="btn buttons" onClick={disburseLoan}>
                  Disburse Loan
                </button>
                <button className="btn cancel" onClick={handleCancel}>
                  Close
                </button>
              </div>
              {message1 && <p>{message1}</p>}
              {err && <p>{err}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BankEmployeeLoan;
