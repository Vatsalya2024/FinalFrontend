
import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import './style.css';
import '../AdminCustomerManagement/style.css'

function AdminCustomerManagement() {

    const [customers, setCustomers] = useState([]);
    const [customerIdInput, setCustomerIdInput] = useState("");
    const [customerById, setCustomerById] = useState(null);
    var [updateNameResponse, setUpdateNameResponse] = useState("");
    const [message, setMessage] = useState('');
    const [message1, setMessage1] = useState('');
    const [message2, setMessage2] = useState('');
    const [customerIdsDropdown, setCustomerIdsDropdown] = useState([]);
    const token = sessionStorage.getItem('token');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [newCustomerData, setNewCustomerData] = useState({
        email: "",
        password: "",
        name: "",
        dob: "",
        age: "",
        phoneNumber: "",
        address: "",
        aadharNumber: "",
        panNumber: "",
        gender: ""
    });
    const [deactivateResponse, setDeactivateResponse] = useState("");
    const [activateResponse, setActivateResponse] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const handleShowModal = () => {
        getAllCustomers();
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleShowRegisterModal = () => setShowRegisterModal(true);

    const handleCloseRegisterModal = () => setShowRegisterModal(false);

    useEffect(() => {
        getAllCustomers();
    }, []);

    const getAllCustomers = () => {
        fetch("http://localhost:5134/api/AdministratorCustomer/GetAllCustomers", {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(res => {
                setCustomers(res);
                setCustomerIdsDropdown(res.map(customer => customer.customerID));
            });
    };

    const getCustomerById = () => {
        if (customerIdInput === '') {
            setMessage('Customer ID cannot be empty');
            return;
        }

        fetch(`http://localhost:5134/api/AdministratorCustomer/GetCustomerById?id=${customerIdInput}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(customer => {
                console.log(customer);
                setCustomerById(customer);
                setMessage('');
            })
            .catch(error => {
                console.error('Error fetching customer by ID:', error);
                setCustomerById('');
                setMessage('No customer found with this ID');
            });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'dob') {

            const birthDate = new Date(value);
            const today = new Date();
            const calculatedAge = today.getFullYear() - birthDate.getFullYear();

            if (isNaN(calculatedAge)) {

                setNewCustomerData({
                    ...newCustomerData,
                    age: '',
                    [name]: value,
                });
            } else {

                setNewCustomerData({
                    ...newCustomerData,
                    age: calculatedAge,
                    [name]: value,
                });
            }
        } else {

            setNewCustomerData({
                ...newCustomerData,
                [name]: value,
            });
        }
    };


    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (newCustomerData.email && !emailRegex.test(newCustomerData.email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    }, [newCustomerData.email]);

   
    useEffect(() => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (newCustomerData.password && !passwordRegex.test(newCustomerData.password)) {
            setPasswordError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character');
        } else {
            setPasswordError('');
        }
    }, [newCustomerData.password]);

    const registerCustomer = () => {
        const requiredFields = ['email', 'password', 'name', 'dob', 'phoneNumber', 'address', 'panNumber', 'gender', 'aadharNumber'];
        const missingFields = requiredFields.filter(field => !newCustomerData[field]);

        if (missingFields.length > 0) {
            setMessage1(`Please fill in the following fields: ${missingFields.join(', ')}`);
            return;
        }
     
        fetch("http://localhost:5134/api/AdministratorCustomer/RegisterCustomer", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'text/plain',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(newCustomerData)
        })
            .then(res => {
                if (res.ok) {
                    alert('Customer registered successfully');
                } else {
                    
                    alert('Email already exists');
                }
            })
    };

    const handleDropdownChange = (event) => {
        setCustomerIdInput(event.target.value);
    };

    const deactivateCustomer = () => {
        const confirmation = window.confirm('Are you sure you want to deactivate this customer?');

        if (confirmation) {
            if (customerIdInput === '') {
                setDeactivateResponse('Customer ID cannot be empty');
                return;
            }

            fetch(`http://localhost:5134/api/AdministratorCustomer/DeactivateCustomer?customerId=${customerIdInput}`, {
                method: 'PUT',
                headers: {
                    'accept': 'text/plain',
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(res => res.text())
                .then(response => {
                    setDeactivateResponse(response);
                })
                .catch(error => {
                    console.error('Error deactivating customer:', error);
                });
        }
    };

    const activateCustomer = () => {
        const confirmation = window.confirm('Are you sure you want to activate this customer?');

        if (confirmation) {
            if (customerIdInput === '') {
                setActivateResponse('Customer ID cannot be empty');
                return;
            }

            fetch(`http://localhost:5134/api/AdministratorCustomer/ActivateCustomer?customerId=${customerIdInput}`, {
                method: 'PUT',
                headers: {
                    'accept': 'text/plain',
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(res => res.text())
                .then(response => {
                    setActivateResponse(response);
                })
                .catch(error => {
                    console.error('Error activating customer:', error);
                });
        }
    };

    const updateCustomerName = () => {
        if (customerIdInput === '' && newCustomerData.name === '') {
            setUpdateNameResponse('Customer ID and name cannot be empty');
            return;
        }

        if (customerIdInput === '') {
            setUpdateNameResponse('Customer ID cannot be empty');
            return;
        }

        if (newCustomerData.name === '') {
            setUpdateNameResponse('Customer name cannot be empty');
            return;
        }

        fetch(`http://localhost:5134/api/AdministratorCustomer/UpdateCustomerName?customerId=${customerIdInput}`, {
            method: 'PUT',
            headers: {
                'accept': 'text/plain',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                "name": newCustomerData.name,
            })
        })
            .then(res => res.text())
            .then(response => {
                setUpdateNameResponse(response);
            })
            .catch(error => {
                console.error('Error updating customer name:', error);
            });
    };

    const updateCustomerContact = () => {
        if (customerIdInput === '' || !newCustomerData.phoneNumber || !newCustomerData.address || !newCustomerData.aadharNumber) {
            setMessage2('Please Fill All the Fields ');
            return;
        }

        fetch(`http://localhost:5134/api/AdministratorCustomer/UpdateCustomerContact?customerId=${customerIdInput}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                phoneNumber: newCustomerData.phoneNumber,
                address: newCustomerData.address,
                aadharNumber: newCustomerData.aadharNumber,
            }),
        })
            .then(res => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error(`Failed to update customer contact. Status: ${res.status}`);
                }
            })
            .then(response => {
                console.log(response);
                setMessage2('Customer contact information updated successfully');
            })
            .catch(error => {
                console.error('Error updating customer contact:', error.message);
                setMessage2('Error updating customer contact');
            });
    };



    return (
        <div>
            <div className="container">
                {/* Content */}
                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="card customerInfo">
                            <div className="card-body">
                                <h5 className="card-title cardHeader">Get All Customers</h5>
                                <button onClick={handleShowModal}>Get All Customers</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card customerInfo">
                            <div className="card-body">
                                <h5 className="card-title cardHeader">Customer Registration</h5>
                                <button onClick={handleShowRegisterModal}>Register Customer</button>
                                {/* {message1 && <p>{message1}</p>} */}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 mt-4">
                        <div className="card customerInfo justify-content-center">
                            <div className="card-body">
                                <h5 className="card-title cardHeader">Customer Search</h5>
                                <label htmlFor="customerIdDropdown" className="label">Select Customer ID: </label>
                                <select
                                    id="customerIdDropdown"
                                    value={customerIdInput}
                                    onChange={handleDropdownChange}
                                    className="value"
                                >
                                    <option value="" disabled>Select Customer ID</option>
                                    {customerIdsDropdown.map((id) => (
                                        <option key={id} value={id}>{id}</option>
                                    ))}
                                </select>
                                <br />
                                <button className="btn card-title"

                                    style={{
                                        fontSize: '18px',
                                        padding: '3px 8px',
                                        marginTop: '20px'
                                    }} onClick={getCustomerById}>Fetch Customer by ID</button>

                                {message && <p>{message}</p>}
                                {customerById && (
                                    <div key={customerById.customerID} className="customerDetails">
                                        <h2>Name: <span className="value">{customerById.name}</span></h2>
                                        <br />
                                        <p>ID: <span className="value">{customerById.customerID}</span></p>
                                        <p>DOB: <span className="value">{customerById.dob}</span></p>
                                        <p>Phone: <span className="value">{customerById.phoneNumber}</span></p>
                                        <p>Address: <span className="value">{customerById.address}</span></p>
                                        <p>Email: <span className="value">{customerById.email}</span></p>
                                        <hr />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-4">
                        <div className="card customerInfo">
                            <div className="card-body">
                                <h5 className="card-title cardHeader">Deactivate Customer</h5>
                                <label htmlFor="deactivateCustomerIdDropdown" className="label">Select Customer ID: </label>
                                <select
                                    id="deactivateCustomerIdDropdown"
                                    value={customerIdInput}
                                    onChange={handleDropdownChange}
                                    className="value"
                                >
                                    <option value="" disabled>Select Customer ID</option>
                                    {customerIdsDropdown.map((id) => (
                                        <option key={id} value={id}>{id}</option>
                                    ))}
                                </select>
                                <button style={{
                                    fontSize: '18px',
                                    padding: '3px 8px',
                                    marginTop: '20px'
                                }}
                                    onClick={deactivateCustomer} >Deactivate Customer</button>
                                {deactivateResponse && (
                                    <div className="response">
                                        <p>{deactivateResponse}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-4">
                        <div className="card customerInfo">
                            <div className="card-body">
                                <h5 className="card-title cardHeader">Activate Customer</h5>
                                <label htmlFor="activateCustomerIdDropdown" className="label">Select Customer ID: </label>
                                <select
                                    id="activateCustomerIdDropdown"
                                    value={customerIdInput}
                                    onChange={handleDropdownChange}
                                    className="value"
                                >
                                    <option value="" disabled>Select Customer ID</option>
                                    {customerIdsDropdown.map((id) => (
                                        <option key={id} value={id}>{id}</option>
                                    ))}
                                </select>
                                <br />
                                <button style={{
                                    fontSize: '18px',
                                    padding: '3px 8px',
                                    marginTop: '20px'
                                }} onClick={activateCustomer}>Activate Customer</button>
                                {activateResponse && (
                                    <div className="response">
                                        <p>{activateResponse}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-4">
                        <div className="card customerInfo">
                            <div className="card-body">
                                <h5 className="card-title cardHeader">Update Customer Name</h5>
                                <label htmlFor="updateNameCustomerIdDropdown" className="label">Select Customer ID: </label>
                                <br />
                                <select
                                    id="updateNameCustomerIdDropdown"
                                    value={customerIdInput}
                                    onChange={handleDropdownChange}
                                    className="value"
                                >
                                    <option value="" disabled>Select Customer ID</option>
                                    {customerIdsDropdown.map((id) => (
                                        <option key={id} value={id}>{id}</option>
                                    ))}
                                </select>
                                <br />
                                <br />
                                <label htmlFor="newName" className="label">Enter New Name: </label>
                                <input
                                    type="text"
                                    id="newName"
                                    name="name"
                                    value={newCustomerData.name}
                                    onChange={handleInputChange}
                                    className="value"
                                />
                                <br />
                                <button onClick={updateCustomerName}>Update Customer Name</button>
                                {updateNameResponse && (
                                    <div className="response">
                                        <p>{updateNameResponse}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-4">
                        <div className="card customerInfo">
                            <div className="card-body">
                                <h5 className="card-title cardHeader">Update Customer Contact</h5>
                                <label htmlFor="updateContactCustomerIdDropdown" className="label">Select Customer ID: </label>
                                <select
                                    id="updateContactCustomerIdDropdown"
                                    value={customerIdInput}
                                    onChange={handleDropdownChange}
                                    className="value"
                                >
                                    <option value="" disabled>Select Customer ID</option>
                                    {customerIdsDropdown.map((id) => (
                                        <option key={id} value={id}>{id}</option>
                                    ))}
                                </select>
                                <br />
                                <label htmlFor="newPhoneNumber" className="label">Enter New Phone Number: </label>
                                <input
                                    type="text"
                                    id="newPhoneNumber"
                                    name="phoneNumber"
                                    value={newCustomerData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="value"
                                />
                                <br />
                                <label htmlFor="newAddress" className="label">Enter New Address: </label>
                                <input
                                    type="text"
                                    id="newAddress"
                                    name="address"
                                    value={newCustomerData.address}
                                    onChange={handleInputChange}
                                    className="value"
                                />
                                <br />
                                <label htmlFor="newAadharNumber" className="label">Enter New Aadhar Number: </label>
                                <input
                                    type="text"
                                    id="newAadharNumber"
                                    name="aadharNumber"
                                    value={newCustomerData.aadharNumber}
                                    onChange={handleInputChange}
                                    className="value"
                                />
                                <br />
                                <button onClick={updateCustomerContact}>Update Customer Contact</button>
                                {message2 && <p>{message2}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Get All Customers Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>All Customers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {customers.map(customer => (
                        <div key={customer.customerID}>
                            <h5>Name: {customer.name}</h5>
                            <p>ID: {customer.customerID}</p>
                            <p>Email: {customer.email}</p>
                            <p>DOB: {customer.dob}</p>
                            <p>Phone: {customer.phoneNumber}</p>
                            <p>Address: {customer.address}</p>
                            <hr />
                           
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                 
                </Modal.Footer>
            </Modal>

            <Modal show={showRegisterModal} onHide={handleCloseRegisterModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Register New Customer</Modal.Title>
                </Modal.Header>
              
                <Modal.Body>
                    <label>Email:</label>
                    <input type="email" name="email" value={newCustomerData.email} onChange={handleInputChange} className="value" />
                    {emailError && <div style={{ color: 'red', marginTop: '5px' }}>{emailError}</div>}
                    <label>Password:</label>
                    <input type="password" name="password" value={newCustomerData.password} onChange={handleInputChange} className="value" />
                    {passwordError && <div style={{ color: 'red', marginTop: '5px' }}>{passwordError}</div>}
                    <label>Name:</label>
                    <input type="text" name="name" value={newCustomerData.name} onChange={handleInputChange} className="value" />
                    <label>DOB:</label>
                    <input type="date" name="dob" value={newCustomerData.dob} onChange={handleInputChange} className="value" />
                    <label>Age:</label>
                    <input type="text" name="age" value={newCustomerData.age} onChange={handleInputChange} className="value" />
                    <label>Phone:</label>
                    <input type="text" name="phoneNumber" value={newCustomerData.phoneNumber} onChange={handleInputChange} className="value" />
                    <label>Address:</label>
                    <input type="text" name="address" value={newCustomerData.address} onChange={handleInputChange} className="value" />
                    <label>Aadhaar Number:</label>
                    <input type="text" name="aadharNumber" value={newCustomerData.aadharNumber} onChange={handleInputChange} className="value" />
                    <label>PAN Number:</label>
                    <input type="text" name="panNumber" value={newCustomerData.panNumber} onChange={handleInputChange} className="value" />
                    <label>Gender:</label>
                    <br/>
                    
                    <select
                        name="gender"
                        value={newCustomerData.gender}
                        onChange={handleInputChange}
                        className="value"
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                   
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRegisterModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={registerCustomer}>
                        Register
                    </Button>
                    {message1 && <p>{message1}</p>}
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default AdminCustomerManagement;
