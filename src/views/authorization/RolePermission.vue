<script setup>
import { PermissionService } from '@/service/authorization/PermissionService';
import { RoleService } from '@/service/authorization/RoleService';
import { usePermissionsStore } from '@/store/permissions';
import { decryptData } from '@/utils/crypto';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const permissionsStore = usePermissionsStore();
const selectedPermissions = ref([]);

const rolePermissions = ref([]);
const allPermissions = ref([]);

const fetchPermissions = async () => {
    let id = decryptData(router.currentRoute.value.params.id);
    const response = await RoleService.getPermissions(id).then((data) => (rolePermissions.value = data));
    const responseAllPermission = await PermissionService.getData().then((data) => (allPermissions.value = data));

    rolePermissions.value = transformData(response.permissions);
    allPermissions.value = transformData(responseAllPermission);

    initializeSelectedPermissions();
};

async function updatePermissions() {
    const selected = Object.keys(selectedPermissions.value).filter((key) => selectedPermissions.value[key].checked && key.split('-').length === 3);
    const permissions = selected.map((key) => ({ name: key }));

    const resp = await RoleService.syncPermissions({
        role_id: decryptData(router.currentRoute.value.params.id),
        permissions: permissions
    });

    toast.add({ severity: 'success', summary: 'Success', detail: 'Permissions updated', life: 3000 });
    permissionsStore.setPermissions(resp.permissions);
}

onMounted(() => {
    fetchPermissions();
});

function initializeSelectedPermissions() {
    const keys = {};

    // Helper function to check if a permission exists in rolePermissions
    function permissionExistsInRolePermissions(permissionKey) {
        return rolePermissions.value.some((category) => category.children.some((subcategory) => subcategory.children.some((permission) => permission.key === permissionKey)));
    }

    // Recursive function to traverse and set checked states in allPermissions
    function traverseAndSetState(node) {
        if (node.children && node.children.length > 0) {
            let allChecked = true;
            let anyChecked = false;

            node.children.forEach((child) => {
                const childState = traverseAndSetState(child); // Recursively set state for children

                if (childState.checked) {
                    anyChecked = true;
                } else if (childState.partialChecked) {
                    anyChecked = true;
                    allChecked = false;
                } else {
                    allChecked = false;
                }
            });

            // Set current node's state
            if (allChecked) {
                keys[node.key] = { checked: true, partialChecked: false };
            } else if (anyChecked) {
                keys[node.key] = { checked: false, partialChecked: true };
            } else {
                keys[node.key] = { checked: false, partialChecked: false };
            }

            return keys[node.key];
        } else {
            // Leaf node: check if it exists in rolePermissions
            const isChecked = permissionExistsInRolePermissions(node.key);
            keys[node.key] = { checked: isChecked, partialChecked: false };
            return keys[node.key];
        }
    }

    // Start traversal from allPermissions
    allPermissions.value.forEach((category) => {
        traverseAndSetState(category);
    });

    selectedPermissions.value = keys; // Populate selectedPermissions
}

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
        subcategory.children.push({ id: item.id, label: actionLabel, key: item.name, expanded: true });
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
        <Tree :value="allPermissions" selectionMode="checkbox" v-model:selection-keys="selectedPermissions" v-on:update:selection-keys="updatePermissions" />
    </div>
</template>
