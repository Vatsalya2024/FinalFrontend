import React from "react";
import '../About/About.css'
function About(){
    return(
        <div className="container my-4">
        <div className="row featurette d-flex justify-content-center align-items-center">
            <div className="col-md-7">
                <h2 className="featurette-heading">About Us </h2>
                <p className="lead">Maverick Bank has been a cornerstone of financial stability and growth since its
                    establishment. With a rich history rooted in integrity and customer satisfaction, we have evolved to
                    become a leading name in the banking industry. Our commitment to excellence is reflected in the
                    range of services we offer, the strength of our relationships, and the trust our customers place in
                    us.</p>
            </div>
            <div className="col-md-5">
                <img className="img-fluid" src="https://static.vecteezy.com/system/resources/previews/006/835/879/original/bank-building-with-columns-flat-cartoon-style-illustration-government-building-financial-house-building-facade-architecture-with-column-front-view-of-bank-isolated-on-white-background-vector.jpg" alt=""/>
            </div>
        </div>
        <div className="row featurette d-flex justify-content-center align-items-center">
            <div className="col-md-7 order-md-2">
                <h2 className="featurette-heading">Our Vision
                </h2>
                <p className="lead">Empowering Your Financial Journey – Maverick Bank envisions a future where banking is
                    not just a necessity but a source of empowerment for individuals and businesses alike. We aim to be
                    a catalyst for financial success, providing comprehensive solutions that go beyond traditional
                    banking.</p>
            </div>
            <div className="col-md-5 order-md-1">
                <img className="img-fluid" src="https://img.freepik.com/premium-vector/customer-service-illustration-happy-clients-friendly-staff-smiling-man-woman-reception-passport-office-travel-agency_575670-645.jpg" alt=""/>
            </div>
        </div>
        <div className="row featurette d-flex justify-content-center align-items-center">
            <div className="col-md-7">
                <h2 className="featurette-heading">Contact Maverick Bank
                </h2>
                <p className="lead">Ready to embark on a journey of financial excellence? Contact Maverick Bank today to
                    explore our services, or visit our branches to meet our friendly team. We look forward to serving
                    you and being a trusted partner in your financial success.

                    Maverick Bank – Where Your Financial Success Takes Flight!</p>
            </div>
            <div className="col-md-5">
                <img className="img-fluid" src="https://img.freepik.com/free-vector/bank-composition-with-indoor-scenery-bank-branch-with-waiting-people-withdrawing-money-talking-with-clerks-vector-illustration_1284-82671.jpg" alt=""/>
            </div>
        </div>
    </div>

    );
}
export default About;