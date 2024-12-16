import { createApp, watch } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import { usePermissionsStore } from './store/permissions';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(createPinia());

const permissionsStore = usePermissionsStore();

app.directive('can', {
    mounted(el, binding) {
        // Update visibility function
        const updateVisibility = () => {
            el.style.display = permissionsStore.can(binding.value) ? '' : 'none';
        };

        // Run initially
        updateVisibility();

        // Watch for changes in permissions
        const stopWatcher = watch(
            () => permissionsStore.permissions,
            updateVisibility,
            { deep: true } // Track deeply nested changes
        );

        // Cleanup watcher
        el._stopWatcher = stopWatcher;
    },
    unmounted(el) {
        if (el._stopWatcher) {
            el._stopWatcher();
        }
    }
});

app.directive('canany', {
    mounted(el, binding) {
        const updateVisibility = () => {
            el.style.display = permissionsStore.canAny(binding.value) ? '' : 'none';
        };

        updateVisibility();

        const stopWatcher = watch(() => permissionsStore.permissions, updateVisibility, { deep: true });

        el._stopWatcher = stopWatcher;
    },
    unmounted(el) {
        if (el._stopWatcher) {
            el._stopWatcher();
        }
    }
});

app.mount('#app');
