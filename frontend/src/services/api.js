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
export const getHackathons = (query = '') => api.get(`/hackathons${query}`);
export const getHackathonDetails = (id) => api.get(`/hackathons/${id}`);
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (profileData) => api.put('/users/profile', profileData);
export const getAllUsers = () => api.get('/users');

// --- Team Endpoints ---
export const createTeam = (teamData) => api.post('/team/create', teamData);
export const getMyTeams = () => api.get('/team/my-teams');
export const sendTeamRequest = (teamId) => api.post(`/team/${teamId}/request`);
export const acceptTeamRequest = (teamId, data) => api.put(`/team/${teamId}/accept`, data);

// --- Recommendation Endpoint ---
export const getRecommendedTeammates = () => api.get('/users/recommendations');

// --- Chat Endpoint ---
export const getChatHistory = (roomId) => api.get(`/chat/${roomId}`);
export const getMyChats = () => api.get('/chat/my-chats');

export default api;
