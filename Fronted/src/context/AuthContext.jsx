import React, { createContext, useState, useContext, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper function to decode JWT
function decodeJWT(token) {
  try {
    // Get payload part (second part of JWT)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonString = atob(base64);
    const decoded = JSON.parse(jsonString);
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        // Get token from cookies as fallback
        const cookieString = document.cookie;
        const cookies = cookieString.split("; ");
        const tokenCookie = cookies.find((row) => row.startsWith("token="));

        if (tokenCookie) {
          const token = tokenCookie.split("=")[1];
          const decoded = decodeJWT(token);
          if (decoded) {
            const u = {
              id: decoded.id,
              role: decoded.role,
              username: decoded.username || "User",
            };
            setUser(u);
            localStorage.setItem("user", JSON.stringify(u));
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      const response = await API.post("/auth/register", userData);
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await API.post("/auth/login", credentials);
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return { success: true };
    }
  };

  const value = {
    user,
    setUser,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isArtist: user?.role === "artist",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
