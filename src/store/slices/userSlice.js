import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial State
const initialState = {
  loading: false,
  isAuthenticated: false,
  user: {},
  error: null,
  message: null,
};

// Create Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.message = action.payload.message;
    },
    requestFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
      state.message = null;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const {
  requestStart,
  requestSuccess,
  requestFailed,
  fetchUserSuccess,
  logoutSuccess,
  clearAllErrors,
} = userSlice.actions;

const axiosConfig = {
  withCredentials: true,
};

export const register = (data) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const response = await axios.post(
      "https://gbc-jobfinder-backend.onrender.com/api/v1/user/register",
      data,
      {
        ...axiosConfig,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(requestSuccess(response.data));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(requestFailed(error.response.data.message));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const response = await axios.post(
      "https://gbc-jobfinder-backend.onrender.com/api/v1/user/login",
      data,
      {
        ...axiosConfig,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(requestSuccess(response.data));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(requestFailed(error.response.data.message));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(requestStart());
  try {
    const response = await axios.get(
      "https://gbc-jobfinder-backend.onrender.com/api/v1/user/getuser",
      axiosConfig
    );
    dispatch(fetchUserSuccess(response.data.user));
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(requestFailed(error.response.data.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.get("https://gbc-jobfinder-backend.onrender.com/api/v1/user/logout", axiosConfig);
    dispatch(logoutSuccess());
    dispatch(clearAllErrors());
  } catch (error) {
    dispatch(requestFailed(error.response.data.message));
  }
};

export const clearAllUserErrors = () => (dispatch) => {
  dispatch(clearAllErrors());
};

export default userSlice.reducer;
