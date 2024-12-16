import router from '@/router';
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePermissionsStore } from './permissions';

const API_URL = import.meta.env.VITE_BASE_URL + 'auth/';

export const authStore = defineStore('auth', () => {
    const isValidationError = ref(false);
    const validationErrors = ref([]);
    const permissionsStore = usePermissionsStore();

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}login`, {
                email: email,
                password: password
            });
            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
                permissionsStore.setPermissions(response.data.permissions);
                router.push('/');
            }
            return response.data;
        } catch (error) {
            if (error.response.status === 422 || error.response.status === 401) {
                isValidationError.value = true;
                validationErrors.value = error.response.data.message;
            } else {
                throw error;
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('permissions');
        router.push({ name: 'login' });
    };

    return {
        login,
        logout,
        isValidationError,
        validationErrors
    };
});
