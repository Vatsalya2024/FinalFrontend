import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CustomerTransactions/CustomerTransactions.css";

function CustomerTransactions() {
  const [depositAccountNumber, setDepositAccountNumber] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferSourceAccountNumber, setTransferSourceAccountNumber] =
    useState("");
  const [destinationAccountNumber, setDestinationAccountNumber] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [depositMessage, setDepositMessage] = useState("");
  const [withdrawMessage, setWithdrawMessage] = useState("");
  const [transferMessage, setTransferMessage] = useState("");
  const [customerAccounts, setCustomerAccounts] = useState([]);
  const [activeCard, setActiveCard] = useState("deposit");
  const customerId = sessionStorage.getItem("customerId");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchCustomerAccounts = () => {
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
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
          setCustomerAccounts([]);
        });
    };
    fetchCustomerAccounts();
  }, [customerId]);

  const handleCancel = () => {
    setDepositMessage("");
    setWithdrawMessage("");
    setTransferMessage("");
  };

  const handleDeposit = () => {
    if (!depositAccountNumber) {
      setDepositMessage("Account Number is Required");
      return;
    }
    if (!depositAmount) {
      setDepositMessage("Amount is required");
      return;
    }
    const requestBody = {
      accountNumber: depositAccountNumber,
      amount: depositAmount,
    };

    fetch(
      `http://localhost:5134/api/CustomerTransaction/deposit?customerId=${customerId}`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDepositMessage(data.message);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  const handleWithdraw = () => {
    if (!withdrawAccountNumber) {
      setWithdrawMessage("Account Number is Required");
      return;
    }
    if (!withdrawAmount) {
      setWithdrawMessage("Amount is required");
      return;
    }
    const requestBody = {
      accountNumber: withdrawAccountNumber,
      amount: withdrawAmount,
    };

    fetch(
      `http://localhost:5134/api/CustomerTransaction/withdraw?customerId=${customerId}`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.errorMessage === "Not Sufficient Balance") {
          setWithdrawMessage("Not Sufficient Balance");
        } else {
          setWithdrawMessage(data.message);
        }
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  const handleTransfer = () => {
    if (!transferSourceAccountNumber) {
      setTransferMessage("Source Account Number is Required");
      return;
    }
    if (!destinationAccountNumber) {
      setTransferMessage("Destination Account Number is required.");
      return;
    }
    if (!transferAmount) {
      setTransferMessage("Amount is required");
      return;
    }
    if (transferSourceAccountNumber === destinationAccountNumber) {
      setTransferMessage(
        "Source Account and Destination Account should be different"
      );
      return;
    }
    const requestBody = {
      sourceAccountNumber: transferSourceAccountNumber,
      destinationAccountNumber: destinationAccountNumber,
      amount: transferAmount,
    };

    fetch(
      `http://localhost:5134/api/CustomerTransaction/transfer?customerId=${customerId}`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.errorMessage === "Not Sufficient Balance") {
          setTransferMessage("Not Sufficient Balance");
        } else {
          setTransferMessage(data.message);
        }
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  return (
    <div className="main">
      <div className="sidebar">
        <button onClick={() => setActiveCard("deposit")}>Deposit</button>
        <button onClick={() => setActiveCard("withdraw")}>Withdraw</button>
        <button onClick={() => setActiveCard("transfer")}>Transfer</button>
        <Link to="/customer/detailed-transactions">Transactions History</Link>
        <Link to="/beneficiary">Beneficiary Service</Link>
      </div>
      <div className="content">
        {activeCard === "deposit" && (
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Deposit</h5>
              <div className="form-group">
                <label>Account Number:</label>
                <select
                  className="form-control"
                  value={depositAccountNumber}
                  onChange={(e) => setDepositAccountNumber(e.target.value)}
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
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="number"
                  className="form-control"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <div className="button-container">
                <button className="btn buttons" onClick={handleDeposit}>
                  Deposit
                </button>
                <button className="btn cancel rt" onClick={handleCancel}>
                  Close
                </button>
              </div>
              {depositMessage && <p className="mt-3 ">{depositMessage}</p>}
            </div>
          </div>
        )}

        {activeCard === "withdraw" && (
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Withdraw</h5>
              <div className="form-group">
                <label>Account Number:</label>
                <select
                  className="form-control"
                  value={withdrawAccountNumber}
                  onChange={(e) => setWithdrawAccountNumber(e.target.value)}
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
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="number"
                  className="form-control"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <div className="button-container">
                <button className="btn buttons" onClick={handleWithdraw}>
                  Withdraw
                </button>
                <button className="btn cancel ui" onClick={handleCancel}>
                  Close
                </button>
              </div>
              {withdrawMessage && <p className="mt-3">{withdrawMessage}</p>}
            </div>
          </div>
        )}

        {activeCard === "transfer" && (
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Transfer</h5>
              <div className="form-group">
                <label>Source Account Number:</label>
                <select
                  className="form-control"
                  value={transferSourceAccountNumber}
                  onChange={(e) =>
                    setTransferSourceAccountNumber(e.target.value)
                  }
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
              </div>
              <div className="form-group">
                <label>Destination Account Number:</label>
                <input
                  type="text"
                  className="form-control"
                  value={destinationAccountNumber}
                  onChange={(e) => setDestinationAccountNumber(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="number"
                  className="form-control"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
              </div>
              <div className="button-container">
                <button className="btn buttons" onClick={handleTransfer}>
                  Transfer
                </button>
                <button className="btn cancel uo" onClick={handleCancel}>
                  Close
                </button>
              </div>
              {transferMessage && <p className="mt-3">{transferMessage}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerTransactions;
