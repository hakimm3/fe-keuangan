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
                        }
                    ]
                }
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/auth/login', '/auth/register', '/auth/error', '/auth/access'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    if (authRequired && !loggedIn) {
        return next('/auth/login');
    } else if (loggedIn && publicPages.includes(to.path)) {
        return next('/');
    }
    //  else if (to.matched.length === 0) {
    //     return next('/pages/notfound');
    // }
    next();
});

export default router;
