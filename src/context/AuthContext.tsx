import {
  createContext,
  useState,
  type ReactNode
} from "react";

interface AuthContextType {

  token: string | null;
  role: string | null;

  login: (
    token: string,
    role: string
  ) => void;

  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [token, setToken] =
    useState(localStorage.getItem("token"));

  const [role, setRole] =
    useState(localStorage.getItem("role"));

  const login = (
    token: string,
    role: string
  ) => {

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    setToken(token);
    setRole(role);
  };

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}