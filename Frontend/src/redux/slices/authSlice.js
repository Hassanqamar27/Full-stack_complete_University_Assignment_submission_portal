import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios"; // Ensure the import path is correct

// Define initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post("/login", credentials);
      return response.data; // Assuming response.data contains the user information
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axios.post("/logout");
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

// Async thunk for signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (signupData, thunkAPI) => {
    try {
      const response = await axios.post("/signup", signupData);
      return response.data; // Assuming response.data contains the user information
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

// Async thunk for OTP verification
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ id, otp }, thunkAPI) => {
    try {
      console.log("Payload:", { id, otp }); // Log payload for debugging
      const response = await axios.post("/verify-otp", { id, otp });
      console.log("Response:", response.data); // Log response for debugging
      return response.data;
    } catch (error) {
      console.error("Error during OTP verification:", error.response?.data); // Log detailed error
      return thunkAPI.rejectWithValue(
        error.response?.data || "OTP verification failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Optionally, you can update the user state after OTP verification
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
