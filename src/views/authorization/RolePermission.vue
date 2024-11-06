<script setup>
import { RoleService } from '@/service/authorization/RoleService';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const selectedPermissions = ref([]);
const test_permissions = ref([
    {
        key: 'master_data',
        label: 'Master Data',
        children: [
            {
                key: 'wallets',
                label: 'Wallets',
                children: [
                    { id: 1, label: 'View', key: 'master_data-wallets-view' },
                    { id: 2, label: 'Create', key: 'master_data-wallets-create' },
                    { id: 3, label: 'Update', key: 'master_data-wallets-update' },
                    { id: 4, label: 'Delete', key: 'master_data-wallets-delete' }
                ]
            }
        ]
    },
    {
        key: 'authorization',
        label: 'Authorization',
        children: [
            {
                key: 'roles',
                label: 'Roles',
                children: [
                    { id: 5, label: 'View', key: 'authorization-roles-view' },
                    { id: 6, label: 'Create', key: 'authorization-roles-create' },
                    { id: 7, label: 'Update', key: 'authorization-roles-update' },
                    { id: 8, label: 'Delete', key: 'authorization-roles-delete' }
                ]
            }
        ]
    },
    {
        key: 'settings',
        label: 'Settings',
        children: [
            {
                key: 'general',
                label: 'General',
                children: [
                    { id: 9, label: 'View', key: 'settings-general-view' },
                    { id: 10, label: 'Create', key: 'settings-general-create' },
                    { id: 11, label: 'Update', key: 'settings-general-update' },
                    { id: 12, label: 'Delete', key: 'settings-general-delete' }
                ]
            }
        ]
    }
]);

const permissions = ref([]);

const fetchPermissions = async () => {
    const router = useRouter();
    // console.log(encryptData(router.currentRoute.value.params.id));
    console.log(router.currentRoute.value.params.id);
    // let id = decryptData(router.currentRoute.value.params.id);
    let id = router.currentRoute.value.params.id;
    const response = await RoleService.getPermissions(id).then((data) => (permissions.value = data));
    console.log(response);
};

onMounted(() => {
    fetchPermissions();
});

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Data' }, { label: 'Roles' }, { label: 'Super Admin' }, { label: 'Permissions' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>
router.currentRoute.value.params.id
<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">Super Admin</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>
    <div class="card">
        <div class="font-semibold text-xl">Super Admin Permissions</div>
        <Tree :value="test_permissions" selectionMode="checkbox" v-model:selection-keys="selectedPermissions" />
    </div>
</template>
