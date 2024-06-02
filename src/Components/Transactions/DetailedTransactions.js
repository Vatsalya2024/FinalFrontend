import React, { useState, useEffect } from "react";
import "./Transaction.css";

function DetailedTransactions() {
  const [customerId, setCustomerId] = useState("");
  const [customerAccounts, setCustomerAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [last10Transactions, setLast10Transactions] = useState([]);
  const [lastMonthTransactions, setLastMonthTransactions] = useState([]);
  const token = sessionStorage.getItem("token");
  const [err, setErr] = useState("");
  const [err1, setErr1] = useState("");
  const [err2, setErr2] = useState("");
  const [activeSection, setActiveSection] = useState(
    "transactionsBetweenDates"
  ); // State to manage active section

  useEffect(() => {
    const storedCustomerId = sessionStorage.getItem("customerId");
    if (storedCustomerId) {
      setCustomerId(storedCustomerId);
      fetchCustomerAccounts(storedCustomerId);
    }
  }, [customerId]);

  const fetchCustomerAccounts = (customerId) => {
    fetch(
      `http://localhost:5134/api/CustomerAccount/GetAccountDetailsByCustomerId?customerId=${customerId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
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
        setErr("");
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        setCustomerAccounts([]);
        setErr("No Accounts Found");
      });
  };

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value);
    setAccountNumber(event.target.value);
  };

  const handleCancel = () => {
    setTransactions([]);
    setErr("");
    setLast10Transactions([]);
    setErr1("");
    setLastMonthTransactions([]);
    setErr2("");
  };

  const fetchTransactionsBetweenDates = () => {
    if (!accountNumber || !startDate || !endDate) {
      setErr("Please fill in all fields");
      return;
    }
    if (startDate > endDate) {
      setErr("Start date should be less than end date");
      return;
    }

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    fetch(
      `http://localhost:5134/api/CustomerTransaction/TransactionsBetweenDates?accountNumber=${accountNumber}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setTransactions(data);
        setErr("");
      })
      .catch((error) => {
        setErr("No transactions found");
        setTransactions([]);
      });
  };

  const fetchLast10Transactions = () => {
    if (!accountNumber) {
      setErr1("Please provide an account number");
      return;
    }

    fetch(
      `http://localhost:5134/api/CustomerTransaction/Last10Transactions?accountNumber=${accountNumber}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setLast10Transactions(data);
        setErr1("");
      })
      .catch((error) => {
        console.error("Error fetching last 10 transactions:", error);
        setLast10Transactions([]);
        setErr1("No transactions found");
      });
  };

  const fetchLastMonthTransactions = () => {
    if (!accountNumber) {
      setErr2("Please provide an account number");
      return;
    }

    fetch(
      `http://localhost:5134/api/CustomerTransaction/LastMonthTransactions?accountNumber=${accountNumber}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setLastMonthTransactions(data);
        setErr2("");
      })
      .catch((error) => {
        setLastMonthTransactions([]);
        setErr2("No transactions for last month", error);
      });
  };

  return (
    <div className="main">
      <div className="sidebar">
        <button onClick={() => setActiveSection("transactionsBetweenDates")}>
          Transactions Between Dates
        </button>
        <button onClick={() => setActiveSection("last10Transactions")}>
          Last 10 Transactions
        </button>
        <button onClick={() => setActiveSection("lastMonthTransactions")}>
          Last Month Transactions
        </button>
      </div>
      <div className="content">
        {activeSection === "transactionsBetweenDates" && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Transactions Between Dates</h2>
              <div className="input-group">
                <label className="labels">Account Number:</label>
                <select value={selectedAccount} onChange={handleAccountChange}>
                  <option value="">Select Account</option>
                  {customerAccounts
                    .filter((account) => account.status !== "Inactive")
                    .map((account) => (
                      <option
                        key={account.accountNumber}
                        value={account.accountNumber}
                      >
                        {account.accountNumber}
                      </option>
                    ))}
                </select>
              </div>
              <div className="input-group">
                <label className="labels">Start Date:</label>
                <input
                  type="date"
                  value={startDate.toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="labels">End Date:</label>
                <input
                  type="date"
                  value={endDate.toISOString().split("T")[0]}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                />
              </div>
              <div className="button-container">
                <button
                  className="btn buttons"
                  onClick={fetchTransactionsBetweenDates}
                >
                  Fetch Transactions
                </button>
                <button className="btn cancel" onClick={handleCancel}>
                  Close
                </button>
              </div>
              {err && <p>{err}</p>}
              <div className="transactions-list">
                {transactions.map((transaction) => (
                  <div key={transaction.transactionID} className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Transaction ID: {transaction.transactionID}
                      </h5>
                      <p className="card-text">Amount: {transaction.amount}</p>
                      <hr />
                      <p className="card-text">
                        Transaction Date: {transaction.transactionDate}
                      </p>
                      <hr />
                      <p className="card-text">
                        Description: {transaction.description}
                      </p>
                      <hr />
                      <p className="card-text">
                        Transaction Type: {transaction.transactionType}
                      </p>
                      <hr />
                      <p className="card-text">Status: {transaction.status}</p>
                      <hr />
                      <p className="card-text">
                        Source Account Number: {transaction.sourceAccountNumber}
                      </p>
                      <hr />
                      <p className="card-text">
                        Destination Account Number:{" "}
                        {transaction.destinationAccountNumber}
                      </p>
                      <hr />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeSection === "last10Transactions" && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Last 10 Transactions</h2>
              <div className="input-group">
                <label className="labels">Account Number:</label>
                <select value={selectedAccount} onChange={handleAccountChange}>
                  <option value="">Select Account</option>
                  {customerAccounts
                    .filter((account) => account.status !== "Inactive")
                    .map((account) => (
                      <option
                        key={account.accountNumber}
                        value={account.accountNumber}
                      >
                        {account.accountNumber}
                      </option>
                    ))}
                </select>
              </div>
              <div className="button-container">
                <button
                  className="btn buttons"
                  onClick={fetchLast10Transactions}
                >
                  Fetch Last 10 Transactions
                </button>
                <button className="btn cancel" onClick={handleCancel}>
                  Close
                </button>
              </div>
              {err1 && <p>{err1}</p>}
              <div className="transactions-list">
                {last10Transactions.map((transaction) => (
                  <div key={transaction.transactionID} className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Transaction ID: {transaction.transactionID}
                      </h5>
                      <p className="card-text">Amount: {transaction.amount}</p>
                      <hr />
                      <p className="card-text">
                        Transaction Date: {transaction.transactionDate}
                      </p>
                      <hr />
                      <p className="card-text">
                        Description: {transaction.description}
                      </p>
                      <hr />
                      <p className="card-text">
                        Transaction Type: {transaction.transactionType}
                      </p>
                      <hr />
                      <p className="card-text">Status: {transaction.status}</p>
                      <hr />
                      <p className="card-text">
                        Source Account Number: {transaction.sourceAccountNumber}
                      </p>
                      <hr />
                      <p className="card-text">
                        Destination Account Number:{" "}
                        {transaction.destinationAccountNumber}
                      </p>
                      <hr />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeSection === "lastMonthTransactions" && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Last Month Transactions</h2>
              <div className="input-group">
                <label className="labels">Account Number:</label>
                <select value={selectedAccount} onChange={handleAccountChange}>
                  <option value="">Select Account</option>
                  {customerAccounts
                    .filter((account) => account.status !== "Inactive")
                    .map((account) => (
                      <option
                        key={account.accountNumber}
                        value={account.accountNumber}
                      >
                        {account.accountNumber}
                      </option>
                    ))}
                </select>
              </div>
              <div className="button-container">
                <button
                  className="btn buttons"
                  onClick={fetchLastMonthTransactions}
                >
                  Fetch Last Month Transactions
                </button>
                <button className="btn cancel" onClick={handleCancel}>
                  Close
                </button>
              </div>
              {err2 && <p>{err2}</p>}
              <div className="transactions-list">
                {lastMonthTransactions.map((transaction) => (
                  <div key={transaction.transactionID} className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Transaction ID: {transaction.transactionID}
                      </h5>
                      <p className="card-text">Amount: {transaction.amount}</p>
                      <hr />
                      <p className="card-text">
                        Transaction Date: {transaction.transactionDate}
                      </p>
                      <hr />
                      <p className="card-text">
                        Description: {transaction.description}
                      </p>
                      <hr />
                      <p className="card-text">
                        Transaction Type: {transaction.transactionType}
                      </p>
                      <hr />
                      <p className="card-text">Status: {transaction.status}</p>
                      <hr />
                      <p className="card-text">
                        Source Account Number: {transaction.sourceAccountNumber}
                      </p>
                      <hr />
                      <p className="card-text">
                        Destination Account Number:{" "}
                        {transaction.destinationAccountNumber}
                      </p>
                      <hr />
                    </div>
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

export default DetailedTransactions;
