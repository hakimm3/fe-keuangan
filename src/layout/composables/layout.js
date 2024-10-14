import { computed, reactive, readonly } from 'vue';

const Storage = {
    get(key) {
        return localStorage.getItem(key);
    },
    set(key, value) {
        localStorage.setItem(key, value);
    }
};

const layoutConfig = reactive({
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: Storage.get('darkTheme') === 'true',
    menuMode: 'static'
});

function saveToStorage(key, value) {
    Storage.set(key, value);
}

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
});

const setPrimary = (value) => {
    layoutConfig.primary = value;
};

const setSurface = (value) => {
    layoutConfig.surface = value;
};

const setPreset = (value) => {
    layoutConfig.preset = value;
};

const setActiveMenuItem = (item) => {
    layoutState.activeMenuItem = item.value || item;
};

const setMenuMode = (mode) => {
    layoutConfig.menuMode = mode;
};

const toggleDarkMode = () => {
    if (!document.startViewTransition) {
        executeDarkModeToggle();
        return;
    }

    document.startViewTransition(() => executeDarkModeToggle(event));
};

const executeDarkModeToggle = () => {
    saveToStorage('darkTheme', !layoutConfig.darkTheme);
    layoutConfig.darkTheme = !layoutConfig.darkTheme;
    document.documentElement.classList.toggle('app-dark');
};

const onMenuToggle = () => {
    if (layoutConfig.menuMode === 'overlay') {
        layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
    }

    if (window.innerWidth > 991) {
        layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
    } else {
        layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
    }
};

const resetMenu = () => {
    layoutState.overlayMenuActive = false;
    layoutState.staticMenuMobileActive = false;
    layoutState.menuHoverActive = false;
};

const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

const isDarkTheme = computed(() => layoutConfig.darkTheme);

const getPrimary = computed(() => layoutConfig.primary);

export function useLayout() {
    return {
        setPrimary,
        setSurface,
        setPreset,
        setActiveMenuItem,
        setMenuMode,
        toggleDarkMode,
        onMenuToggle,
        resetMenu,
        isSidebarActive,
        isDarkTheme,
        getPrimary,
        layoutConfig: readonly(layoutConfig),
        layoutState: readonly(layoutState)
    };
}
