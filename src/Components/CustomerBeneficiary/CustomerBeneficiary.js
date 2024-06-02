import React, { useState, useEffect } from "react";

function CustomerBeneficiary() {
  const [branchName, setBranchName] = useState("");
  const [ifsc, setIFSC] = useState("");
  const [branches, setBranches] = useState([]);
  const [beneficiaryAccountNumber, setBeneficiaryAccountNumber] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [addBeneficiaryResponse, setAddBeneficiaryResponse] = useState("");
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [transferResponse, setTransferResponse] = useState("");
  const [sourceAccountNumber, setSourceAccountNumber] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [sourceAccounts, setSourceAccounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const [errorMessage3, setErrorMessage3] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("addBeneficiary"); // Set initial state to 'addBeneficiary'
  const Customer = sessionStorage.getItem("customerId");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchBanks();
    fetchBeneficiaries();
    fetchSourceAccounts();
    // eslint-disable-next-line
  }, []);

  const fetchBanks = () => {
    fetch("http://localhost:5134/api/Banks/GetAllBanks")
      .then((response) => response.json())
      .then((data) => {
        const filteredBanks = data.filter((bank) => bank.bankName !== "MB");
        setBanks(filteredBanks);
      })
      .catch((error) => {
        console.error("Error fetching banks:", error);
      });
  };

  const fetchSourceAccounts = () => {
    fetch(
      `http://localhost:5134/api/CustomerAccount/GetAccountDetailsByCustomerId?customerId=${Customer}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSourceAccounts(data.map((account) => account.accountNumber));
      })
      .catch((error) => {
        console.error("Error fetching source accounts:", error);
      });
  };

  const fetchBeneficiaries = () => {
    fetch(
      `http://localhost:5134/api/CustomerBeneficiaries/GetBeneficiaryByCustomerId?customerId=${Customer}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setBeneficiaries(data);
      })
      .catch((error) => {
        console.error("Error fetching beneficiaries:", error);
      });
  };

  const addBeneficiary = () => {
    const isExistingBeneficiary = beneficiaries.some(
      (beneficiary) =>
        beneficiary.beneficiaryAccountNumber ===
        parseInt(beneficiaryAccountNumber)
    );
    const isInvalidAccountNumber = beneficiaryAccountNumber.startsWith("11133");

    if (isExistingBeneficiary) {
      setErrorMessage2(
        "Beneficiary with the same account number already exists."
      );
      return;
    }

    if (isInvalidAccountNumber) {
      setErrorMessage2("Account not found.");
      return;
    }

    const requestBody = {
      beneficiaryAccountNumber: parseInt(beneficiaryAccountNumber),
      name: beneficiaryName,
      ifsc: ifsc,
      customerID: Customer,
    };

    if (
      beneficiaryAccountNumber === "" ||
      beneficiaryName === "" ||
      ifsc === ""
    ) {
      setErrorMessage2("All fields must be filled");
      return;
    }

    fetch("http://localhost:5134/api/CustomerBeneficiaries/AddBeneficiary", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.text())
      .then((data) => {
        setAddBeneficiaryResponse(data);
        fetchBeneficiaries();
        setErrorMessage2("");
      })
      .catch((error) => {
        console.error("Error adding beneficiary:", error);
      });
  };

  const transferToBeneficiary = () => {
    if (!selectedBeneficiary) {
      setErrorMessage3("No beneficiary selected.");
      return;
    }

    const requestBody = {
      beneficiaryID: selectedBeneficiary.beneficiaryID,
      sourceAccountNumber: parseInt(sourceAccountNumber),
      beneficiaryAccountNumber: parseInt(
        selectedBeneficiary.beneficiaryAccountNumber
      ),
      amount: parseInt(transferAmount),
    };

    fetch(
      "http://localhost:5134/api/CustomerBeneficiaries/TransferToBeneficiary",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then((response) => response.text())
      .then((data) => {
        setTransferResponse(data);
        fetchBeneficiaries();
      })
      .catch((error) => {
        console.error("Error transferring funds:", error);
      });
  };

  const getBranchesByBankName = () => {
    if (selectedBank === "") {
      setErrorMessage("Please select a bank first.");
      return;
    } else {
      alert("Branches Available");
    }

    fetch(
      `http://localhost:5134/api/CustomerBeneficiaries/GetBankBranchesByBankName?bankName=${selectedBank}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setBranches(data);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        console.error("Error fetching branches by bank name:", error);
      });
  };

  const getIFSCByBranchName = () => {
    if (branchName === "") {
      setErrorMessage1("Please select a branch first.");
      return;
    }

    fetch(
      `http://localhost:5134/api/CustomerBeneficiaries/GetIFSCByBranchName?branchName=${branchName}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.text())
      .then((data) => {
        if (data) {
          setIFSC(data);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        console.error("Error fetching IFSC by branch name:", error);
      });
  };

  const toggleSelectedBeneficiary = (beneficiary) => {
    if (
      selectedBeneficiary &&
      selectedBeneficiary.beneficiaryID === beneficiary.beneficiaryID
    ) {
      setSelectedBeneficiary(null);
    } else {
      setSelectedBeneficiary(beneficiary);
      alert("Beneficiary added successfully");
      setActiveSection("transferFunds");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredBeneficiaries = beneficiaries.filter((beneficiaries) =>
    beneficiaries.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main">
      <div className="sidebar">
        <button onClick={() => setActiveSection("addBeneficiary")}>
          Add Beneficiary
        </button>
        <button onClick={() => setActiveSection("viewBeneficiaries")}>
          View Beneficiaries
        </button>
        <button onClick={() => setActiveSection("transferFunds")}>
          Transfer Funds
        </button>
      </div>
      <div className="content">
        {activeSection === "addBeneficiary" && (
          <div className="card h-100 p-3 beneficiary">
            <div className="card-body">
              <h5 className="card-title">Add Beneficiary</h5>
              <div className="form-group">
                <label htmlFor="bankName">Bank Name:</label>
                <select
                  id="bankName"
                  className="form-control"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                >
                  <option value="">Select a bank</option>
                  {banks.map((bank, index) => (
                    <option key={index} value={bank.bankName}>
                      {bank.bankName}
                    </option>
                  ))}
                </select>
                <button className="btn" onClick={getBranchesByBankName}>
                  Get Branches
                </button>
                {errorMessage && <p>{errorMessage}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="branchName">Branch Name:</label>
                <select
                  id="branchName"
                  className="form-control"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                >
                  <option value="">Select a branch</option>
                  {branches.map((branch, index) => (
                    <option key={index} value={branch.branchName}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
                <button className="btn" onClick={getIFSCByBranchName}>
                  Get IFSC
                </button>
                {errorMessage1 && <p>{errorMessage1}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="ifsc">IFSC:</label>
                <input
                  type="text"
                  id="ifsc"
                  className="form-control"
                  value={ifsc}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="beneficiaryAccountNumber">
                  Beneficiary Account Number:
                </label>
                <input
                  type="number"
                  id="beneficiaryAccountNumber"
                  className="form-control"
                  value={beneficiaryAccountNumber}
                  onChange={(e) => setBeneficiaryAccountNumber(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="beneficiaryName">Beneficiary Name:</label>
                <input
                  type="text"
                  id="beneficiaryName"
                  className="form-control"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                />
              </div>
              <button className="btn" onClick={addBeneficiary}>
                Add Beneficiary
              </button>
              <div>
                <p>{addBeneficiaryResponse}</p>
                {errorMessage2 && <p>{errorMessage2}</p>}
              </div>
            </div>
          </div>
        )}
        {activeSection === "viewBeneficiaries" && (
          <div className="card beneficiary">
            <div className="card-body">
              <h5 className="card-title">Beneficiaries</h5>
              <input
                type="text"
                placeholder="Search beneficiaries by name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-control mb-3"
              />
              <div className="beneficiary-list">
                {filteredBeneficiaries.map((beneficiary) => (
                  <div
                    className="beneficiary-item"
                    key={beneficiary.beneficiaryID}
                  >
                    <p>
                      <strong>Name:</strong> {beneficiary.name}
                    </p>
                    <p>
                      <strong>Account Number:</strong>{" "}
                      {beneficiary.beneficiaryAccountNumber}
                    </p>
                    <p>
                      <strong>IFSC:</strong> {beneficiary.ifsc}
                    </p>
                    <button
                      onClick={() => toggleSelectedBeneficiary(beneficiary)}
                    >
                      {selectedBeneficiary &&
                      selectedBeneficiary.beneficiaryID ===
                        beneficiary.beneficiaryID
                        ? "Deselect"
                        : "Select"}
                    </button>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeSection === "transferFunds" && (
          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">Transfer Funds</h5>
              <div>
                <label htmlFor="sourceAccountNumber">
                  Source Account Number:
                </label>
                <select
                  id="sourceAccountNumber"
                  value={sourceAccountNumber}
                  onChange={(e) => setSourceAccountNumber(e.target.value)}
                >
                  <option value="">Select Source Account</option>
                  {sourceAccounts.map((account) => (
                    <option key={account} value={account}>
                      {account}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="transferAmount">Transfer Amount:</label>
                <input
                  type="number"
                  id="transferAmount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
              </div>
              <button onClick={transferToBeneficiary}>Transfer Funds</button>
              <div>
                <p>{transferResponse}</p>
                {errorMessage3 && <p>{errorMessage3}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerBeneficiary;
