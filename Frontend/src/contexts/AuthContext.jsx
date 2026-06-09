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
        // Clear stale/invalid token on auth-related errors:
        // 401 = bad/expired token, 404 = user deleted, 500 = crash from null user
        const status = error.response?.status;
        if (status === 401 || status === 404 || status === 500) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  
  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  
  const register = async (username, email, password) => {
    const data = await registerUser({ username, email, password });
    
    return data;
  };

  
  const verifyUserOTP = async (email, otp) => {
    const data = await verifyOTP({ email, otp });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  
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