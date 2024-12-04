<script setup>
import { IncomeService } from '@/service/data/IncomeService';
import { MyWalletService } from '@/service/data/MyWalletService';
import { IncomeCategoryService } from '@/service/master-data/IncomeCategoryService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const incomes = ref();
const incomeCategories = ref();
const wallets = ref();
const isLoading = ref(false);

const fetchIncomes = async () => {
    try {
        isLoading.value = true;
        incomes.value = await IncomeService.getData();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

const fetchIncomeCategories = async () => {
    try {
        isLoading.value = true;
        incomeCategories.value = await IncomeCategoryService.getData().then((data) => data.map((category) => ({ label: category.name, value: category })));
        wallets.value = await MyWalletService.getData().then((data) => data.map((wallet) => ({ label: wallet.description, value: wallet })));
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchIncomeCategories();
    fetchIncomes();
});

const toast = useToast();
const dt = ref();

const incomeDialog = ref(false);
const importIncomesDialog = ref(false);
const deleteIncomeDialog = ref(false);
const deleteIncomesDialog = ref(false);

const income = ref({});
const selectedFile = ref(null);

const selectedIncomes = ref();

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
    income.value = {};
    submitted.value = false;
    incomeDialog.value = true;
}

function hideDialog() {
    incomeDialog.value = false;
    submitted.value = false;
}

async function saveIncome() {
    submitted.value = true;

    if (income?.value.description?.trim() && income?.value.amount) {
        if (income.value.id) {
            const response = await IncomeService.update(income.value.id, {
                date: income.value.date,
                description: income.value.description,
                amount: income.value.amount,
                category_id: income.value.category.value.id,
                user_wallet_id: income.value.wallet.value.id
            });

            if (response.status === 422) {
                showToastError(response.data.message);
                return;
            }

            incomes.value[findIndexById(income.value.id)] = {
                id: income.value.id,
                date: income.value.date,
                description: income.value.description,
                amount: income.value.amount,
                user_wallet_id: income.value.wallet.value.id,
                category: { ...income.value.category.value },
                user_wallet: { ...income.value.wallet.value }
            };
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Income Updated', life: 3000 });
        } else {
            const response = await IncomeService.create({
                date: income.value.date,
                description: income.value.description,
                amount: income.value.amount,
                category_id: income.value.category.value.id,
                user_wallet_id: income.value.wallet.value.id
            });

            if (response.status === 422) {
                showToastError(response.data.message);
                return;
            }

            incomes.value.unshift({
                id: response.data.id,
                date: income.value.date,
                description: income.value.description,
                amount: income.value.amount,
                user_wallet_id: income.value.wallet.value.id,
                category: { ...income.value.category.value },
                user_wallet: { ...income.value.wallet.value }
            });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Income Created', life: 3000 });
        }

        incomeDialog.value = false;
        income.value = {};
    }
}

function editIncome(inc) {
    income.value = {
        id: inc.id,
        date: new Date(inc.date),
        description: inc.description,
        amount: inc.amount,
        category: incomeCategories.value.find((category) => category.value.id === inc.category.id),
        wallet: wallets.value.find((wallet) => wallet.value.id === inc.user_wallet_id)
    };
    incomeDialog.value = true;
}

function confirmDeleteIncome(inc) {
    income.value = inc;
    deleteIncomeDialog.value = true;
}

function deleteIncome() {
    IncomeService.delete(income.value.id);

    incomes.value = incomes.value.filter((val) => val.id !== income.value.id);
    deleteIncomeDialog.value = false;
    income.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Income Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < incomes.value.length; i++) {
        if (incomes.value[i].id === id) {
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
    IncomeService.import({ file: selectedFile.value })
        .then(() => {
            fetchIncomes();
        })
        .catch((error) => {
            console.error(error);
        });
    importIncomesDialog.value = false;
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

function confirmDeleteSelected() {
    deleteIncomesDialog.value = true;
}

function deleteSelectedIncomes() {
    let ids = selectedIncomes.value.map((inc) => inc.id);
    // console.log({ ids: ids });
    IncomeService.bulkDelete({ ids: ids });
    incomes.value = incomes.value.filter((val) => !ids.includes(val.id));

    deleteIncomesDialog.value = false;
    selectedIncomes.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Incomes Deleted', life: 3000 });
}

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Data' }, { label: 'Income' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>

<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">Income</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedIncomes || !selectedIncomes.length" />
                </template>

                <template #end>
                    <Button label="Import" icon="pi pi-download" severity="secondary mr-2" @click="importIncomesDialog = true" />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedIncomes"
                :value="incomes"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} incomes"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Incomes</h4>
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
                <Column field="user_wallet.description" header="Wallet" sortable></Column>
                <Column field="amount" header="Amount" sortable>
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.amount) }}
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editIncome(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteIncome(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="incomeDialog" :style="{ width: '450px' }" header="Income Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="date" class="block font-bold mb-3">Date</label>
                    <Calendar id="date" v-model="income.date" :invalid="submitted && !income.date" required="true" showIcon fluid />
                    <small v-if="submitted && !income.date" class="text-red-500">date is required.</small>
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Description</label>
                    <InputText id="description" v-model.trim="income.description" required="true" autofocus :invalid="submitted && !income.description" fluid />
                    <small v-if="submitted && !income.description" class="text-red-500">description is required.</small>
                </div>
                <div>
                    <label for="category" class="block font-bold mb-3">Category</label>
                    <Select id="category" v-model="income.category" :options="incomeCategories" optionLabel="label" placeholder="Select a Category" required="true" :invalid="submitted && !income.category" fluid></Select>
                    <small v-if="submitted && !income.category" class="text-red-500">category is required.</small>
                </div>
                <div>
                    <label for="wallet" class="block font-bold mb-3">Wallet</label>
                    <Select id="wallet" v-model="income.wallet" :options="wallets" optionLabel="label" placeholder="Select a wallet source" required="true" :invalid="submitted && !income.wallet" fluid></Select>
                    <small v-if="submitted && !income.wallet" class="text-red-500">wallet is required.</small>
                </div>
                <div>
                    <label for="price" class="block font-bold mb-3">Amount</label>
                    <InputNumber id="amount" v-model.trim="income.amount" required="true" :invalid="submitted && !income.amount" fluid />
                    <small v-if="submitted && !income.amount" class="text-red-500">amount is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveIncome" />
            </template>
        </Dialog>

        <Dialog v-model:visible="importIncomesDialog" :style="{ width: '450px' }" header="Import Income" :modal="true">
            <FileUpload name="file" @uploader="onUpload" @select="onSelectedFile" :maxFileSize="1000000" customUpload />
        </Dialog>

        <Dialog v-model:visible="deleteIncomeDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="income"
                    >Are you sure you want to delete <b>{{ income.description }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteIncomeDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteIncome" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteIncomesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="income">Are you sure you want to delete the selected Incomes?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteIncomesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedIncomes" />
            </template>
        </Dialog>
    </div>
</template>
