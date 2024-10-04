<script setup>
import { IncomeCategoryService } from '@/service/master-data/IncomeCategoryService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const incomeCategory = ref();
const incomeCategories = ref();
const isLoading = ref(false);

const fetchIncomeCategories = async () => {
    try {
        isLoading.value = true;
        incomeCategories.value = await IncomeCategoryService.getData();
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

const incomeCategoryDialog = ref(false);
const importIncomeCategoryDialog = ref(false);
const deleteIncomeCategoryDialog = ref(false);
const deleteIncomeCategoriesDialog = ref(false);

const selectedFile = ref(null);

const selectedIncomeCategories = ref();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function onSelectedFile(event) {
    selectedFile.value = event.files[0];
}

function openNew() {
    incomeCategory.value = {};
    submitted.value = false;
    incomeCategoryDialog.value = true;
}

function hideDialog() {
    incomeCategoryDialog.value = false;
    submitted.value = false;
}

async function saveIncomeCategory() {
    submitted.value = true;

    if (incomeCategory?.value.description?.trim() && incomeCategory?.value.name) {
        if (incomeCategory.value.id) {
            await IncomeCategoryService.update(incomeCategory.value.id, {
                name: incomeCategory.value.name,
                description: incomeCategory.value.description
            });
            incomeCategories.value[findIndexById(incomeCategory.value.id)] = incomeCategory.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Income Categories Updated', life: 3000 });
        } else {
            const response = await IncomeCategoryService.create({
                name: incomeCategory.value.name,
                description: incomeCategory.value.description
            });
            incomeCategories.value.unshift(response.data);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Income Categories Created', life: 3000 });
        }

        incomeCategoryDialog.value = false;
        incomeCategory.value = {};
    }
}

function editIncomeCategory(exp) {
    incomeCategory.value = {
        id: exp.id,
        name: exp.name,
        description: exp.description
    };
    incomeCategoryDialog.value = true;
}

function confirmDeleteIncomeCategory(exp) {
    incomeCategory.value = exp;
    deleteIncomeCategoryDialog.value = true;
}

function deleteIncomeCategory() {
    IncomeCategoryService.delete(incomeCategory.value.id);

    incomeCategories.value = incomeCategories.value.filter((val) => val.id !== incomeCategory.value.id);
    deleteIncomeCategoryDialog.value = false;
    incomeCategory.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Income Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < incomeCategories.value.length; i++) {
        if (incomeCategories.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function exportCSV() {
    dt.value.exportCSV();
}

function onUpload() {
    IncomeCategoryService.import({ file: selectedFile.value })
        .then(() => {
            fetchIncomeCategories();
        })
        .catch((error) => {
            console.error(error);
        });
    importIncomeCategoryDialog.value = false;
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

function confirmDeleteSelected() {
    deleteIncomeCategoriesDialog.value = true;
}

function deleteSelectedIncomeCategories() {
    let ids = selectedIncomeCategories.value.map((exp) => exp.id);
    // console.log({ ids: ids });
    IncomeCategoryService.bulkDelete({ ids: ids });
    incomeCategories.value = incomeCategory.value.filter((val) => !ids.includes(val.id));

    deleteIncomeCategoriesDialog.value = false;
    selectedIncomeCategories.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Income Deleted', life: 3000 });
}

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Master Data' }, { label: 'Income Categories' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>

<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">Income Categories</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedIncomeCategories || !selectedIncomeCategories.length" />
                </template>

                <template #end>
                    <Button label="Import" icon="pi pi-download" severity="secondary mx-2" @click="importIncomeCategoryDialog = true" />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedIncomeCategories"
                :value="incomeCategories"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} income categories"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Income Categories</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="name" header="Name" sortable></Column>
                <Column field="description" header="Description" sortable></Column>
                <Column :exportable="false">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editIncomeCategory(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteIncomeCategory(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="incomeCategoryDialog" :style="{ width: '450px' }" header="Income Category Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="incomeCategory.name" required="true" autofocus :invalid="submitted && !incomeCategory.name" fluid />
                    <small v-if="submitted && !incomeCategory.name" class="text-red-500">name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <InputText id="description" v-model.trim="incomeCategory.description" required="true" autofocus :invalid="submitted && !incomeCategory.description" fluid />
                    <small v-if="submitted && !incomeCategory.description" class="text-red-500">description is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveIncomeCategory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="importIncomeCategoryDialog" :style="{ width: '450px' }" header="Import Income Categories" :modal="true">
            <FileUpload name="file" @uploader="onUpload" @select="onSelectedFile" :maxFileSize="1000000" customUpload />
        </Dialog>

        <Dialog v-model:visible="deleteIncomeCategoryDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="incomeCategory"
                    >Are you sure you want to delete <b>{{ incomeCategory.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteIncomeCategoryDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteIncomeCategory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteIncomeCategoriesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="incomeCategory">Are you sure you want to delete the selected income categories?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteIncomeCategoriesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedIncomeCategories" />
            </template>
        </Dialog>
    </div>
</template>
