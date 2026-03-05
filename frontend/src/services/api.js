import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (userData) => api.post('/auth/login', userData);
export const getHackathons = () => api.get('/hackathons');
export const getHackathonDetails = (id) => api.get(`/hackathons/${id}`);
export const getUserProfile = () => api.get('/users/profile');

export default api;
