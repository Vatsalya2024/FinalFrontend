import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../AdminLogin/AdminLogin.css'
function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedin, setLoggedin] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    var navigate = useNavigate();

    
    const login = (e) => {
        e.preventDefault();
        e.preventDefault();
        if(email===''){
            setErrorMessage('Email is Required');
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
        fetch("http://localhost:5134/api/AdminLogin/AdminLogin", requestOptions)
            .then(res => res.json())
            .then(res => {
                if (res.userType === "Admin") {
                    sessionStorage.setItem("token", res.token);
                    sessionStorage.setItem("email", res.email);
                    sessionStorage.setItem("userType",res.userType)
                    setLoggedin(true);
                    navigate('/admincustomermanagement/');
                } else {
                    setLoggedin(false);
                    setErrorMessage("Incorrect credentials");
                }
            })
            .catch(err => {
                console.log(err);
                setLoggedin(false);
                setErrorMessage("Incorrect Credentials");
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
                                    <h5 className="card-title mb-5">Admin Login</h5>
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
                                        </div >
                                        <div className='buttonx mx-auto mb-2'>
                                            <button onClick={login} className="btn success">Login</button>
                                            
                                        </div>
                                        <div className='buttonx mx-auto'>
                                        <button className="btn cancel">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet/>
        </div>
    );
}

export default AdminLogin;
