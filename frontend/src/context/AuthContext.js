import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getUserProfile } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = useCallback(async (tokenValue) => {
        if (!tokenValue) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await getUserProfile();
            setUser(res.data);
        } catch (err) {
            console.error("Failed to load user profile in AuthContext:", err);
            // If token is invalid or expired, clear it
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserProfile(token);
    }, [token, fetchUserProfile]);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        if (userData) {
            setUser(userData);
        } else {
            fetchUserProfile(newToken);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
        refreshProfile: () => fetchUserProfile(token)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
