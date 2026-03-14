import { createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk("login", async ({ email, password }) => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("Login failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
});

export const register = createAsyncThunk(
  "register",
  async ({ email, password }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
);

export const checkUser = createAsyncThunk("me", async () => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
});

export const logout = createAsyncThunk("logout", async () => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
    });
    if (!response.ok) {
      throw new Error("Logout failed");
    }
    return true;
  } catch (error) {
    throw error;
  }
});
