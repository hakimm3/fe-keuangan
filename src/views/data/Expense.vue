<script setup>
import { ExpenseService } from '@/service/data/ExpenseService';
import { MyWalletService } from '@/service/data/MyWalletService';
import { ExpenseCategoryService } from '@/service/master-data/ExpenseCategoryService';
import { FilterMatchMode } from '@primevue/core/api';
import DatePicker from 'primevue/datepicker';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const expenses = ref();
const expenseCategories = ref();
const wallets = ref();
const isLoading = ref(false);

const fetchExpenses = async () => {
    try {
        isLoading.value = true;
        expenses.value = await ExpenseService.getData();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

const fetchExpenseCategories = async () => {
    try {
        isLoading.value = true;
        expenseCategories.value = await ExpenseCategoryService.getData().then((data) => data.map((category) => ({ label: category.name, value: category })));
        wallets.value = await MyWalletService.getData().then((data) => data.map((wallet) => ({ label: wallet.wallet.name, value: wallet })));
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchExpenseCategories();
    fetchExpenses();
});

const toast = useToast();
const dt = ref();

const expenseDialog = ref(false);
const importExpenseDialog = ref(false);
const deleteExpenseDialog = ref(false);
const deleteExpensesDialog = ref(false);

const expense = ref({});
const selectedFile = ref(null);

const selectedExpenses = ref();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function onSelectedFile(event) {
    selectedFile.value = event.files[0];
}

function formatCurrency(value) {
    if (value) return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    return;
}

function formatDate(date) {
    if (date) return new Date(date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
    return;
}

function showToastError(message) {
    toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
}

function openNew() {
    expense.value = {};
    submitted.value = false;
    expenseDialog.value = true;
}

function hideDialog() {
    expenseDialog.value = false;
    submitted.value = false;
}

async function saveExpense() {
    submitted.value = true;

    if (expense?.value.description?.trim() && expense?.value.amount) {
        if (expense.value.id) {
            const response = await ExpenseService.update(expense.value.id, {
                date: expense.value.date,
                description: expense.value.description,
                amount: expense.value.amount,
                category_id: expense.value.category.value.id,
                user_wallet_id: expense.value.wallet.value.id
            });

            if (response.status === 422) {
                showToastError(response.data.message);
                return;
            }
            expenses.value[findIndexById(expense.value.id)] = {
                id: expense.value.id,
                date: expense.value.date,
                description: expense.value.description,
                amount: expense.value.amount,
                user_wallet_id: expense.value.wallet.value.id,
                category: { ...expense.value.category.value },
                wallet: { ...expense.value.wallet.value.wallet }
            };
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Expense Updated', life: 3000 });
        } else {
            const response = await ExpenseService.create({
                date: expense.value.date,
                description: expense.value.description,
                amount: expense.value.amount,
                category_id: expense.value.category.value.id,
                user_wallet_id: expense.value.wallet.value.id
            });
            if (response.status === 422) {
                showToastError(response.data.message);
                return;
            }
            expenses.value.unshift({
                id: response.data.id,
                date: expense.value.date,
                description: expense.value.description,
                amount: expense.value.amount,
                user_wallet_id: expense.value.wallet.value.id,
                category: { ...expense.value.category.value },
                wallet: { ...expense.value.wallet.value.wallet }
            });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Expense Created', life: 3000 });
        }

        expenseDialog.value = false;
        expense.value = {};
    }
}

function editExpense(exp) {
    expense.value = {
        id: exp.id,
        date: new Date(exp.date),
        description: exp.description,
        amount: exp.amount,
        category: expenseCategories.value.find((category) => category.value.id === exp.category.id),
        wallet: wallets.value.find((wallet) => wallet.value.id === exp.user_wallet_id)
    };
    expenseDialog.value = true;
}

function confirmDeleteExpense(exp) {
    expense.value = exp;
    deleteExpenseDialog.value = true;
}

function deleteExpense() {
    ExpenseService.delete(expense.value.id);

    expenses.value = expenses.value.filter((val) => val.id !== expense.value.id);
    deleteExpenseDialog.value = false;
    expense.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Expense Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < expenses.value.length; i++) {
        if (expenses.value[i].id === id) {
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
    ExpenseService.import({ file: selectedFile.value })
        .then(() => {
            fetchExpenses();
        })
        .catch((error) => {
            console.error(error);
        });
    importExpenseDialog.value = false;
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

function confirmDeleteSelected() {
    deleteExpensesDialog.value = true;
}

function deleteSelectedExpenses() {
    let ids = selectedExpenses.value.map((exp) => exp.id);
    // console.log({ ids: ids });
    ExpenseService.bulkDelete({ ids: ids });
    expenses.value = expenses.value.filter((val) => !ids.includes(val.id));

    deleteExpensesDialog.value = false;
    selectedExpenses.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Expenses Deleted', life: 3000 });
}

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Data' }, { label: 'Expense' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>

<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">Expense</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedExpenses || !selectedExpenses.length" />
                </template>

                <template #end>
                    <Button label="Import" icon="pi pi-download" severity="secondary mx-2" @click="importExpenseDialog = true" />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedExpenses"
                :value="expenses"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} expenses"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Expenses</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="date" header="Date" sortable>
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.date) }}
                    </template>
                </Column>
                <Column field="description" header="Description" sortable></Column>
                <Column field="category.name" header="Category" sortable></Column>
                <Column field="wallet.name" header="Wallet" sortable></Column>
                <Column field="amount" header="Amount" sortable>
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.amount) }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editExpense(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteExpense(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="expenseDialog" :style="{ width: '450px' }" header="Expense Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="date" class="block font-bold mb-3">Date</label>
                    <DatePicker id="date" v-model="expense.date" :invalid="submitted && !expense.date" required="true" showIcon fluid />
                    <small v-if="submitted && !expense.date" class="text-red-500">date is required.</small>
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Description</label>
                    <InputText id="description" v-model.trim="expense.description" required="true" autofocus :invalid="submitted && !expense.description" fluid />
                    <small v-if="submitted && !expense.description" class="text-red-500">description is required.</small>
                </div>
                <div>
                    <label for="category" class="block font-bold mb-3">Category</label>
                    <Select id="category" v-model="expense.category" :options="expenseCategories" optionLabel="label" placeholder="Select a Category" required="true" :invalid="submitted && !expense.category" fluid></Select>
                    <small v-if="submitted && !expense.category" class="text-red-500">category is required.</small>
                </div>
                <div>
                    <label for="wallet" class="block font-bold mb-3">Wallet</label>
                    <Select id="wallet" v-model="expense.wallet" :options="wallets" optionLabel="label" placeholder="Select a wallet source" required="true" :invalid="submitted && !expense.wallet" fluid></Select>
                    <small v-if="submitted && !expense.wallet" class="text-red-500">wallet is required.</small>
                </div>
                <div>
                    <label for="price" class="block font-bold mb-3">Amount</label>
                    <InputNumber id="amount" v-model.trim="expense.amount" required="true" :invalid="submitted && !expense.amount" fluid />
                    <small v-if="submitted && !expense.amount" class="text-red-500">amount is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveExpense" />
            </template>
        </Dialog>

        <Dialog v-model:visible="importExpenseDialog" :style="{ width: '450px' }" header="Import Expense" :modal="true">
            <FileUpload name="file" @uploader="onUpload" @select="onSelectedFile" :maxFileSize="1000000" customUpload />
        </Dialog>

        <Dialog v-model:visible="deleteExpenseDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="expense"
                    >Are you sure you want to delete <b>{{ expense.description }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteExpenseDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteExpense" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteExpensesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="expense">Are you sure you want to delete the selected expenses?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteExpensesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedExpenses" />
            </template>
        </Dialog>
    </div>
</template>
