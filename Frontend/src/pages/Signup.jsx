import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../contexts/AuthContext";


function Signup() {

  const navigate =
    useNavigate();

  const { register } =
    useAuth();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      // PASSWORD MATCH CHECK
      if (
        password !== confirmPassword
      ) {
        return setError(
          "Passwords do not match"
        );
      }

      try {

        setLoading(true);

        await register(
          username,
          email,
          password
        );

        // Save email so VerifyOTP page knows who to verify
        localStorage.setItem("verifyEmail", email);

        navigate("/verify-otp");

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Signup failed"
        );

      } finally {

        setLoading(false);
      }
    };


  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#0f0f0f]
      px-4
    ">

      <form
        onSubmit={handleSubmit}
        className="
          bg-[#1a1a1a]
          p-8
          rounded-2xl
          shadow-xl
          w-full
          max-w-md
          border
          border-[#2a2a2a]
        "
      >

        <h1 className="
          text-white
          text-3xl
          font-bold
          mb-6
          text-center
        ">
          Create Account
        </h1>

        {error && (
          <div className="
            bg-red-500/10
            border
            border-red-500/30
            text-red-400
            p-3
            rounded-lg
            mb-4
            text-sm
          ">
            {error}
          </div>
        )}

        {/* USERNAME */}
        <div className="mb-4">

          <label className="
            block
            text-gray-300
            mb-2
            text-sm
          ">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
            className="
              w-full
              p-3
              rounded-lg
              bg-[#2a2a2a]
              text-white
              border
              border-[#3a3a3a]
              focus:outline-none
              focus:ring-2
              focus:ring-purple-600
            "
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">

          <label className="
            block
            text-gray-300
            mb-2
            text-sm
          ">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="
              w-full
              p-3
              rounded-lg
              bg-[#2a2a2a]
              text-white
              border
              border-[#3a3a3a]
              focus:outline-none
              focus:ring-2
              focus:ring-purple-600
            "
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">

          <label className="
            block
            text-gray-300
            mb-2
            text-sm
          ">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            className="
              w-full
              p-3
              rounded-lg
              bg-[#2a2a2a]
              text-white
              border
              border-[#3a3a3a]
              focus:outline-none
              focus:ring-2
              focus:ring-purple-600
            "
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-6">

          <label className="
            block
            text-gray-300
            mb-2
            text-sm
          ">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            required
            className="
              w-full
              p-3
              rounded-lg
              bg-[#2a2a2a]
              text-white
              border
              border-[#3a3a3a]
              focus:outline-none
              focus:ring-2
              focus:ring-purple-600
            "
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-purple-600
            hover:bg-purple-700
            transition
            text-white
            p-3
            rounded-lg
            font-semibold
            disabled:opacity-50
          "
        >

          {loading
            ? "Creating Account..."
            : "Sign Up"}

        </button>

        {/* LOGIN LINK */}
        <p className="
          text-gray-400
          text-sm
          mt-6
          text-center
        ">
          Already have an account?{" "}

          <Link
            to="/login"
            className="
              text-purple-500
              hover:text-purple-400
            "
          >
            Login
          </Link>

        </p>

      </form>
    </div>
  );
}

export default Signup;