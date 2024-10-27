import { defineStore } from 'pinia';

export const usePermissionsStore = defineStore('permissions', {
    state: () => ({
        permissions: []
    }),

    actions: {
        setPermissions(permissions) {
            this.permissions = permissions;
        }
    },

    getters: {
        can: (state) => (permissions) => {
            return state.permissions.includes(permissions);
        },
        canAny: (state) => (permissions) => {
            return permissions.some((permission) => state.permissions.includes(permission));
        }
    }
});
