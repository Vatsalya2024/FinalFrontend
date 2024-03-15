import React, { useState } from "react";
import '../CustomerRegistraion/CustomerRegistration.css';
import { useNavigate } from "react-router-dom";

function CustomerRegistration() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [age, setAge] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [aadharNumber, setAadharNumber] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [gender, setGender] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const[addressError,setAddressError]=useState("");
    const [ageError, setAgeError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [aadharNumberError, setAadharNumberError] = useState("");
    const [panNumberError, setPanNumberError] = useState("");
    const[genderError,setGenderError]=useState("");
    const [err, setErr] = useState("");

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if(newEmail===''){
            setEmailError("Email is Required");

        }
        else if (!newEmail.includes("@") || !newEmail.includes(".com")||!newEmail.endsWith(".com")) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;'"?><,./[\]\\|-]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if(newPassword===''){
            setPasswordError("Password is required");

        }
        else if (!validatePassword(newPassword)) {
            setPasswordError("Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.");
        } else {
            setPasswordError("");
        }
    };

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
        if(newName===''){
            setNameError("Name is required");
        }
        else if (!/^[a-zA-Z ]+$/.test(newName)) {
            setNameError("Name should not contain numbers");
        } else {
            setNameError("");
        }
    };

    const handleDobChange = (e) => {
        const newDob = e.target.value;
        setDob(newDob);
        const birthDate = new Date(newDob);
        const today = new Date();
        const calculatedAge = today.getFullYear() - birthDate.getFullYear();
    
        if (isNaN(calculatedAge)) {
            setAge('');
            setAgeError('');
            setErr('Date of Birth is required');
            return;
        } else {
            setErr('');
        }
    
        if (calculatedAge <= 12) {
            setAge(calculatedAge);
            setAgeError('Age should be greater than 12');
        } else {
            setAge(calculatedAge);
            setAgeError('');
        }
    };
    
    

    const handlePhoneNumberChange = (e) => {
        const newPhoneNumber = e.target.value;
        setPhoneNumber(newPhoneNumber);
        if(/^[a-zA-Z ]+$/.test(newPhoneNumber)){
            setPhoneNumberError('Phone Number should not contain letters')
        } 
        else if (newPhoneNumber.length !== 10) {
            setPhoneNumberError('Phone number should be of 10 digits');
        } 
        else {
            setPhoneNumberError("");
        }
    };
    const handleAddressChange=(e)=>{
        const newAddress=e.target.value;
        setAddress(newAddress);
        if(newAddress===''){
            setAddressError("Address is Required");
        }
        else{
            setAddressError("");
        }
    }

    const handleAadharNumberChange = (e) => {
        const newAadharNumber = e.target.value;
        setAadharNumber(newAadharNumber);
        if(newAadharNumber===''){
            setAadharNumberError('Aadhaar Number is Required');

        }
        else if (/^[a-zA-Z ]+$/.test(newAadharNumber)) {
            setAadharNumberError('Aadhaar number should not have letters');
        } 
        else if (newAadharNumber.length !== 12) {
            setAadharNumberError('Aadhaar number should have 12 digits');
        } else {
            setAadharNumberError("");
        }
    };

    const handlePanNumberChange = (e) => {
        const newPanNumber = e.target.value;
        setPanNumber(newPanNumber);
        if(newPanNumber===''){
            setPanNumberError('Pan Number is Required');

        }
        else if (newPanNumber.length !== 9) {
            setPanNumberError('PAN number should have 9 digits');
        } else {
            setPanNumberError("");
        }
    };

    const genderOptions = ["Male", "Female", "Other"];
    const handleGenderChange = (e) => {
        const selectedGender = e.target.value;
        setGender(selectedGender);
    
        if (selectedGender === '') {
            setGenderError('Gender is required');
        } else {
            setGenderError('');
        }
    };
    
    const register = () => {
       

        if (
            email === "" || password === "" || name === "" || dob === "" ||
            phoneNumber === "" || address === "" || aadharNumber === "" ||
            panNumber === "" || gender === ""
        ) {
            alert("Please fill in all fields");
            return;
        }

        const customer = {
            email,
            password,
            name,
            dob,
            age,
            phoneNumber,
            address,
            aadharNumber,
            panNumber,
            gender
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
        };

        fetch("http://localhost:5134/api/Customer/Register", requestOptions)
        .then(res => {
            if (res.ok) {
                navigate('/login');
            } else {
                alert('Email already exists');
            }})
    };

    return (
        <div>
            
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Customer Registration</h5>
                                <div className="alert divregister">
                                    <label className="labels">Email</label>
                                    <input className="form-control" type="text" value={email} onChange={handleEmailChange} />
                                    <p className="error-text">{emailError}</p>

                                    <label className="labels">Password</label>
                                    <input className="form-control" type="password" value={password} onChange={handlePasswordChange} />
                                    <p className="error-text">{passwordError}</p>

                                    <label className="labels">Name</label>
                                    <input className="form-control" type="text" value={name} onChange={handleNameChange} />
                                    <p className="error-text">{nameError}</p>

                                    <label className="labels">DOB</label>
                                    <input className="form-control" type="date" value={dob} onChange={handleDobChange} />
                                    <p className="error-text">{err}</p>

                                    <label className="labels">Age</label>
                                    <input className="form-control" type="number" value={age} disabled />
                                    <p className="error-text">{ageError}</p>

                                    <label className="labels">Phone</label>
                                    <input className="form-control" type="text" value={phoneNumber} onChange={handlePhoneNumberChange} />
                                    <p className="error-text">{phoneNumberError}</p>

                                    <label className="labels">Address</label>
                                    <input className="form-control" type="text" value={address} onChange={handleAddressChange} />
                                    <p className="error-text">{addressError}</p>

                                    <label className="labels">Aadhaar Number</label>
                                    <input className="form-control" type="text" value={aadharNumber} onChange={handleAadharNumberChange} />
                                    <p className="error-text">{aadharNumberError}</p>

                                    <label className="labels">PAN Number</label>
                                    <input className="form-control" type="text" value={panNumber} onChange={handlePanNumberChange} />
                                    <p className="error-text">{panNumberError}</p>

                                    <label className="labels">Gender</label>
                                    <select className="form-control" value={gender} onChange={handleGenderChange}>
                                        <option value="">Select Gender</option>
                                        {genderOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    <p className="error-text">{genderError}</p>

                                        <div>
                                        <button className="mx-auto d-flex   " onClick={register}>Register</button><br/>
                                   
                                    
                                        <button className="mx-auto d-flex  ">Cancel</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerRegistration;
