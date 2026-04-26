import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  avatar_url?: string;
  phone_changed_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  setUser: (user: User | null) => Promise<void>;
  updateToken: (token: string, user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUserState(parsedUser);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserState(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserState(null);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["userToken", "userData"]);
      setUserState(null);
      setIsLoggedIn(false);
      router.replace("/auth/login");
    } catch (error) {
    }
  };

  const setUser = async (newUser: User | null) => {
    try {
      if (newUser) {
        await AsyncStorage.setItem("userData", JSON.stringify(newUser));
        setUserState(newUser);
      } else {
        await AsyncStorage.removeItem("userData");
        setUserState(null);
      }
    } catch (error) {
    }
  };

  const updateToken = async (token: string, newUser: User) => {
    try {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(newUser));
      setUserState(newUser);
      setIsLoggedIn(true);
    } catch (error) {
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, logout, setUser, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
