import React from 'react';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPiggyBank, faWallet, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import '../LandingPage/style.css';
import { Link } from 'react-router-dom';


function LandingPage() {
  return (
    <div>

      <div id="home" className="container-fluid text-center content-section">
        <h1 className="display-3 mb-3 animate__animated animate__fadeInUp"><strong>WELCOME TO</strong></h1>
        <h1 className="display-4 fw-bold  animate__animated animate__fadeInUp">MAVERICK BANK</h1>
        <p className="lead mt-3 animate__animated animate__fadeInUp">Your Trusted Partner in Financial Success</p>
      </div>

      <section id="pic-car">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 block-element ">
              <FontAwesomeIcon icon={faPiggyBank} className="fa-3x icon" />
              <h3>Easy to use.</h3>
              <p>Seamlessly manage your finances with our intuitive interface at EasyBank. Simplify your banking experience today.</p>
            </div>
            <div className="col-lg-4 block-element">
              <FontAwesomeIcon icon={faWallet} className="fa-3x icon" />
              <h3>Loans</h3>
              <p>Unlock your aspirations with our flexible loan solutions tailored to your needs. Achieve your goals with our hassle-free loan process.</p>
            </div>
            <div className="col-lg-4 block-element">
              <FontAwesomeIcon icon={faCreditCard} className="fa-3x icon" />
              <h3>Easy Transactions</h3>
              <p>Experience smooth and secure transactions with our user-friendly platform. Simplify your financial interactions with just a few clicks.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <h2>Enjoy swift and secure money transfers at your fingertips, with our intuitive banking platform designed for effortless transactions.</h2>
              <img className="d-block w-100" src="https://cdn.pixabay.com/photo/2021/11/15/06/01/credit-card-6796444_1280.png" alt="dog-profile" />
            </div>
            <div className="carousel-item">
              <h2 className="testimonial-text">Secure hassle-free loans with competitive rates, tailored to meet your financial needs, empowering you to achieve your goals with confidence.</h2>
              <img className="d-block w-100" src="https://img.freepik.com/premium-vector/applying-loan-bank_701961-7583.jpg" alt="lady-profile" />
            </div>
          </div>
          <button className="carousel-control-prev" type="buttonm" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="buttonm" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </section>

      <section id="login-signup" className="content-section">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <h2>Login</h2>
            <p>Already have an account? Log in here.</p>
            <Link className='btn' to="/login">Login</Link>
          </div>
          <div className="col-md-6 text-center">
            <h2>Don't have an account yet?</h2>
            <p>Sign up now to get started!</p>
            <Link className='btn' to='/register'>Sign Up</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
