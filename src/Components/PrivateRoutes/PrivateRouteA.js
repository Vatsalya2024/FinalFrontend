import { Navigate, Outlet } from "react-router-dom"

function PrivateRouteA(){
    var isLoggedIn = sessionStorage.getItem('token')
    var userType = sessionStorage.getItem('userType');
    var isCustomer = isLoggedIn && userType === 'Admin';
    return(
        isCustomer ? <Outlet /> : <Navigate to='/login/adminlogin' />
    );
}

export default PrivateRouteA;