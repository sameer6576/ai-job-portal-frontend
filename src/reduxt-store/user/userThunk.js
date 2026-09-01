import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
        const response=await api.post("/auth/login", credentials);


        if(response.data.jwt){
            localStorage.setItem("accessToken", response.data.jwt);
        }


        console.log("response ",response.data)

        return response.data;
        
    } catch (error) {
        console.log("error ",error)
      return rejectWithValue(error.response?.data?.message || "Failed to login user.");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
        const payload = { ...credentials };
        delete payload.confirmPassword;
        const response=await api.post("/auth/signup", payload);


        if(response.data.jwt){
            localStorage.setItem("accessToken", response.data.jwt);
        }


        console.log("response ",response.data)

        return response.data;
        
    } catch (error) {
        console.log("error ",error)
      return rejectWithValue(error.response?.data?.message || "Failed to register user.");
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      return (await api.post("/auth/forgot-password", { email })).data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send reset link.");
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      return (await api.post("/auth/reset-password", { token, newPassword: password })).data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to reset password.");
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      return (await api.post("/api/users/change-password", payload)).data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to change password.");
    }
  },
);


export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/users/profile");
      console.log("Fetched user profile:", response.data);
      return response.data;
    } catch (error) {
      console.log("Fetch user profile error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile."
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updatedUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/users/profile",data);
      console.log("updated user profile:", response.data);
      return response.data;
    } catch (error) {
      console.log("updated user profile error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user profile."
      );
    }
  }
);




