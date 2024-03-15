import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import '../BankEmployeeLogin/BankEmployeeLogin.css'
function BankEmployeeLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedin, setLoggedin] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
  
    const login = (e) => {
        e.preventDefault();
        if(email===''){
            setErrorMessage('Email is Rrequired');
            return;
        }
        if(password===''){
            setErrorMessage('Password is Rrequired');
            return;
        }
        const user = {
            email: email,
            password: password,
            userType: "",
            token: ""
        };

        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        };

        fetch("http://localhost:5134/api/BankEmployeeLogin/login", requestOptions)
            .then(res => res.json())
            .then(res => {
                if (res.userType === "BankEmployee") {
                    sessionStorage.setItem("token", res.token);
                    sessionStorage.setItem("email", res.email);
                    sessionStorage.setItem("userType",res.userType)
                    setLoggedin(true);
                    navigate('/bankemployee/account');
                } else {
                 
                    setLoggedin(false);
                    setErrorMessage("Incorrect credentials");
                }
            })
            .catch(err => {
                console.log(err);
                setLoggedin(false);
                setErrorMessage("Incorrect credentials");
            });
    };

    return (
        <div>
            {loggedin ? <h2 className='alert successMesage '>Welcome-{email}</h2> : null}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        
            <div className='alert divlogin'>
                <div className="container">
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-6">
                            <div className="card">
                            <div className="card-body">
                        <h5 className="card-title mb-5">Bank Employee Login</h5>
                        <form>
                            <div className="mb-3">
                                <label className='form-label'>Email</label>
                                <input
                                    placeholder='email'
                                    className='form-control'
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="d-grid gap-2 w-25 mx-auto">
                                <button onClick={login} className="btn " type="button">Login</button>
                                <button className="btn  " type="button">Cancel</button>
                            </div>
                            <div className='belink'>
                                <Link to="/forgotpasswordbe" className='btn-link mx-auto'>Forgot Password?</Link>
                            </div>
                        </form>
                            </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BankEmployeeLogin;
