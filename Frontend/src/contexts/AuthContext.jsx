import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  verifyOTP,
} from "../services/authService";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);


  // LOAD CURRENT USER on mount / token change
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to load user:", error);
        if (error.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);


  // LOGIN — sets token + user immediately
  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };


  // REGISTER — only sends OTP; does NOT log the user in yet
  const register = async (username, email, password) => {
    const data = await registerUser({ username, email, password });
    // Don't set token/user here — user must verify OTP first
    return data;
  };


  // VERIFY OTP — called from VerifyOTP page; logs the user in on success
  const verifyUserOTP = async (email, otp) => {
    const data = await verifyOTP({ email, otp });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };


  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        verifyUserOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);