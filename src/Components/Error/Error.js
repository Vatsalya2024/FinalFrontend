import { Link } from 'react-router-dom';
import '../Error/Error.css'
function Error(){
    return(
        <div>
        <div className="errorpage">
            <h1 className="heads">OOPS!,Page not found</h1>
            <img src="https://png.pngtree.com/png-vector/20200313/ourmid/pngtree-page-not-found-error-404-concept-with-people-trying-to-fix-png-image_2157908.jpg"alt="Page not found"/><br/>
            <Link to='/'>Back</Link>
            

        </div>
        
        </div>
    );
}
export default Error;