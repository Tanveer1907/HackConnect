import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api`,
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
export const forgotPassword = (emailData) => api.post('/auth/forgot-password', emailData);
export const resetPassword = (resetData) => api.post('/auth/reset-password', resetData);
export const getHackathons = (query = '') => api.get(`/hackathons${query}`);
export const getHackathonDetails = (id) => api.get(`/hackathons/${id}`);
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (profileData) => api.put('/users/profile', profileData);
export const getAllUsers = () => api.get('/users');

// --- Internship Endpoints ---
export const getInternships = (query = '') => api.get(`/internships${query}`);
export const getInternshipDetails = (id) => api.get(`/internships/${id}`);
export const applyToInternship = (id, applicationData) => api.post(`/internships/${id}/apply`, applicationData);
export const getMyInternshipApplications = () => api.get('/internships/my-applications');
export const withdrawInternshipApplication = (id) => api.put(`/internships/application/${id}/withdraw`);

// --- Admin Moderation Endpoints ---
export const getPendingModeration = () => api.get('/admin/moderation/pending');
export const moderateItem = (type, id, action, data = {}) => api.put(`/admin/moderation/${type}/${id}/${action}`, data);

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
