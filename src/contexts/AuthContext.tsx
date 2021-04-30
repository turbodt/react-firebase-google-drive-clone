import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

type User = any;

export interface IAuthContext {
  currentUser?: User;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateEmail: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
}

const defaultAuthContext: IAuthContext = {
  signup: async (email: string, password: string) => {},
  login: async (email: string, password: string) => {},
  logout: async () => {},
  resetPassword: async (email: string) => {},
  updateEmail: async (email: string) => {},
  updatePassword: async (password: string) => {},
};

const AuthContext = React.createContext<IAuthContext>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

interface IAuthProvider {
  children: React.ReactNode;
}
export const AuthProvider = ({ children }: IAuthProvider) => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);

  const signup = auth.createUserWithEmailAndPassword.bind(auth);
  const login = auth.signInWithEmailAndPassword.bind(auth);
  const logout = auth.signOut.bind(auth);
  const resetPassword = auth.sendPasswordResetEmail.bind(auth);
  const updateEmail =
    currentUser?.updateEmail.bind(currentUser) ||
    defaultAuthContext.updateEmail;
  const updatePassword =
    currentUser?.updatePassword.bind(currentUser) ||
    defaultAuthContext.updatePassword;

  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
        setLoading(false);
      }),
    []
  );

  const value: IAuthContext = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading || children}
    </AuthContext.Provider>
  );
};
