import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function VerifyOTP() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef([]);

  const email = localStorage.getItem("verifyEmail") || "your email";
  const { verifyUserOTP } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      
      
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
    
    inputRefs.current[5].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      return setError("Please enter a valid 6-digit code");
    }

    try {
      setLoading(true);
      await verifyUserOTP(email, otpCode);
      
      
      localStorage.removeItem("verifyEmail");
      
      
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Verification failed. Please check the code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0f] px-4 font-sans antialiased relative overflow-hidden">
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="bg-[#141416]/80 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        
        
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-red-500/20">S</span>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">StreamGrid</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center tracking-tight mb-2">
          Verify Your Email
        </h2>
        
        <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
          We've sent a 6-digit verification code to <br />
          <span className="text-red-400 font-medium">{email}</span>
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center mb-6 transition-all duration-300 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => (inputRefs.current[idx] = el)}
                onChange={(e) => handleChange(e.target, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-14 text-center text-xl font-semibold bg-[#1e1e22] text-white border border-white/10 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all duration-200 shadow-inner"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white p-3.5 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <span>Didn't receive the code? </span>
          {resendTimer > 0 ? (
            <span className="text-red-400 font-medium">Resend in {resendTimer}s</span>
          ) : (
            <button 
              onClick={() => {
                setResendTimer(60);
                setError("");
                
                setOtp(Array(6).fill(""));
                inputRefs.current[0].focus();
              }}
              className="text-red-500 hover:text-red-400 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-none"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
