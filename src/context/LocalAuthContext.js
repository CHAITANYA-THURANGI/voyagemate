import React, { createContext, useState, useEffect, useContext } from 'react';
import { localAuth } from '../services/localAuth';

const LocalAuthContext = createContext();

export function useLocalAuth() {
  return useContext(LocalAuthContext);
}

export function LocalAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = localAuth.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const signup = async (email, password, name) => {
    setLoading(true);
    try {
      const user = await localAuth.signup(email, password, name);
      setCurrentUser(user);
      setError('');
      setLoading(false);
      return user;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await localAuth.login(email, password);
      setCurrentUser(user);
      setError('');
      setLoading(false);
      return user;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Add Google login function
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const user = await localAuth.loginWithGoogle();
      setCurrentUser(user);
      setError('');
      setLoading(false);
      return user;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await localAuth.logout();
      setCurrentUser(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId, data) => {
    setLoading(true);
    try {
      const updatedUser = await localAuth.updateProfile(userId, data);
      setCurrentUser(updatedUser);
      setLoading(false);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    loginWithGoogle, // Add this
    logout,
    updateUserProfile
  };

  return (
    <LocalAuthContext.Provider value={value}>
      {children}
    </LocalAuthContext.Provider>
  );
}