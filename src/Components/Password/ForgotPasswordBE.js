import { useState } from "react";
import { useNavigate } from "react-router-dom";
function ForgotPasswordBE() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate=useNavigate();

    const handlePasswordChange = () => {
        if(email===''){
            setMessage('Email is Required');
            return;
        }
        if(newPassword===''){
            setMessage('New Password is Required');
            return;
        }
        if(confirmPassword===''){
            setMessage('Confirm Password is required');
            return;
        }
        if(newPassword!==confirmPassword){
            setMessage('New Password and Confirm password must match');
            return;
        }
        fetch(`http://localhost:5134/api/Customer/ResetPassword?email=${email}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        })
            .then(response => response.text())
            .then(data => {
                setMessage(data);
                setNewPassword('');
                setConfirmPassword('');
                navigate('/login/bankemployeelogin');
            })
    }

    return (
        <div className="container ">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title text-center">Forgot Password</h2>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        </div>
                        <button type="button" className="btn " onClick={handlePasswordChange}>Reset Password</button>
                        {message && <p className="mt-3">{message}</p>}
                    </form>
                </div>
            </div>
            </div>
            </div>
        </div>
    );
}

export default ForgotPasswordBE;
