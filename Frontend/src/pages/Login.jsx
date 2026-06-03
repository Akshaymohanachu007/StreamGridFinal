import React, {
  useState,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../contexts/AuthContext";


function Login() {

  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await login(
          email,
          password
        );

        navigate("/");

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Login failed"
        );
      }
    };


  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#0f0f0f]
    ">

      <form
        onSubmit={handleSubmit}
        className="
          bg-[#1a1a1a]
          p-8
          rounded-xl
          w-full
          max-w-md
        "
      >

        <h1 className="
          text-white
          text-3xl
          mb-6
        ">
          Login
        </h1>

        {error && (
          <p className="
            text-red-500
            mb-4
          ">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            w-full
            p-3
            mb-4
            rounded
            bg-[#2a2a2a]
            text-white
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            w-full
            p-3
            mb-4
            rounded
            bg-[#2a2a2a]
            text-white
          "
        />

        <button
          type="submit"
          className="
            w-full
            bg-purple-600
            hover:bg-purple-700
            text-white
            p-3
            rounded
          "
        >
          Login
        </button>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-500 hover:text-purple-400"
          >
            Sign Up
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Login;