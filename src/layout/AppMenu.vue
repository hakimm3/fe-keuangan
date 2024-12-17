<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        permissions: ['data-incomes-create'],
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/', permission: 'data-incomes-create' }]
    },
    {
        label: 'Data',
        permissions: ['data-incomes-read', 'data-expenses-read', 'data-my wallets-read'],
        items: [
            { label: 'Incomes', icon: 'pi pi-fw pi-money-bill', to: '/data/incomes', permission: 'data-incomes-read' },
            { label: 'Expenses', icon: 'pi pi-fw pi-money-bill', to: '/data/expenses', permission: 'data-expenses-read' },
            { label: 'My Wallets', icon: 'pi pi-fw pi-wallet', to: '/data/my-wallets', permission: 'data-my wallets-read' },
            { label: 'Budget', icon: 'pi pi-fw pi-chart-line', to: '/data/budget', permission: 'data-budget-read' }
        ]
    },
    {
        label: 'Master Data',
        permissions: ['master data-income categories-read', 'master data-expense categories-read', 'master data-wallets-read'],
        items: [
            { label: 'Income Categories', icon: 'pi pi-fw pi-tags', to: '/master-data/income-categories', permission: 'master data-income categories-read' },
            { label: 'Expense Categories', icon: 'pi pi-fw pi-tags', to: '/master-data/expense-categories', permission: 'master data-expense categories-read' },
            { label: 'Wallets', icon: 'pi pi-fw pi-wallet', to: '/master-data/wallets', permission: 'master data-wallets-read' }
        ]
    },
    {
        label: 'Authorization',
        permissions: ['auth-users-read', 'auth-roles-read', 'auth-permissions-read'],
        items: [
            { label: 'Users', icon: 'pi pi-fw pi-user', to: '/authorization/users', permission: 'auth-users-read' },
            { label: 'Roles', icon: 'pi pi-fw pi-users', to: '/authorization/roles', permission: 'auth-roles-read' },
            { label: 'Permissions', icon: 'pi pi-fw pi-key', to: '/authorization/permissions', permission: 'auth-permissions-read' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
