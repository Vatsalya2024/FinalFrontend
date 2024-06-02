import React, { useState, useEffect } from "react";

function CustomerAccount() {
  const [accountType, setAccountType] = useState("");
  const [ifsc, setIFSC] = useState("");
  const [accountNumberToClose, setAccountNumberToClose] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);
  const [customerAccounts, setCustomerAccounts] = useState([]);
  const [openAccountStatus, setOpenAccountStatus] = useState("");
  const [closeAccountStatus, setCloseAccountStatus] = useState("");
  const [openAccountError, setOpenAccountError] = useState("");
  const [closeAccountError, setCloseAccountError] = useState("");
  const [getAccountDetailsError, setGetAccountDetailsError] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranchIFSC, setSelectedBranchIFSC] = useState("");
  const [depositAlertShown, setDepositAlertShown] = useState(false);
  const [accountStatement, setAccountStatement] = useState(null);
  const [getAccountStatementError, setGetAccountStatementError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeSection, setActiveSection] = useState("openAccount"); // Set initial state to 'openAccount'
  const accountTypes = ["Savings", "Current", "Business"];
  const token = sessionStorage.getItem("token");
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    fetchCustomerAccounts();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    fetchBranches();
  }, []);
  useEffect(() => {
    const inactiveAccounts = customerAccounts.filter(
      (account) => account.status === "Active" && account.balance === 0
    );
    if (inactiveAccounts.length > 0 && !depositAlertShown) {
      alert("Please deposit money to your account.");
      setDepositAlertShown(true);
    }
  }, [customerAccounts, depositAlertShown]);

  const fetchBranches = () => {
    fetch("http://localhost:5134/api/Branches/GetAllBranches", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch branches");
      })
      .then((data) => {
        setBranches(data.filter((branch) => branch.banks.bankID === 1));
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  const fetchCustomerAccounts = () => {
    fetch(
      `http://localhost:5134/api/CustomerAccount/GetAccountDetailsByCustomerId?customerId=${customerId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch customer accounts");
      })
      .then((data) => {
        setCustomerAccounts(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        setCustomerAccounts([]);
      });
  };

  const handleOpenAccount = () => {
    if (accountType === "") {
      setOpenAccountError("Account Type is required");
      return;
    }
    if (ifsc === "") {
      setOpenAccountError("IFSC Code is required");
      return;
    }
    const requestBody = {
      accountType: accountType,
      ifsc: ifsc,
      customerID: customerId,
    };

    fetch("http://localhost:5134/api/CustomerAccount/Open%20Account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to open account");
      })
      .then((data) => {
        setOpenAccountStatus("Account opening request sent.");
        setOpenAccountError("");
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        setOpenAccountError("Failed to open account ");
        setOpenAccountStatus("");
      });
  };

  const handleCloseAccount = () => {
    if (!accountNumberToClose) {
      setCloseAccountError("Account number is required");
      return;
    }
    const confirmClose = window.confirm(
      "Are you sure you want to close this account?"
    );
    if (!confirmClose) {
      return;
    }

    fetch(
      `http://localhost:5134/api/CustomerAccount/Close%20Account?accountNumber=${accountNumberToClose}`,
      {
        method: "POST",
        headers: {
          accept: "text/plain",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          setCloseAccountStatus("Account closing request sent.");
          return response.text();
        }
        throw new Error("Failed to close account.Transfer Remaining Money");
      })
      .then((data) => {})
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        setCloseAccountError(error.message);
      });
  };

  const handleGetAccountDetails = () => {
    fetch(
      `http://localhost:5134/api/CustomerAccount/${accountNumber}/${customerId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Enter account number");
      })
      .then((data) => {
        setAccountDetails(data);
        setGetAccountDetailsError("");
      })
      .catch((error) => {
        setAccountDetails(null);
        setGetAccountDetailsError(error.message);
      });
  };

  const handleCancel = () => {
    setAccountType("");
    setOpenAccountStatus("");
    setCloseAccountStatus("");
    setOpenAccountError("");
    setCloseAccountError("");
    setGetAccountDetailsError("");
    setAccountNumberToClose("");
    setAccountNumber("");
    setIFSC("");
    setAccountDetails("");
    setActiveSection("");
  };

  const handleGetAccountStatement = () => {
    if (!accountNumber) {
      setGetAccountStatementError("Account number is required");
      return;
    }

    fetch(
      `http://localhost:5134/api/CustomerTransaction/AccountStatement?accountNumber=${accountNumber}&startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch account statement");
      })
      .then((data) => {
        setAccountStatement(data);
        setGetAccountStatementError("");
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        setAccountStatement(null);
        setGetAccountStatementError(error.message);
      });
  };

  return (
    <div className="main">
      <div className="sidebar">
        <button onClick={() => setActiveSection("openAccount")}>
          Open Account
        </button>
        <button onClick={() => setActiveSection("closeAccount")}>
          Close Account
        </button>
        <button onClick={() => setActiveSection("getAccountDetails")}>
          Get Account Details
        </button>
        <button onClick={() => setActiveSection("getCustomerAccounts")}>
          Get Customer Accounts
        </button>
        <button onClick={() => setActiveSection("getAccountStatement")}>
          Get Account Statement
        </button>
      </div>
      <div className="content">
        {activeSection === "openAccount" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Open Account</h5>
              <label className="jj mb-2">Select Account Type</label>
              <select
                className="form-control"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="">Select</option>
                {accountTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <br />
              <label>Select Branch</label>
              <select
                className="form-control"
                value={selectedBranchIFSC}
                onChange={(e) => {
                  const selectedIFSC = e.target.value;
                  setSelectedBranchIFSC(selectedIFSC);
                  setIFSC(selectedIFSC);
                }}
              >
                <option value="">Select</option>
                {branches.map((branch) => (
                  <option key={branch.ifscNumber} value={branch.ifscNumber}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
              <br />
              <button className="btn buttons" onClick={handleOpenAccount}>
                Open Account
              </button>
              <button onClick={handleCancel} className="btn buttons mt-1">
                Cancel
              </button>
              <p>{openAccountStatus}</p>
              <p>{openAccountError}</p>
            </div>
          </div>
        )}
        {activeSection === "closeAccount" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Close Account</h5>
              <label>Select Account Number</label>
              <select
                className="form-control"
                value={accountNumberToClose}
                onChange={(e) => setAccountNumberToClose(e.target.value)}
              >
                <option value="">Select</option>
                {customerAccounts.map((account) => (
                  <option
                    key={account.accountNumber}
                    value={account.accountNumber}
                  >
                    {account.accountNumber}
                  </option>
                ))}
              </select>
              <br />
              <button className="btn buttons" onClick={handleCloseAccount}>
                Close Account
              </button>
              <button className="btn buttons  mt-1" onClick={handleCancel}>
                Cancel
              </button>
              <p>{closeAccountStatus}</p>
              <p>{closeAccountError}</p>
            </div>
          </div>
        )}
        {activeSection === "getAccountDetails" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Get Account Details</h5>
              <label>Select Account Number</label>
              <select
                className="form-control"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              >
                <option value="">Select</option>
                {customerAccounts.map((account) => (
                  <option
                    key={account.accountNumber}
                    value={account.accountNumber}
                  >
                    {account.accountNumber}
                  </option>
                ))}
              </select>
              <br />
              <button className="btn buttons" onClick={handleGetAccountDetails}>
                Get Account Details
              </button>
              <button className="btn cancel mt-1" onClick={handleCancel}>
                Cancel
              </button>
              <br />
              <p>{getAccountDetailsError}</p>
              {accountDetails && (
                <div>
                  <p>Account Number: {accountDetails.accountNumber}</p>
                  <p>Balance: {accountDetails.balance}</p>
                  <p>Account Type: {accountDetails.accountType}</p>
                  <p>Status: {accountDetails.status}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {activeSection === "getCustomerAccounts" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Get Customer Accounts</h5>
              {customerAccounts.length > 0 && (
                <div>
                  <h6 className="mt-3">Customer Accounts:</h6>
                  {customerAccounts.map((account) => (
                    <div key={account.accountNumber}>
                      <p>Account Number: {account.accountNumber}</p>
                      <p>Balance: {account.balance}</p>
                      <p>Account Type: {account.accountType}</p>
                      <p>Status: {account.status}</p>
                      <hr />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeSection === "getAccountStatement" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Get Account Statement</h5>
              <label>Select Account Number</label>
              <select
                className="form-control"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              >
                <option value="">Select</option>
                {customerAccounts.map((account) => (
                  <option
                    key={account.accountNumber}
                    value={account.accountNumber}
                  >
                    {account.accountNumber}
                  </option>
                ))}
              </select>
              <br />
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <br />
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <br />
              <button
                className="btn buttons"
                onClick={handleGetAccountStatement}
              >
                Get Account Statement
              </button>
              <button className="btn cancel mt-1" onClick={handleCancel}>
                Cancel
              </button>
              <br />
              <p>{getAccountStatementError}</p>
              {accountStatement && (
                <div>
                  <p>Credit Score: {accountStatement.creditScore}</p>
                  <p>Total Debit ₹: {accountStatement.totalDebit}</p>
                  <p>Total Credit ₹: {accountStatement.totalCredit}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerAccount;
