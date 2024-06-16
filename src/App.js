import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import LandingPage from "./Components/LandingPage/LandingPage";
import CustomerLogin from "./Components/CustomerLogin/CustomerLogin";
import BankEmployeeLogin from "./Components/BankEmployeeLogin/BankEmployeeLogin";
import AdminLogin from "./Components/AdminLogin/AdminLogin";
import AdminCustomerManagement from "./Components/AdminCustomerManagement/AdminCustomerManagement";
import AdminBankEmployeeManagement from "./Components/AdminBankEmployeeManagement/AdminBankEmployeeManagement";
import AdminNavigation from "./Components/Navigation/AdminNavigation";
import Customer from "./Components/Customer/Customer";
import CustomerAccount from "./Components/CustomerAccount/CustomerAccount";
import CustomerLoan from "./Components/CustomerLoan/CustomerLoan";
import CustomerTransactions from "./Components/CustomerTransactions/CustomerTransactions";
import DetailedTransactions from "./Components/Transactions/DetailedTransactions";
import CustomerRegistration from "./Components/CustomerRegistraion/CustomerRegistration";
import LandingPageNav from "./Components/Navigation/LandingPageNav";
import CustomerNav from "./Components/Navigation/CustomerNav";
import CustomerLoginNav from "./Components/Navigation/CustomerLoginNav";
import BankEmployeeAccount from "./Components/BankEmployeeAccount/BankEmployeeAccount";
import BankEmployeeNavigation from "./Components/Navigation/BankEmployeeNavigation";
import BankEmployeeLoan from "./Components/BankEmployeeLoan/BankEmployeeLoan";
import BankEmployeeTransaction from "./Components/BankEmployeeTransaction/BankEmployeeTransaction";
import PrivateRoute from "./Components/PrivateRoutes/PrivateRoute";
import PrivateRouteBE from "./Components/PrivateRoutes/PrivateRouteBE";
import PrivateRouteA from "./Components/PrivateRoutes/PrivateRouteA";
import BankEmployeeLoginNavigation from "./Components/Navigation/BankEmployeeLoginNav";
import AdminLoginNavigation from "./Components/Navigation/AdminLoginNavigation";
import CustomerRegistraionNav from "./Components/Navigation/CustomerRegistraionNav";
import BankEmployeeRegistraion from "./Components/BankEmployeeRegistration/BankEmployeeRegistration";
import Error from "./Components/Error/Error";
import ForgotPassword from "./Components/Password/ForgotPassword";
import Navigation from "./Components/Navigation/Navigation";
import About from "./Components/About/About";
import CustomerBeneficiary from "./Components/CustomerBeneficiary/CustomerBeneficiary";
import ForgotPasswordBE from "./Components/Password/ForgotPasswordBE";
import EmployeeInfo from "./Components/Profile/EmployeeInfo";
function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <LandingPageNav />
                  <LandingPage />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <CustomerLoginNav />
                  <CustomerLogin />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <CustomerRegistraionNav />
                  <CustomerRegistration />
                </>
              }
            />
            <Route
              path="/login/bankemployeelogin"
              element={
                <>
                  <BankEmployeeLoginNavigation />
                  <BankEmployeeLogin />
                </>
              }
            />
            <Route
              path="/login/adminlogin"
              element={
                <>
                  <AdminLoginNavigation />
                  <AdminLogin />
                </>
              }
            />
            <Route
              path="/bankemployeeregister"
              element={<BankEmployeeRegistraion />}
            />

            <Route
              path="/admincustomermanagement"
              element={
                <>
                  <PrivateRouteA />
                  <AdminNavigation />
                  <AdminCustomerManagement />
                </>
              }
            />
            <Route
              path="/adminbankemployeemanagement"
              element={
                <>
                  <PrivateRouteA />
                  <AdminNavigation />
                  <AdminBankEmployeeManagement />
                </>
              }
            />

            <Route
              path="/bankemployee/account/*"
              element={
                <>
                  <BankEmployeeNavigation />
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <>
                          <PrivateRouteBE />
                          <BankEmployeeAccount />
                        </>
                      }
                    />
                    <Route
                      path="loans"
                      element={
                        <>
                          <PrivateRouteBE />
                          <BankEmployeeLoan />
                        </>
                      }
                    />
                    <Route
                      path="transactions"
                      element={
                        <>
                          <PrivateRouteBE />
                          <BankEmployeeTransaction />
                        </>
                      }
                    />
                  </Routes>
                </>
              }
            />
            <Route
              path="/customer/*"
              element={
                <>
                  <CustomerNav />
                  <Routes>
                    <Route
                      path="/account"
                      element={
                        <>
                          <PrivateRoute />
                          <CustomerAccount />
                        </>
                      }
                    />
                    <Route
                      path="/loan"
                      element={
                        <>
                          <PrivateRoute /> <CustomerLoan />
                        </>
                      }
                    />
                    <Route
                      path="/transactions"
                      element={
                        <>
                          <PrivateRoute /> <CustomerTransactions />
                        </>
                      }
                    />
                    <Route
                      path="/detailed-transactions"
                      element={
                        <>
                          <PrivateRoute /> <DetailedTransactions />
                        </>
                      }
                    />
                  </Routes>
                </>
              }
            />
            <Route
              path="/customer"
              element={
                <>
                  <PrivateRoute />
                  <CustomerNav />
                  <Customer />
                </>
              }
            />
            <Route
              path="*"
              element={
                <>
                  <Error />
                </>
              }
            />
            <Route
              path="/forgotpassword"
              element={
                <>
                  <Navigation />
                  <ForgotPassword />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <CustomerRegistraionNav />
                  <About />
                </>
              }
            />
            <Route
              path="/beneficiary"
              element={
                <>
                  <PrivateRoute />
                  <CustomerNav />
                  <CustomerBeneficiary />
                </>
              }
            />
            <Route
              path="/bankemployeeprofile"
              element={
                <>
                  <BankEmployeeNavigation />
                  <EmployeeInfo />
                </>
              }
            />
            <Route
              path="/forgotpasswordbe"
              element={
                <>
                  <Navigation />
                  <ForgotPasswordBE />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
