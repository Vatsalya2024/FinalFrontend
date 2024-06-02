import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../CustomerLogin/CustomerLogin.css";

function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedin, setLoggedin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    if (email === "") {
      setErrorMessage("Email Cannot Be Empty");
      return;
    }
    if (password === "") {
      setErrorMessage("Password Cannot Be Empty");
      return;
    }
    const user = {
      email: email,
      password: password,
      userType: "",
      token: "",
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };
    fetch("http://localhost:5134/api/Customer/Login", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (res.userType === "Customer") {
          sessionStorage.setItem("token", res.token);
          sessionStorage.setItem("email", res.email);
          sessionStorage.setItem("userType", res.userType);
          setLoggedin(true);
          navigate("/Customer/");
        } else {
          setLoggedin(false);
          setErrorMessage("Incorrect credentials");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoggedin(false);
        setErrorMessage("Incorrect credentials");
      });
  };

  return (
    <div className="alert divlogin">
      {loggedin ? (
        <h2 className="alert successMesage ">Welcome-{email}</h2>
      ) : null}
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-5"> Customer Login</h5>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      placeholder="email"
                      className="form-control"
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
                      placeholder="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="button loginbutton w-25 mx-auto">
                    <button onClick={login} className="btn  success mx-auto">
                      Login
                    </button>
                  </div>
                  <div className="button mt-1 w-25 mx-auto">
                    <button className="btn cancel mx-auto">Cancel</button>
                  </div>
                  <div className="text-center mt-4">
                    <Link to="/register" className="btn-link xd mx-auto ">
                      New Customer,Register
                    </Link>
                    <br />
                    <Link
                      to="/forgotpassword"
                      className="btn-link fogotpasswordlink mx-auto"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
