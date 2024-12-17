<script setup>
import { PermissionService } from '@/service/authorization/PermissionService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const permission = ref();
const permissions = ref();
const isLoading = ref(false);

const fetchPermissions = async () => {
    try {
        isLoading.value = true;
        permissions.value = await PermissionService.getData();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchPermissions();
});

const toast = useToast();
const dt = ref();

const roleDialog = ref(false);
const deleteRoleDialog = ref(false);
const deleteRolesDialog = ref(false);
const selectedRoles = ref();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function openNew() {
    permission.value = {};
    submitted.value = false;
    roleDialog.value = true;
}

function hideDialog() {
    roleDialog.value = false;
    submitted.value = false;
}

async function saveRole() {
    submitted.value = true;

    if (permission?.value.name) {
        if (permission.value.id) {
            const response = await PermissionService.update(permission.value.id, {
                name: permission.value.name
            });

            if (response.status === 422) {
                toast.add({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
                return;
            }

            permissions.value[findIndexById(permission.value.id)] = { ...response.data };
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Permissions Updated', life: 3000 });
        } else {
            const response = await PermissionService.create({
                name: permission.value.name
            });

            if (response.status === 422) {
                toast.add({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
                return;
            }
            permissions.value.unshift(response.data);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Permissions Created', life: 3000 });
        }

        roleDialog.value = false;
        permission.value = {};
    }
}

function editRole(exp) {
    permission.value = {
        id: exp.id,
        name: exp.name,
        description: exp.description
    };
    roleDialog.value = true;
}

function confirmDeleteRole(exp) {
    permission.value = exp;
    deleteRoleDialog.value = true;
}

function deleteRole() {
    PermissionService.delete(permission.value.id);

    permissions.value = permissions.value.filter((val) => val.id !== permission.value.id);
    deleteRoleDialog.value = false;
    permission.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Role Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < permissions.value.length; i++) {
        if (permissions.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function exportCSV() {
    dt.value.exportCSV();
}

function confirmDeleteSelected() {
    deleteRolesDialog.value = true;
}

function deleteSelectedRoles() {
    let ids = selectedRoles.value.map((exp) => exp.id);
    // console.log({ ids: ids });
    PermissionService.bulkDelete({ ids: ids });
    permissions.value = permissions.value.filter((val) => !ids.includes(val.id));

    deleteRolesDialog.value = false;
    selectedRoles.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Permissions Deleted', life: 3000 });
}

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Data' }, { label: 'Permissions' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>

<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">Permissions</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" v-can="'auth-permissions-create'" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedRoles || !selectedRoles.length" v-can="'auth-permissions-delete'" />
                </template>

                <template #end>
                    <Button label="Import" icon="pi pi-download" severity="secondary mx-2" @click="importIncomeCategoryDialog = true" v-can="'auth-permissions-create'" />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedRoles"
                :value="permissions"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} permissions"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Permissions</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="name" header="Name" sortable class="capitalize"></Column>
                <Column field="guard_name" header="Guard Name" sortable class="capitalize"></Column>
                <Column :exportable="false">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editRole(slotProps.data)" v-can="'auth-permissions-update'" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger mr-2" @click="confirmDeleteRole(slotProps.data)" v-can="'auth-permissions-delete'" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="roleDialog" :style="{ width: '450px' }" header="Role Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="permission.name" required="true" autofocus :invalid="submitted && !permission.name" fluid />
                    <small v-if="submitted && !permission.name" class="text-red-500">name is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveRole" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteRoleDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="permission"
                    >Are you sure you want to delete <b>{{ permission.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteRoleDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteRole" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteRolesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedRoles">Are you sure you want to delete the selected permissions?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteRolesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedRoles" />
            </template>
        </Dialog>
    </div>
</template>
