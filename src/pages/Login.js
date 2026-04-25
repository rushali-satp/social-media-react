import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../utils/alert";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users["admin"]) {
      users["admin"] = "admin";
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, []);

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true); // start loader

  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userLoginId: username,
        password: password
      })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("loggedInUser", JSON.stringify(data[0]));
      navigate("/home");
    } else {
      showError("Username or password incorrect");
    }
  } catch (error) {
    console.error(error);
    showError("Something went wrong");
  } finally {
    setLoading(false); // stop loader
  }
};


  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light">
      <div className="row w-100 mx-0">

        
        {/* Left Image Section */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-primary text-white">
          <div className="text-center p-5">
            <img
              src="https://images.unsplash.com/photo-1494172961521-33799ddd43a5?auto=format&fit=crop&w=900&q=80"
              alt="Social Media"
              className="img-fluid rounded shadow-lg mb-4"
              style={{ maxHeight: "65vh", objectFit: "cover" }}
            />
            <h2 className="fw-bold">Join the Mini Social Community</h2>
            <p className="text-light mt-3">
              Connect, post, and share your world — all saved locally for your privacy.
            </p>
          </div>
        </div>

        {/* Right Login Section */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card shadow-lg border-0 p-4" style={{ width: "90%", maxWidth: "400px" }}>
            <h3 className="text-center mb-4 fw-bold text-primary">Login / Register</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
             <button type="submit" className="btn btn-primary w-100 mt-2" disabled={loading}>
                {loading ? "Logging in..." : "Login / Register"}
             </button>
            </form>

            <p className="text-center text-muted mt-4 mb-0 small">
              Default user: <strong>admin / admin</strong>
            </p>

            <hr />

            <div className="text-center">
              <p className="text-muted small mb-2">New here?</p>
              <button
                className="btn btn-outline-primary btn-sm"
                type="button"
                onClick={() => navigate("/register")}
              >
                Create New Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 9999 }}>
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>


  );
};

export default Login;
