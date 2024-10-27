<script setup>
import { RoleService } from '@/service/authorization/RoleService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const role = ref();
const roles = ref();
const isLoading = ref(false);

const fetchIncomeCategories = async () => {
    try {
        isLoading.value = true;
        roles.value = await RoleService.getData();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchIncomeCategories();
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
    role.value = {};
    submitted.value = false;
    roleDialog.value = true;
}

function hideDialog() {
    roleDialog.value = false;
    submitted.value = false;
}

async function saveRole() {
    submitted.value = true;

    if (role?.value.name) {
        if (role.value.id) {
            const response = await RoleService.update(role.value.id, {
                name: role.value.name
            });

            if (response.status === 422) {
                toast.add({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
                return;
            }

            roles.value[findIndexById(role.value.id)] = { ...response.data };
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Roles Updated', life: 3000 });
        } else {
            const response = await RoleService.create({
                name: role.value.name
            });

            if (response.status === 422) {
                toast.add({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
                return;
            }
            roles.value.unshift(response.data);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Roles Created', life: 3000 });
        }

        roleDialog.value = false;
        role.value = {};
    }
}

function editRole(exp) {
    role.value = {
        id: exp.id,
        name: exp.name,
        description: exp.description
    };
    roleDialog.value = true;
}

function confirmDeleteRole(exp) {
    role.value = exp;
    deleteRoleDialog.value = true;
}

function deleteRole() {
    RoleService.delete(role.value.id);

    roles.value = roles.value.filter((val) => val.id !== role.value.id);
    deleteRoleDialog.value = false;
    role.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Role Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < roles.value.length; i++) {
        if (roles.value[i].id === id) {
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
    RoleService.bulkDelete({ ids: ids });
    roles.value = roles.value.filter((val) => !ids.includes(val.id));

    deleteRolesDialog.value = false;
    selectedRoles.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Roles Deleted', life: 3000 });
}

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Data' }, { label: 'Roles' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>

<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">Roles</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedRoles || !selectedRoles.length" />
                </template>

                <template #end>
                    <Button label="Import" icon="pi pi-download" severity="secondary mx-2" @click="importIncomeCategoryDialog = true" />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedRoles"
                :value="roles"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} roles"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Roles</h4>
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
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editRole(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteRole(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="roleDialog" :style="{ width: '450px' }" header="Role Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="role.name" required="true" autofocus :invalid="submitted && !role.name" fluid />
                    <small v-if="submitted && !role.name" class="text-red-500">name is required.</small>
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
                <span v-if="role"
                    >Are you sure you want to delete <b>{{ role.name }}</b
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
                <span v-if="selectedRoles">Are you sure you want to delete the selected roles?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteRolesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedRoles" />
            </template>
        </Dialog>
    </div>
</template>
