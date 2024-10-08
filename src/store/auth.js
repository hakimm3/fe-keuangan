import router from '@/router';
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const API_URL = import.meta.env.VITE_BASE_URL + 'auth/';

export const authStore = defineStore('auth', () => {
    const isValidationError = ref(false);
    const validationErrors = ref([]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}login`, {
                email: email,
                password: password
            });
            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
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

    return {
        login,
        isValidationError,
        validationErrors
    };
});
