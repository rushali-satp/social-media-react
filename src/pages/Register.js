import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [regUsername, setRegUsername] = useState("");
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const handleRegister = async () => {
    if (!regUsername || !regName || !regPassword || !emailId || !mobileNumber) {
      alert("All fields are required");
      return;
    }

    const payload = {
      userLoginId: regUsername,
      userOfficialName: regName,
      password: regPassword,
      isUser: "Y",
      emailId: emailId,
      mobileNo: mobileNumber,
    };

    try {
      const response = await fetch("http://localhost:8080/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error();

      alert("Account created successfully");
      navigate("/login");
    } catch (err) {
      alert("Error creating account");
    }
  };

  return (
    <div style={{ width: "50%", marginLeft: "27%" }}>
      <div className="card mt-4 p-5" >

        <h6 className="mb-3 text-center">Create Account</h6>

        

        {/* Username */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">
            Username
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label small fw-semibold">
            Password
          </label>
          <div className="input-group input-group-sm">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Official Name */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">
            Official Name
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
          />
        </div>

        {/* Email Id */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">
            Email Id
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
          />
        </div>

        {/* Mobile Number */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">
            Mobile Number
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-success btn-sm" onClick={handleRegister}>
            Register
          </button>

          <button 
          style={{
              background: "linear-gradient(to right, #5f2e6e99, #9b59b699)",
              width: "19%",
              marginLeft: "59%",
              color: "white",
            }}
          className="btn btn-link  btn-sm"
          type="button"
          onClick={() => navigate("/login")}
        >
           Back to Login
        </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/login")}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default Register;
