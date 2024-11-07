<script setup>
import { RoleService } from '@/service/authorization/RoleService';
import { decryptData } from '@/utils/crypto';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const selectedPermissions = ref([]);

const permissions = ref([]);

const fetchPermissions = async () => {
    const router = useRouter();
    let id = decryptData(router.currentRoute.value.params.id);
    const response = await RoleService.getPermissions(id).then((data) => (permissions.value = data));

    permissions.value = transformData(response.permissions);
    console.log(permissions.value);
};

onMounted(() => {
    fetchPermissions();
});

function transformData(dataArray) {
    const result = [];

    // Helper function to find or create a category in `result`
    function findOrCreateCategory(parentArray, key, label) {
        let category = parentArray.find((child) => child.key === key);
        if (!category) {
            category = { key, label, children: [] };
            parentArray.push(category);
        }
        return category;
    }

    dataArray.forEach((item) => {
        // Split `name` by dashes to get parts: `category-subcategory-action`
        const [categoryKey, subcategoryKey, action] = item.name.split('-');

        // Determine labels based on key parts
        const categoryLabel = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1).replace('_', ' ');
        const subcategoryLabel = subcategoryKey.charAt(0).toUpperCase() + subcategoryKey.slice(1).replace('_', ' ');
        const actionLabel = action.charAt(0).toUpperCase() + action.slice(1);

        // Find or create the category in the main result
        const category = findOrCreateCategory(result, categoryKey, categoryLabel);

        // Find or create the subcategory within the category
        const subcategory = findOrCreateCategory(category.children, `${categoryKey}-${subcategoryKey}`, subcategoryLabel);

        // Add the action as a child of the subcategory
        subcategory.children.push({ id: item.id, label: actionLabel, key: item.name });
    });

    return result;
}

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Data' }, { label: 'Roles' }, { label: 'Super Admin' }, { label: 'Permissions' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>
<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">Super Admin</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>
    <div class="card">
        <div class="font-semibold text-xl">Super Admin Permissions</div>
        <Tree :value="permissions" selectionMode="checkbox" v-model:selection-keys="selectedPermissions" />
    </div>
</template>
