import { BaseService } from '../BaseServices';

const API_URL = import.meta.env.VITE_BASE_URL + 'budgets';

export const BudgetServices = {
    getData: async (data) => {
        return await BaseService.getData(API_URL, data);
    },

    update: async (data) => {
        return await BaseService.create(data, API_URL);
    }
};
