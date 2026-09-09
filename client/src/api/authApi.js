//This file will contain all communication between React and authentication endpoints.
import axiosClient from './axiosClient'

export const register = async(userData)=>{
    const response = await axiosClient.post('/auth/register',userData)
    return response.data
}
export const login = async (credentials) => {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data;
};

export const logout = async () => {
  const response = await axiosClient.get("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosClient.get("/auth/me");
  return response.data;
};
export const sendVerifyOtp = async()=>{
    const response = await axiosClient.post('/auth/send-verify-otp')
    return response.data
}
export const verifyAccount = async (otp) => {
    const response = await axiosClient.post("/auth/verify-account", {
        otp,
    });
    return response.data;
};

export const sendResetPasswordOtp = async (email) => {
    const response = await axiosClient.post("/auth/send-reset-otp", {
        email,
    });
    return response.data;
};

export const resetPassword = async (data) => {
    const response = await axiosClient.post("/auth/reset-password", data);
    return response.data;
};