import { BaseService } from '../BaseServices';

const API_URL = import.meta.env.VITE_BASE_URL + 'master-data/wallets';

export const WalletServices = {
    getData: async () => {
        return await BaseService.getData(API_URL);
    },

    create: async (data) => {
        return await BaseService.create(data, API_URL);
    },

    update: async (id, data) => {
        return await BaseService.update(id, data, API_URL);
    },

    delete: async (id) => {
        return await BaseService.delete(id, API_URL);
    },

    bulkDelete: async (ids) => {
        return await BaseService.bulkDelete(ids, `${API_URL}/bulk-delete`);
    }
};
