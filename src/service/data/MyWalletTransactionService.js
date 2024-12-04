import { BaseService } from '../BaseServices';

const API_URL = import.meta.env.VITE_BASE_URL + 'my-wallets/transactions';

export const MyWalletTransactionService = {
    getData: async () => {
        return await BaseService.getData(API_URL);
    }
};
