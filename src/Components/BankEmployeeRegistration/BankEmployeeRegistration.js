import { useState } from "react";
import '../BankEmployeeRegistration/BankEmployeeRegistration.css'

function BankEmployeeRegistration() {
    var [email, setEmail] = useState("");
    var [password, setPassword] = useState("");
    var [name, setName] = useState("");
    var [position, setPosition] = useState("");
    var [phone, setPhone] = useState("");

    var bankEmployee = {};
    var register = () => {
        bankEmployee.email = email;
        bankEmployee.password = password;
        bankEmployee.name = name;
        bankEmployee.phone = phone;
        bankEmployee.position = position;
        console.log(bankEmployee);
        var requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bankEmployee)
        }
        console.log(requestOptions);
        fetch("http://localhost:5134/api/BankEmployeeLogin/register", requestOptions)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.log(err));


    };
    var changename = (eventargs) => {
        setEmail(eventargs.target.value)
    }
    return (
        <div>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Bank Employee Registration</h5>
                                <div className="alert divregister">
                                    <label className="form-control">Email</label>
                                    <input className="form-control" type="text" value={email}
                                        onChange={changename} />
                                    <label className="form-control">Password</label>
                                    <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <label className="form-control">Name</label>
                                    <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                    <label className="form-control">Position</label>
                                    <input className="form-control" type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
                                    <label className="form-control">Phone</label>
                                    <input className="form-control" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    <div className="buttons">
                                        <button onClick={register} className="btn success mx-auto ">Register</button>
                                        
                                    </div>
                                    <div className="buttons">
                                    <button className="btn cancel mx-auto">Cancel</button>
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
export default BankEmployeeRegistration;