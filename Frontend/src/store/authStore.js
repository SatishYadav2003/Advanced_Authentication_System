import { create } from 'zustand';
import axios from 'axios';


const API_URL = 'http://localhost:5000/api/auth';

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,


    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, name });
            set({ user: response.data.userDetails, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    verifyEmail: async (verificationCodeProvidedByUser) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { verificationCodeProvidedByUser });
            set({ user: response.data.userDetails, isLoading: false, isAuthenticated: true });
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }

    },


    checkAuth: async () => {


        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.userDetails, isCheckingAuth: false, isAuthenticated: true })
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },

    login: async (email, password) => {

        set({ isLoading: true, error: null });


        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });



            set({ user: response.data.userDetails, isAuthenticated: true, error: null, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error logging out", isLoading: false });
            throw error;
        }
    },

    forgotPassword: async (email) => {

        set({ isLoading: true, error: null });

        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            set({ message: response.data.message, isLoading: false })
        } catch (error) {

            set({ message: error.response.data.message || "Unable to reset password", isLoading: false });
            throw error;
        }
    },

    resetPassword: async (password, token) => {
        set({ isLoading: true, error: null, message: null });

        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });

            set({ isLoading: false, message: response.data.message || "Password reset successfully" })
        } catch (error) {
            set({ isLoading: false, error: error.response.data.message || "Error resetting password" });
            throw error;
        }
    },

    resetError: () => set({ error: null }),





}))