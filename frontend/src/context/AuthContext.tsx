import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

// Define authentication context type
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// JWT payload structure (assuming it contains exp)
interface DecodedToken {
  userId: string;
  role: string;
  exp: number; // Expiration time in seconds
  iat: number; // Issued-at time in seconds
}

// Create Context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const expTime = localStorage.getItem("exp");
    if (expTime) {
      return parseInt(expTime) * 1000 > Date.now();
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    isTokenValid(localStorage.getItem("authToken"))
  );

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!isTokenValid(token)) {
      logout();
    }
  }, []);

  const login = (token: string) => {
    try {
      localStorage.setItem("authToken", token);
      const decoded: DecodedToken = jwtDecode(token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ userId: decoded.userId, role: decoded.role })
      );
      localStorage.setItem("exp", decoded.exp.toString());
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("exp");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
