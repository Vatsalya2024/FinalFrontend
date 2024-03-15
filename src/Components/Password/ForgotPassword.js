import { useState } from "react";
import { useNavigate } from "react-router-dom";
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate=useNavigate();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;'"?><,./[\]\\|-]).{8,}$/;

    const handlePasswordChange = () => {
        if(email===''){
            setMessage('Email is Required');
            return;
        }
        if (!passwordRegex.test(newPassword)) {
            setMessage('Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, one special character, and be at least 8 characters long.');
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
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Email not found.');
            }
        })
        .then(data => {
            setMessage(data);
            setNewPassword('');
            setConfirmPassword('');
            navigate('/login');
        })
        .catch(error => {
            alert(error.message); 
        });
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

export default ForgotPassword;
