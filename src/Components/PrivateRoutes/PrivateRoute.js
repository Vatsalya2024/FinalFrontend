import { Navigate, Outlet } from "react-router-dom"

function PrivateRoute(){
    var isLoggedIn = sessionStorage.getItem('token')
    var userType = sessionStorage.getItem('userType');
    var isCustomer = isLoggedIn && userType === 'Customer';
    return(
        isCustomer ? <Outlet /> : <Navigate to='/login' />
    );
}

export default PrivateRoute;