<script setup>
import { MyWalletService } from '@/service/data/MyWalletService';
import { WalletServices } from '@/service/master-data/WalletService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const expenses = ref();
const wallets = ref();
const isLoading = ref(false);

const fetchMyWallets = async () => {
    try {
        isLoading.value = true;
        expenses.value = await MyWalletService.getData();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

const fetchWallets = async () => {
    try {
        isLoading.value = true;
        wallets.value = await WalletServices.getData().then((data) => data.map((wallet) => ({ label: wallet.name, value: wallet })));
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchMyWallets();
    fetchWallets();
});

const toast = useToast();
const dt = ref();

const expenseDialog = ref(false);
const deleteExpenseDialog = ref(false);
const deleteMyWalletsDialog = ref(false);

const expense = ref({});

const selectedMyWallets = ref();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function formatCurrency(value) {
    if (value) return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    return;
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

async function saveMyWallet() {
    submitted.value = true;

    if (expense?.value.wallet_id && expense?.value.balance && expense?.value.monthly_fee) {
        if (expense.value.id) {
            await MyWalletService.update(expense.value.id, {
                wallet_id: expense.value.wallet_id.value.id,
                balance: expense.value.balance,
                monthly_fee: expense.value.monthly_fee
            });
            expenses.value[findIndexById(expense.value.id)] = { id: expense.value.id, balance: expense.value.balance, monthly_fee: expense.value.monthly_fee, wallet: { name: expense.value.wallet_id.value.name } };
            toast.add({ severity: 'success', summary: 'Successful', detail: 'My Wallet Updated', life: 3000 });
        } else {
            await MyWalletService.create({
                wallet_id: expense.value.wallet_id.value.id,
                balance: expense.value.balance,
                monthly_fee: expense.value.monthly_fee
            });
            expenses.value.unshift({ balance: expense.value.balance, monthly_fee: expense.value.monthly_fee, wallet: { name: expense.value.wallet_id.value.name } });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'My Wallet Created', life: 3000 });
        }

        expenseDialog.value = false;
        expense.value = {};
    }
}

function editMyWallet(exp) {
    expense.value = {
        id: exp.id,
        balance: exp.balance,
        monthly_fee: exp.monthly_fee,
        wallet_id: wallets.value.find((wallet) => wallet.value.id === exp.wallet.id)
    };
    expenseDialog.value = true;
}

function confirmDeleteWallet(exp) {
    expense.value = exp;
    deleteExpenseDialog.value = true;
}

function deleteMyWallets() {
    MyWalletService.delete(expense.value.id);

    expenses.value = expenses.value.filter((val) => val.id !== expense.value.id);
    deleteExpenseDialog.value = false;
    expense.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Wallets Deleted', life: 3000 });
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

function confirmDeleteSelected() {
    deleteMyWalletsDialog.value = true;
}

function deleteSelectedWallets() {
    let ids = selectedMyWallets.value.map((exp) => exp.id);
    // console.log({ ids: ids });
    MyWalletService.bulkDelete({ ids: ids });
    expenses.value = expenses.value.filter((val) => !ids.includes(val.id));

    deleteMyWalletsDialog.value = false;
    selectedMyWallets.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Wallets Deleted', life: 3000 });
}

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Data' }, { label: 'Expense' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>

<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">My Wallets</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedMyWallets || !selectedMyWallets.length" />
                    <Button label="Transaction History" icon="pi pi-list" severity="secondary" class="ml-2" as="router-link" :to="{ name: 'myWalletTransactions' }" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedMyWallets"
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
                        <h4 class="m-0">Manage My Wallets</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="wallet.name" header="Wallet" sortable></Column>
                <Column field="balance" header="Balance" sortable>
                    <template #body="props">
                        <span>{{ formatCurrency(props.data.balance) }}</span>
                    </template>
                </Column>
                <Column field="monthly_fee" header="Monthly Fee" sortable>
                    <template #body="props">
                        <span>{{ formatCurrency(props.data.monthly_fee) }}</span>
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editMyWallet(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteWallet(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="expenseDialog" :style="{ width: '450px' }" header="My Wallet Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="date" class="block font-bold mb-3">Wallet</label>
                    <Select id="wallet_id" v-model="expense.wallet_id" :options="wallets" optionLabel="label" placeholder="Select a Category" required="true" :invalid="submitted && !expense.wallet_id" fluid></Select>
                    <small v-if="submitted && !expense.wallet_id" class="text-red-500">Wallet is required.</small>
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Balance</label>
                    <InputNumber id="balance" v-model.trim="expense.balance" required="true" autofocus :invalid="submitted && !expense.balance" fluid />
                    <small v-if="submitted && !expense.balance" class="text-red-500">description is required.</small>
                </div>
                <div>
                    <label for="price" class="block font-bold mb-3">Monthly Fee</label>
                    <InputNumber id="monthly_fee" v-model.trim="expense.monthly_fee" required="true" :invalid="submitted && !expense.monthly_fee" fluid />
                    <small v-if="submitted && !expense.monthly_fee" class="text-red-500">Monthly fee is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveMyWallet" />
            </template>
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
                <Button label="Yes" icon="pi pi-check" @click="deleteMyWallets" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteMyWalletsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedMyWallets">Are you sure you want to delete the selected wallets?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteMyWalletsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedWallets" />
            </template>
        </Dialog>
    </div>
</template>
