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
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    const newErrors = {};
     const mobileRegex = /^[6-9]\d{9}$/;
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     const usernameRegex = /^[^\s.]+$/;


   if (!regUsername) {
    newErrors.regUsername = "Username is required";
  } else if (!usernameRegex.test(regUsername)) {
    newErrors.regUsername = "No spaces or dots allowed";
  }

  if (!regName) {
    newErrors.regName = "Official Name is required";
  }

  if (!regPassword) {
    newErrors.regPassword = "Password is required";
  }

  
  if (!emailId) {
    newErrors.emailId = "Email is required";
  } else if (!emailRegex.test(emailId)) {
    newErrors.emailId = "Invalid email format";
  }

  if (!mobileNumber) {
    newErrors.mobileNumber = "Mobile number is required";
  } else if (!mobileRegex.test(mobileNumber)) {
    newErrors.mobileNumber = "Must be 10 digits & start with 6-9";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({}); 

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
          {errors.regUsername && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors.regUsername}
            </div>
          )}
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
            {errors.regPassword && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {errors.regPassword}
              </div>
            )}
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
          {errors.regName && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors.regName}
            </div>
          )}
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
          {errors.emailId && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors.emailId}
            </div>
          )}
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
          {errors.mobileNumber && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors.mobileNumber}
            </div>
          )}
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
