import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            if (error.response?.data?.needsVerification) throw error.response.data;
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            return data; // Returns { message, email }
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'OTP verification failed';
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    };

    const forgotPassword = async (email) => {
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to process request';
        }
    };

    const verifyResetOTP = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-reset-otp', { email, otp });
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Invalid or expired verification code';
        }
    };

    const resetPassword = async (email, otp, newPassword) => {
        try {
            const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to reset password';
        }
    };

    const resendOTP = async (email, action = 'account_verification') => {
        try {
            const { data } = await api.post('/auth/resend-otp', { email, action });
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to resend code';
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                verifyOTP,
                logout,
                forgotPassword,
                verifyResetOTP,
                resetPassword,
                resendOTP,
                loading
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
