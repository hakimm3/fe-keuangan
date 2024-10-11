<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Data',
        items: [
            { label: 'Incomes', icon: 'pi pi-fw pi-money-bill', to: '/data/incomes' },
            { label: 'Expenses', icon: 'pi pi-fw pi-money-bill', to: '/data/expenses' },
            { label: 'My Wallets', icon: 'pi pi-fw pi-wallet', to: '/data/my-wallets' }
        ]
    },
    {
        label: 'Master Data',
        items: [
            { label: 'Income Categories', icon: 'pi pi-fw pi-tags', to: '/master-data/income-categories' },
            { label: 'Expense Categories', icon: 'pi pi-fw pi-tags', to: '/master-data/expense-categories' },
            { label: 'Wallets', icon: 'pi pi-fw pi-wallet', to: '/master-data/wallets' }
        ]
    },
    {
        label: 'Authorization',
        items: [
            { label: 'Users', icon: 'pi pi-fw pi-user', to: '/authorization/users' }
            // { label: 'Roles', icon: 'pi pi-fw pi-users', to: '/authorization/roles' }
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
