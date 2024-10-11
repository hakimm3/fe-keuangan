import router from '@/router';
import axios from 'axios';

// const API_URL = 'http://backend.keuangan.net/api/spendings';

export const BaseService = {
    getData: async (API_URL) => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.data;
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.push('/login');
            }
            throw error;
        }
    },

    create: async (data, API_URL) => {
        try {
            const response = await axios.post(API_URL, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.push('/login');
            } else if (error.response.status === 422) {
                return error.response;
            }
            throw error;
        }
    },

    update: async (id, data, API_URL) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.push('/login');
            } else if (error.response.status === 422) {
                return error.response;
            }
            throw error;
        }
    },

    delete: async (id, API_URL) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.push('/login');
            }
            throw error;
        }
    },

    bulkDelete: async (ids, API_URL) => {
        try {
            const response = await axios.post(API_URL, ids, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.push('/login');
            }
            throw error;
        }
    },

    import: async (data, API_URL) => {
        try {
            const response = await axios.post(API_URL, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.push('/login');
            } else if (error.response.status === 422) {
                return error.response.data;
            }
            throw error;
        }
    }
};
