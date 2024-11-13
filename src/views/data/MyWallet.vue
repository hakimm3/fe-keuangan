<script setup>
import { MyWalletService } from '@/service/data/MyWalletService';
import { WalletServices } from '@/service/master-data/WalletService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const myWallets = ref();
const wallets = ref();
const selectMyWallets = ref();
const isLoading = ref(false);

const fetchMyWallets = async () => {
    try {
        isLoading.value = true;
        myWallets.value = await MyWalletService.getData();
        selectMyWallets.value = await MyWalletService.getData().then((data) => data.map((myWallet) => ({ label: myWallet.wallet.name, value: myWallet })));
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
const topupDialog = ref(false);

const my_wallet = ref({});
const topup = ref({});

const selectedMyWallets = ref();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function formatCurrency(value) {
    if (value) return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    return;
}

function showToastError(message) {
    toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
}

function openNew() {
    my_wallet.value = {};
    submitted.value = false;
    expenseDialog.value = true;
}

function hideDialog() {
    expenseDialog.value = false;
    submitted.value = false;
}

async function saveMyWallet() {
    submitted.value = true;

    if (my_wallet?.value.wallet_id && my_wallet?.value.balance && my_wallet?.value.monthly_fee) {
        if (my_wallet.value.id) {
            const response = await MyWalletService.update(my_wallet.value.id, {
                wallet_id: my_wallet.value.wallet_id.value.id,
                description: my_wallet.value.description,
                balance: my_wallet.value.balance,
                monthly_fee: my_wallet.value.monthly_fee,
                status: my_wallet.value.status.value
            });

            if (response.status === 422) {
                showToastError(response.data.message);
                return;
            }

            myWallets.value[findIndexById(my_wallet.value.id)] = {
                id: my_wallet.value.id,
                description: my_wallet.value.description,
                balance: my_wallet.value.balance,
                monthly_fee: my_wallet.value.monthly_fee,
                wallet: { name: my_wallet.value.wallet_id.value.name },
                status: my_wallet.value.status.value
            };
            toast.add({ severity: 'success', summary: 'Successful', detail: 'My Wallet Updated', life: 3000 });
        } else {
            const response = await MyWalletService.create({
                wallet_id: my_wallet.value.wallet_id.value.id,
                description: my_wallet.value.description,
                balance: my_wallet.value.balance,
                monthly_fee: my_wallet.value.monthly_fee,
                status: my_wallet.value.status.value
            });

            if (response.status === 422) {
                showToastError(response.data.message);
                return;
            }

            myWallets.value.unshift({
                balance: my_wallet.value.balance,
                description: my_wallet.value.description,
                monthly_fee: my_wallet.value.monthly_fee,
                wallet: { name: my_wallet.value.wallet_id.value.name },
                status: my_wallet.value.status.value
            });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'My Wallet Created', life: 3000 });
        }

        expenseDialog.value = false;
        my_wallet.value = {};
    }
}

async function submitTopup() {
    submitted.value = true;

    if (topup.value?.wallet_source_id && topup.value?.wallet_destionation_id && topup.value?.admin_fee && topup.value?.amount) {
        const response = MyWalletService.topUp({
            wallet_source_id: topup.value.wallet_source_id.value.id,
            wallet_destionation_id: topup.value.wallet_destionation_id.value.id,
            amount: topup.value.amount,
            admin_fee: topup.value.admin_fee,
            date: topup.value.date
        });

        if (response.status === 422) {
            showToastError(response.data.message);
            return;
        }

        toast.add({ severity: 'success', summary: 'Successful', detail: 'Top Up Successful', life: 300 });
        topupDialog.value = false;
        submitted.value = false;
        updateWalletsAfterTopUp();
        topup.value = {};
    }
}

function updateWalletsAfterTopUp() {
    let sourceWalletId = topup.value.wallet_source_id?.value.id;
    let destinationWalletId = topup.value.wallet_destionation_id.value.id;
    let amount = topup.value.amount;
    let admin_fee = topup.value.admin_fee;
    // Find indexes of the source and destination wallets
    const sourceIndex = findIndexById(sourceWalletId);
    const destinationIndex = findIndexById(destinationWalletId);

    if (destinationIndex !== -1 && sourceIndex !== -1) {
        // Deduct from source wallet
        myWallets.value[sourceIndex] = {
            ...myWallets.value[sourceIndex],
            balance: myWallets.value[sourceIndex].balance - admin_fee - amount
        };

        // Add to destination wallet
        myWallets.value[destinationIndex] = {
            ...myWallets.value[destinationIndex],
            balance: myWallets.value[destinationIndex].balance + amount
        };
    } else {
        console.error('Source or destination wallet not found');
    }
}

function editMyWallet(exp) {
    my_wallet.value = {
        id: exp.id,
        balance: exp.balance,
        monthly_fee: exp.monthly_fee,
        wallet_id: { label: exp.wallet.name, value: exp.wallet },
        description: exp.description,
        status: { label: exp.status ? 'Active' : 'Inactive', value: exp.status }
    };
    expenseDialog.value = true;
}

