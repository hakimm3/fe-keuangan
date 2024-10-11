<script setup>
import { WalletServices } from '@/service/master-data/WalletService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const wallet = ref();
const wallets = ref();
const isLoading = ref(false);

const fetchWallets = async () => {
    try {
        isLoading.value = true;
        wallets.value = await WalletServices.getData();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchWallets();
});

const toast = useToast();
const dt = ref();

const walletDialog = ref(false);
const walletDeleteDialog = ref(false);
const deleteWalletsDialog = ref(false);

const selectedWallets = ref();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function formatCurrency(value) {
    if (!isNaN(value)) return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    return;
}

function openNew() {
    wallet.value = {};
    submitted.value = false;
    walletDialog.value = true;
}

function hideDialog() {
    walletDialog.value = false;
    submitted.value = false;
}

function showToastError(message) {
    toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
}

async function saveIncomeCategory() {
    submitted.value = true;

    if (wallet?.value.name) {
        if (wallet.value.id) {
            const response = await WalletServices.update(wallet.value.id, {
                name: wallet.value.name,
                topup_fee: wallet.value.topup_fee
            });
            if (response.status === 422) {
                showToastError(response.data.message);
                return;
            }

            wallets.value[findIndexById(wallet.value.id)] = wallet.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Wallets Updated', life: 3000 });
        } else {
            const response = await WalletServices.create({
                name: wallet.value.name,
                topup_fee: wallet.value.topup_fee
            });
            if (response.status === 422) {
                showToastError(response.data.message);
                return;
            }
            wallets.value.unshift(response.data);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Wallets Created', life: 3000 });
        }

        walletDialog.value = false;
        wallet.value = {};
    }
}

function editIncomeCategory(exp) {
    wallet.value = {
        id: exp.id,
        name: exp.name,
        topup_fee: exp.topup_fee
    };
    walletDialog.value = true;
}

function confirmDeleteWallet(exp) {
    wallet.value = exp;
    walletDeleteDialog.value = true;
}

function walletDelete() {
    WalletServices.delete(wallet.value.id);

    wallets.value = wallets.value.filter((val) => val.id !== wallet.value.id);
    walletDeleteDialog.value = false;
    wallet.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Wallet Deleted', life: 3000 });
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < wallets.value.length; i++) {
        if (wallets.value[i].id === id) {
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
    deleteWalletsDialog.value = true;
}

function deleteSelectedWallets() {
    let ids = selectedWallets.value.map((exp) => exp.id);
    // console.log({ ids: ids });
    WalletServices.bulkDelete({ ids: ids });
    wallets.value = wallets.value.filter((val) => !ids.includes(val.id));

    deleteWalletsDialog.value = false;
    selectedWallets.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Income Deleted', life: 3000 });
}

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Master Data' }, { label: 'Wallets' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>

<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">Wallets</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedWallets || !selectedWallets.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedWallets"
                :value="wallets"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} wallets"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Wallets</h4>
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
                <Column field="topup_fee" header="Topup Fee" sortable>
                    <template #body="slotProps">{{ formatCurrency(slotProps.data.topup_fee) }}</template>
                </Column>
                <Column :exportable="false">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editIncomeCategory(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteWallet(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="walletDialog" :style="{ width: '450px' }" header="Income Category Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="wallet.name" required="true" autofocus :invalid="submitted && !wallet.name" fluid />
                    <small v-if="submitted && !wallet.name" class="text-red-500">name is required.</small>
                </div>
                <div>
                    <label for="topup_fee" class="block font-bold mb-3">Top Up Fee</label>
                    <InputText id="topup_fee" v-model.trim="wallet.topup_fee" required="true" autofocus fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveIncomeCategory" />
            </template>
        </Dialog>

        <Dialog v-model:visible="walletDeleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="wallet"
                    >Are you sure you want to delete <b>{{ wallet.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="walletDeleteDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="walletDelete" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteWalletsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedWallets">Are you sure you want to delete the selected wallets?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteWalletsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedWallets" />
            </template>
        </Dialog>
    </div>
</template>
