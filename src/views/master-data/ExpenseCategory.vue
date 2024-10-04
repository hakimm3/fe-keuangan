<script setup>
import { ExpenseCategoryService } from '@/service/master-data/ExpenseCategoryService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const expenseCategory = ref();
const expenseCategories = ref();
const isLoading = ref(false);

const fetchExpenseCategories = async () => {
    try {
        isLoading.value = true;
        expenseCategories.value = await ExpenseCategoryService.getData();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchExpenseCategories();
});

const toast = useToast();
const dt = ref();

const expenseCategoryDialog = ref(false);
const importExpenseCategoryDialog = ref(false);
const deleteExpenseCategoryDialog = ref(false);
const deleteExpenseCategoriesDialog = ref(false);

const selectedFile = ref(null);

const selectedExpenseCategories = ref();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function onSelectedFile(event) {
    selectedFile.value = event.files[0];
}

function openNew() {
    expenseCategory.value = {};
    submitted.value = false;
    expenseCategoryDialog.value = true;
}

function hideDialog() {
    expenseCategoryDialog.value = false;
    submitted.value = false;
}

async function saveExpenseCategory() {
    submitted.value = true;

    if (expenseCategory?.value.description?.trim() && expenseCategory?.value.name) {
        if (expenseCategory.value.id) {
            await ExpenseCategoryService.update(expenseCategory.value.id, {
                name: expenseCategory.value.name,
                description: expenseCategory.value.description
            });
            expenseCategories.value[findIndexById(expenseCategory.value.id)] = expenseCategory.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Expense Updated', life: 3000 });
        } else {
            const response = await ExpenseCategoryService.create({
                name: expenseCategory.value.name,
                description: expenseCategory.value.description
            });
            expenseCategories.value.unshift(response.data);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Expense Created', life: 3000 });
        }

        expenseCategoryDialog.value = false;
        expenseCategory.value = {};
    }
}

function editExpenseCategory(exp) {
    expenseCategory.value = {
        id: exp.id,
        name: exp.name,
        description: exp.description
    };
    expenseCategoryDialog.value = true;
}

function confirmDeleteExpenseCategory(exp) {
    expenseCategory.value = exp;
    deleteExpenseCategoryDialog.value = true;
}

function deleteExpenseCategory() {
    ExpenseCategoryService.delete(expenseCategory.value.id);

    expenseCategories.value = expenseCategories.value.filter((val) => val.id !== expenseCategory.value.id);
    deleteExpenseCategoryDialog.value = false;
    expenseCategory.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Expense Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < expenseCategories.value.length; i++) {
        if (expenseCategories.value[i].id === id) {
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
    ExpenseCategoryService.import({ file: selectedFile.value })
        .then(() => {
            fetchExpenseCategories();
        })
        .catch((error) => {
            console.error(error);
        });
    importExpenseCategoryDialog.value = false;
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

function confirmDeleteSelected() {
    deleteExpenseCategoriesDialog.value = true;
}

function deleteSelectedExpenseCategories() {
    let ids = selectedExpenseCategories.value.map((exp) => exp.id);
    // console.log({ ids: ids });
    ExpenseCategoryService.bulkDelete({ ids: ids });
    expenseCategories.value = expenseCategory.value.filter((val) => !ids.includes(val.id));

    deleteExpenseCategoriesDialog.value = false;
    selectedExpenseCategories.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Expenses Deleted', life: 3000 });
}

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Master Data' }, { label: 'Expense Categories' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>

<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">Expense Categories</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedExpenseCategories || !selectedExpenseCategories.length" />
                </template>

                <template #end>
                    <Button label="Import" icon="pi pi-download" severity="secondary mx-2" @click="importExpenseCategoryDialog = true" />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedExpenseCategories"
                :value="expenseCategories"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} expense categories"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Expenses Categories</h4>
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
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editExpenseCategory(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteExpenseCategory(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="expenseCategoryDialog" :style="{ width: '450px' }" header="Expense Category Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="expenseCategory.name" required="true" autofocus :invalid="submitted && !expenseCategory.name" fluid />
                    <small v-if="submitted && !expenseCategory.name" class="text-red-500">name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <InputText id="description" v-model.trim="expenseCategory.description" required="true" autofocus :invalid="submitted && !expenseCategory.description" fluid />
                    <small v-if="submitted && !expenseCategory.description" class="text-red-500">description is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveExpenseCategory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="importExpenseCategoryDialog" :style="{ width: '450px' }" header="Import Expense" :modal="true">
            <FileUpload name="file" @uploader="onUpload" @select="onSelectedFile" :maxFileSize="1000000" customUpload />
        </Dialog>

        <Dialog v-model:visible="deleteExpenseCategoryDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="expenseCategory"
                    >Are you sure you want to delete <b>{{ expenseCategory.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteExpenseCategoryDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteExpenseCategory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteExpenseCategoriesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="expense">Are you sure you want to delete the selected expenses?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteExpenseCategoriesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedExpenseCategories" />
            </template>
        </Dialog>
    </div>
</template>