function confirmDeleteWallet(exp) {
    my_wallet.value = exp;
    deleteExpenseDialog.value = true;
}

function deleteMyWallets() {
    MyWalletService.delete(my_wallet.value.id);

    myWallets.value = myWallets.value.filter((val) => val.id !== my_wallet.value.id);
    deleteExpenseDialog.value = false;
    my_wallet.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Wallets Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < myWallets.value.length; i++) {
        if (myWallets.value[i].id === id) {
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
    myWallets.value = myWallets.value.filter((val) => !ids.includes(val.id));

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
                    <Button label="Top Up" icon="pi pi-upload" severity="secondary" class="mx-2" @click="topupDialog = true" />
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
                :value="myWallets"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Wallets"
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
                <Column field="description" header="Description"></Column>
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
                <Column field="status" header="Status" sortable>
                    <template #body="props">
                        <!-- badge -->
                        <Badge :severity="props.data.status ? 'success' : 'danger'">{{ props.data.status ? 'Active' : 'Inactive' }}</Badge>
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
                    <label for="wallet" class="block font-bold mb-3">Wallet</label>
                    <Select id="wallet_id" v-model="my_wallet.wallet_id" :options="wallets" optionLabel="label" placeholder="Select a Category" required="true" :invalid="submitted && !my_wallet.wallet_id" fluid></Select>
                    <small v-if="submitted && !my_wallet.wallet_id" class="text-red-500">Wallet is required.</small>
                </div>
                <div>
                    <label for="date" class="block font-bold mb-3">Description</label>
                    <InputText id="description" v-model.trim="my_wallet.description" required="true" fluid />
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Balance</label>
                    <InputNumber id="balance" v-model.trim="my_wallet.balance" required="true" autofocus :invalid="submitted && !my_wallet.balance" fluid />
                    <small v-if="submitted && !my_wallet.balance" class="text-red-500">description is required.</small>
                </div>
                <div>
                    <label for="price" class="block font-bold mb-3">Monthly Fee</label>
                    <InputNumber id="monthly_fee" v-model.trim="my_wallet.monthly_fee" required="true" :invalid="submitted && !my_wallet.monthly_fee" fluid />
                    <small v-if="submitted && !my_wallet.monthly_fee" class="text-red-500">Monthly fee is required.</small>
                </div>
                <div>
                    <label for="status" class="block font-bold mb-3">Status</label>
                    <Select
                        id="status"
                        v-model="my_wallet.status"
                        :options="[
                            { label: 'Active', value: 1 },
                            { label: 'Inactive', value: 0 }
                        ]"
                        optionLabel="label"
                        placeholder="Select a Status"
                        required="true"
                        :invalid="submitted && !my_wallet.status"
                        fluid
                    ></Select>
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
                <span v-if="my_wallet"
                    >Are you sure you want to delete <b>{{ my_wallet.description }}</b
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

        <Dialog v-model:visible="topupDialog" :style="{ width: '450px' }" header="Top Up Wallet" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="wallet" class="block font-bold mb-3">Wallet Source</label>
                    <Select id="wallet_source_id" v-model="topup.wallet_source_id" :options="selectMyWallets" optionLabel="label" placeholder="Select a Wallet" required="true" :invalid="submitted && !topup.wallet_source_id" fluid autofocus></Select>
                    <small v-if="submitted && !topup.wallet_source_id" class="text-red-500">Wallet Source is required.</small>
                </div>
                <div>
                    <label for="date" class="block font-bold mb-3">Wallet Destionation</label>
                    <Select
                        id="wallet_destionation_id"
                        v-model="topup.wallet_destionation_id"
                        :options="selectMyWallets"
                        optionLabel="label"
                        placeholder="Select a Wallet"
                        required="true"
                        :invalid="submitted && !topup.wallet_destionation_id"
                        fluid
                    ></Select>
                    <small v-if="submitted && !topup.wallet_destionation_id" class="text-red-500">Wallet Destionation is required.</small>
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Amount</label>
                    <InputNumber id="amount" v-model.trim="topup.amount" required="true" :invalid="submitted && !topup.amount" fluid />
                    <small v-if="submitted && !topup.amount" class="text-red-500">Amount is required.</small>
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Admin Fee</label>
                    <InputNumber id="admin_fee" v-model.trim="topup.admin_fee" :invalid="submitted && !topup.admin_fee" required="true" fluid="" />
                    <small v-if="submitted && !topup.admin_fee" class="text-red-500">Date is required.</small>
                </div>
                <div>
                    <label for="date">Date</label>
                    <DatePicker id="date" v-model="topup.date" :invalid="submitted && !topup.date" required="true" fluid />
                    <small v-if="submitted && !topup.date" class="text-red-500">Date is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="topupDialog = false" />
                <Button label="Save" icon="pi pi-check" @click="submitTopup" />
            </template>
        </Dialog>
    </div>
</template>
