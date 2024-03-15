import { Navigate, Outlet } from "react-router-dom"

function PrivateRouteBE(){
    var isLoggedIn = sessionStorage.getItem('token')
    var userType = sessionStorage.getItem('userType');
    var isCustomer = isLoggedIn && userType === 'BankEmployee';
    return(
        isCustomer ? <Outlet /> : <Navigate to='/login/bankemployeelogin' />
    );
}

export default PrivateRouteBE;