import router from '@/router';
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const API_URL = 'http://backend.keuangan.net/api/dashboard';

export const useDashboardStore = defineStore('dashboard', () => {
    const dashboardData = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const getDashboardData = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`${API_URL}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dashboardData.value = response.data;
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.push('/login');
            }
            error.value = err;
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            loading.value = false;
        }
    };

    return {
        dashboardData,
        loading,
        error,
        getDashboardData
    };
});
