<script setup>
import { MyWalletTransactionService } from '@/service/data/MyWalletTransactionService';
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

const transactions = ref();
const isLoading = ref(false);

const fetchTransaction = async () => {
    try {
        isLoading.value = true;
        transactions.value = await MyWalletTransactionService.getData();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchTransaction();
});

const dt = ref();
const selectedMyWallets = ref();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

function formatCurrency(value) {
    if (value) return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    return;
}

function exportCSV() {
    dt.value.exportCSV();
}

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Data' }, { label: 'Expense' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>

<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">My Wallets Transactions</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Back" icon="pi pi-arrow-left" severity="secondary" as="router-link" to="/data/my-wallets" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedMyWallets"
                :value="transactions"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} transactions"
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
                <Column field="user_wallet.wallet.name" header="Wallet" sortable></Column>
                <Column field="type" header="Type" sortable>
                    <template #body="props">
                        <Badge :severity="props.data.type === 'in' ? 'success' : 'danger'" class="capitalize">{{ props.data.type }}</Badge>
                    </template>
                </Column>
                <Column field="amount" header="Amount" sortable>
                    <template #body="props">
                        <span>{{ formatCurrency(props.data.amount) }}</span>
                    </template>
                </Column>
                <Column field="description" header="Description" sortable> </Column>
            </DataTable>
        </div>
    </div>
</template>
