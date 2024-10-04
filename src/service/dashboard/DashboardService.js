import router from '@/router';
import axios from 'axios';

const API_URL = 'http://backend.keuangan.net/api/dashboard';

export const DashboardService = {
    getDashboardData: async () => {
        try {
            const response = await axios.get(`${API_URL}`, {
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
    }
};
