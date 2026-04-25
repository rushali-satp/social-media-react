import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../utils/alert";

const Register = () => {
  const navigate = useNavigate();

  const [regUsername, setRegUsername] = useState("");
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  



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
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error();

      showSuccess("Account created successfully");
      navigate("/login");
    } catch (err) {
      showError("Error creating account");
    }finally {
    setLoading(false); // 🔹 stop loader
    }
  };

  

  return (
   
   <div
       style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f7971e, #ff512f)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
    >
      <div
         style={{
            width: "620px",
            padding: "30px",
            borderRadius: "12px",
            background: "rgba(196, 159, 159, 0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(235, 231, 231, 0.4)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            textAlign: "left",
            color: "#0c0c0c",
          }}
       >

        <h6 className="mb-3 text-center" style={{ fontWeight: "bold", letterSpacing: "1px" }}>Create Account</h6>

        

        {/* Username */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">
            Username
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            autoComplete="new-username"
            style={{
              background: "rgba(255,255,255,0.7)"
            }}
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
          />
          {errors.regUsername && (
            <div style={{ color: "white", fontSize: "12px" }}>
              {errors.regUsername}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">
            Password
          </label>
          <div className="input-group input-group-sm">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              autoComplete="new-password"
               style={{
              background: "rgba(255,255,255,0.7)"
            }}
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
          {errors.regPassword && (
              <div style={{ color: "white", fontSize: "12px" }}>
                {errors.regPassword}
              </div>
            )}
        </div>

        {/* Official Name */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">
            Official Name
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
             style={{
              background: "rgba(255,255,255,0.7)"
            }}
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
          />
          {errors.regName && (
            <div style={{ color: "white", fontSize: "12px" }}>
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
             style={{
              background: "rgba(255,255,255,0.7)"
            }}
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
          />
          {errors.emailId && (
            <div style={{ color: "white", fontSize: "12px" }}>
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
             style={{
              background: "rgba(255,255,255,0.7)"
            }}
            value={mobileNumber}
             maxLength={10}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          {errors.mobileNumber && (
            <div style={{ color: "white", fontSize: "12px" }}>
              {errors.mobileNumber}
            </div>
          )}
        </div>

          <div className="d-flex mt-4" style={{ gap: "10px" }}>
            <button 
              className="btn btn-success btn-sm" 
              onClick={handleRegister}
              disabled={loading}
              
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                "Register"
              )}
            </button>

          <button 
          style={{
              background: "linear-gradient(to right, #19791e99, #1faf6099)",
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
