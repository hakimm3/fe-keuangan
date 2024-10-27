import { createApp } from 'vue';
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
    beforeMount(el, binding) {
        if (!permissionsStore.can(binding.value)) {
            el.style.display = 'none';
        }
    }
});

app.directive('canany', {
    beforeMount(el, binding) {
        if (!permissionsStore.canAny(binding.value)) {
            el.style.display = 'none';
        }
    }
});

app.mount('#app');
