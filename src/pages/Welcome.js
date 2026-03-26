import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 mx-0">
        {/* Left Section - Image */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <img
            src="https://images.unsplash.com/photo-1494173853739-c21f58b16055?auto=format&fit=crop&w=900&q=80"
            alt="Social media"
            className="img-fluid rounded shadow-lg"
            style={{ maxHeight: "85vh", objectFit: "cover" }}
          />
        </div>

        {/* Right Section - Content */}
        <div className="col-md-6 d-flex flex-column justify-content-center text-center p-5">
          <h1 className="fw-bold mb-3 text-primary">Welcome to Mini Social</h1>
          <p className="text-muted mb-4">
            <strong>Mini Social</strong> is your space to connect, share moments, and express yourself.  
            Post updates, like what you love, and be part of a growing community — all saved securely on your browser.  
            No signups, no servers — just you and your friends!
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-primary btn-lg px-4">
              Get Started
            </Link>
            <a
              href="#learn-more"
              className="btn btn-outline-secondary btn-lg px-4"
            >
              Learn More
            </a>
          </div>

          {/* Decorative Section */}
          <div id="learn-more" className="mt-5">
            <h5 className="fw-bold mb-3">Why Mini Social?</h5>
            <div className="d-flex flex-column align-items-center gap-3">
              <div className="card shadow-sm border-0 w-75">
                <div className="card-body">
                  <h6 className="card-title fw-bold">💬 Instant Sharing</h6>
                  <p className="card-text text-muted">
                    Post your thoughts and see them instantly without any delay.
                  </p>
                </div>
              </div>
              <div className="card shadow-sm border-0 w-75">
                <div className="card-body">
                  <h6 className="card-title fw-bold">👍 Like & Engage</h6>
                  <p className="card-text text-muted">
                    Interact with posts and express appreciation with a simple click.
                  </p>
                </div>
              </div>
              <div className="card shadow-sm border-0 w-75">
                <div className="card-body">
                  <h6 className="card-title fw-bold">🔒 100% Local</h6>
                  <p className="card-text text-muted">
                    Your data stays on your browser — private, secure, and personal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-5 text-muted small">
            © {new Date().getFullYear()} Mini Social. Built with ❤️ using React & Bootstrap.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
