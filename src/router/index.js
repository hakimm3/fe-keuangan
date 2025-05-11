import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/data',
                    children: [
                        {
                            path: 'expenses',
                            name: 'expenses', // Perbaiki nama rute
                            component: () => import('@/views/data/Expense.vue') // Pastikan nama file komponen benar
                        },
                        {
                            path: 'incomes', // Path tidak perlu diawali dengan '/'
                            name: 'incomes',
                            component: () => import('@/views/data/Income.vue') // Tambahkan komponen untuk rute ini
                        },
                        {
                            path: 'my-wallets',
                            name: 'myWallets',
                            component: () => import('@/views/data/MyWallet.vue')
                        },
                        {
                            path: 'my-wallets/transactions',
                            name: 'myWalletTransactions',
                            component: () => import('@/views/data/MyWalletTransaction.vue')
                        },
                        {
                            path: 'budget',
                            name: 'budget',
                            component: () => import('@/views/data/Budget.vue')
                        }
                    ]
                },
                {
                    path: '/master-data',
                    children: [
                        {
                            path: 'expense-categories',
                            name: 'expenseCategories',
                            component: () => import('@/views/master-data/ExpenseCategory.vue')
                        },
                        {
                            path: 'income-categories',
                            name: 'incomeCategories',
                            component: () => import('@/views/master-data/IncomeCategory.vue')
                        },
                        {
                            path: 'wallets',
                            name: 'wallets',
                            component: () => import('@/views/master-data/Wallet.vue')
                        }
                    ]
                },
                {
                    path: '/authorization',
                    children: [
                        {
                            path: 'users',
                            name: 'users',
                            component: () => import('@/views/authorization/User.vue')
                        },
                        {
                            path: 'roles',
                            name: 'roles',
                            component: () => import('@/views/authorization/Role.vue')
                        },
                        {
                            path: 'roles/:id/permissions',
                            name: 'role-permissions',
                            component: () => import('@/views/authorization/RolePermission.vue')
                        },
                        {
                            path: 'permissions',
                            name: 'permissions',
                            component: () => import('@/views/authorization/Permission.vue')
                        }
                    ]
                }
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/auth/Register.vue')
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    const publicPages = ['/auth/login', '/auth/register', '/auth/error', '/auth/access'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    if (authRequired && !loggedIn) {
        return next('/auth/login');
    } else if (loggedIn && publicPages.includes(to.path)) {
        return next('/');
    }
    next();
});

export default router;
