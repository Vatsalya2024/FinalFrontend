import React, { useState, useEffect } from "react";
import "./BankEmployeeTransaction.css";

function BankEmployeeTransaction() {
  const [customerId, setCustomerId] = useState("");
  const [allCustomerIds, setAllCustomerIds] = useState([]);
  const [customerAccounts, setCustomerAccounts] = useState([]);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [inboundAmount, setInboundAmount] = useState(null);
  const [outboundAmount, setOutboundAmount] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [errMessage, setErrMessage] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchAllCustomers();
    // eslint-disable-next-line
  }, []);

  const fetchAllCustomers = () => {
    fetch("http://localhost:5134/api/BankEmployeeAccount/GetAllCustomer", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAllCustomerIds(data.map((customer) => customer.customerID));
        setErrMessage("");
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
        setErrMessage("Error fetching customers.");
      });
  };

  const handleCustomerIdChange = (event) => {
    const selectedCustomerId = event.target.value;
    setCustomerId(selectedCustomerId);
    setSelectedAccountNumber("");
    setTransactions([]);
    setInboundAmount(null);
    setOutboundAmount(null);
    setAllTransactions([]);

    if (selectedCustomerId) {
      fetchAccountDetails(selectedCustomerId);
    } else {
      setCustomerAccounts([]);
    }
  };

  const fetchAccountDetails = (customerId) => {
    fetch(
      `http://localhost:5134/api/CustomerAccount/GetAccountDetailsByCustomerId?customerId=${customerId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setCustomerAccounts(data);
        setErrMessage("");
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
        setCustomerAccounts([]);
        setErrMessage("Error fetching accounts.");
      });
  };

  const handleAccountNumberChange = (event) => {
    const selectedAccountNumber = event.target.value;
    setSelectedAccountNumber(selectedAccountNumber);
  };

  const fetchTransactions = () => {
    if (!selectedAccountNumber) {
      setErrMessage("Please select an account number.");
      return;
    }

    fetch(
      `http://localhost:5134/api/BankEmployeeTransaction/GetTransactionByAccountNumber?accountNumber=${selectedAccountNumber}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        setErrMessage("");
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
        setErrMessage("Error fetching transactions.");
      });
  };

  const fetchInboundAmount = () => {
    if (!selectedAccountNumber) {
      setErrMessage("Please select an account number.");
      return;
    }

    fetch(
      `http://localhost:5134/api/BankEmployeeTransaction/TotalInbound?accountNumber=${selectedAccountNumber}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.text())
      .then((data) => {
        setInboundAmount(data);
        setErrMessage("");
      })
      .catch((error) => {
        console.error("Error fetching total inbound amount:", error);
        setInboundAmount(null);
        setErrMessage("Error fetching total inbound amount.");
      });
  };

  const fetchOutboundAmount = () => {
    if (!selectedAccountNumber) {
      setErrMessage("Please select an account number.");
      return;
    }

    fetch(
      `http://localhost:5134/api/BankEmployeeTransaction/TotalOutbound?accountNumber=${selectedAccountNumber}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.text())
      .then((data) => {
        setOutboundAmount(data);
        setErrMessage("");
      })
      .catch((error) => {
        console.error("Error fetching total outbound amount:", error);
        setOutboundAmount(null);
        setErrMessage("Error fetching total outbound amount.");
      });
  };

  const fetchAllTransactions = () => {
    if (!selectedAccountNumber) {
      setErrMessage("Please select an account number.");
      return;
    }

    fetch(
      `http://localhost:5134/api/BankEmployeeTransaction/GetAllTransactions?accountNumber=${selectedAccountNumber}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setAllTransactions(data);
        setErrMessage("");
      })
      .catch((error) => {
        console.error("Error fetching all transactions:", error);
        setAllTransactions([]);
        setErrMessage("Error fetching all transactions.");
      });
  };

  return (
    <div className="main">
      <div className="sidebar">
        <button onClick={() => setActiveCard("fetchTransactions")}>
          Fetch Transactions
        </button>
        <button onClick={() => setActiveCard("fetchInboundAmount")}>
          Fetch Inbound Amount
        </button>
        <button onClick={() => setActiveCard("fetchOutboundAmount")}>
          Fetch Outbound Amount
        </button>
        <button onClick={() => setActiveCard("fetchAllTransactions")}>
          Fetch All Transactions
        </button>
      </div>
      <div className="content">
        <div className="card">
          <div className="card-body">
            <h2>Customer and Account Selection</h2>
            <label htmlFor="customerId">Select Customer:</label>
            <select
              id="customerId"
              className="form-control"
              value={customerId}
              onChange={handleCustomerIdChange}
            >
              <option value="">Select Customer</option>
              {allCustomerIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
            <label htmlFor="accountNumber">Select Account Number:</label>
            <select
              id="accountNumber"
              className="form-control"
              value={selectedAccountNumber}
              onChange={handleAccountNumberChange}
            >
              <option value="">Select Account Number</option>
              {customerAccounts.map((account) => (
                <option
                  key={account.accountNumber}
                  value={account.accountNumber}
                >
                  {account.accountNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeCard === "fetchTransactions" && (
          <div className="card">
            <div className="card-body">
              <h2>Fetch Transactions</h2>
              <button onClick={fetchTransactions} className="btn buttons">
                Fetch Transactions
              </button>
              {errMessage && <p className="error-message">{errMessage}</p>}
              {transactions &&
                transactions.map((transaction) => (
                  <div key={transaction.transactionID}>
                    <p>Transaction ID: {transaction.transactionID}</p>
                    <p>Amount: {transaction.amount}</p>
                    <p>Date: {transaction.transactionDate}</p>
                    <p>Description: {transaction.description}</p>
                    <p>Type: {transaction.transactionType}</p>
                    <p>Status: {transaction.status}</p>
                    <p>Source Account: {transaction.sourceAccountNumber}</p>
                    <p>
                      Destination Account:{" "}
                      {transaction.destinationAccountNumber}
                    </p>
                    <hr />
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeCard === "fetchInboundAmount" && (
          <div className="card">
            <div className="card-body">
              <h2>Fetch Inbound Amount</h2>
              <button onClick={fetchInboundAmount} className="btn buttons">
                Fetch Inbound Amount
              </button>
              {inboundAmount && <p>Total Inbound Amount: {inboundAmount}</p>}
              {errMessage && <p className="error-message">{errMessage}</p>}
            </div>
          </div>
        )}

        {activeCard === "fetchOutboundAmount" && (
          <div className="card">
            <div className="card-body">
              <h2>Fetch Outbound Amount</h2>
              <button onClick={fetchOutboundAmount} className="btn buttons">
                Fetch Outbound Amount
              </button>
              {outboundAmount && <p>Total Outbound Amount: {outboundAmount}</p>}
              {errMessage && <p className="error-message">{errMessage}</p>}
            </div>
          </div>
        )}

        {activeCard === "fetchAllTransactions" && (
          <div className="card">
            <div className="card-body">
              <h2>Fetch All Transactions</h2>
              <button onClick={fetchAllTransactions} className="btn buttons">
                Fetch All Transactions
              </button>
              {allTransactions &&
                allTransactions.map((transaction) => (
                  <div key={transaction.transactionID}>
                    <p>Transaction ID: {transaction.transactionID}</p>
                    <p>Amount: {transaction.amount}</p>
                    <p>Date: {transaction.transactionDate}</p>
                    <p>Description: {transaction.description}</p>
                    <p>Type: {transaction.transactionType}</p>
                    <p>Status: {transaction.status}</p>
                    <p>Source Account: {transaction.sourceAccountNumber}</p>
                    <p>
                      Destination Account:{" "}
                      {transaction.destinationAccountNumber}
                    </p>
                    <hr />
                  </div>
                ))}
              {errMessage && <p className="error-message">{errMessage}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BankEmployeeTransaction;
