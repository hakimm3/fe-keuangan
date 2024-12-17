<script setup>
import { BudgetServices } from '@/service/data/BudgetService';
import { usePermissionsStore } from '@/store/permissions';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';

const budgets = ref();
const total_budget = ref(0);
const isLoading = ref(false);
const permissionStore = usePermissionsStore();

const fetchBudgets = async () => {
    try {
        isLoading.value = true;
        budgets.value = await BudgetServices.getData({
            month: dropdownValue.value.name,
            year: new Date().getFullYear()
        });

        // Calculate total budget after fetching data
        total_budget.value = budgets.value.reduce((total, item) => {
            return total + (item.budget?.amount || 0); // Handle null/undefined values
        }, 0);
        console.log(total_budget.value);
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchBudgets();
    // getTotalBudget();
});

const toast = useToast();
const dt = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const dropdownValues = ref([
    { name: 'January' },
    { name: 'February' },
    { name: 'March' },
    { name: 'April' },
    { name: 'May' },
    { name: 'June' },
    { name: 'July' },
    { name: 'August' },
    { name: 'September' },
    { name: 'October' },
    { name: 'November' },
    { name: 'December' }
]);

const currentMonthIndex = new Date().getMonth(); // 0-based index (0 = January)
const currentMonth = dropdownValues.value[currentMonthIndex];
const dropdownValue = ref(currentMonth);

async function updateBudget(value) {
    console.log(value.budget.amount);
    if (value.budget.amount > 0) {
        await BudgetServices.update({
            spending_category_id: value.id,
            month: dropdownValue.value.name,
            year: new Date().getFullYear(),
            amount: value.budget.amount
        });
        toast.add({ severity: 'success', summary: 'Success', detail: 'Budget updated', life: 3000 });

        // add total budget
        total_budget.value += value.budget.amount;
    }
}

watch(dropdownValue, (newValue) => {
    fetchBudgets({ code: newValue.code });
});

function formatCurrency(value) {
    if (value > 0) return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    return value;
}

const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Data' }, { label: 'Buget' }]);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
</script>

<template>
    <div class="card flex items-center justify-between py-3">
        <h2 class="font-semibold text-2xl">Budget</h2>
        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
    </div>

    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select Month" class="w-80" />
            </template>

            <template #end>
                <Button :label="'Total Budget ' + formatCurrency(total_budget)" icon="pi pi-palette" severity="secondary" />
            </template>
        </Toolbar>
        <DataTable
            ref="dt"
            :value="budgets"
            dataKey="id"
            :paginator="true"
            :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Monthly Budget</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                    </IconField>
                </div>
            </template>

            <Column field="name" header="Category" sortable style="min-width: 16rem"></Column>
            <Column field="budget.amount" header="Amount" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.budget.amount" @keyup.enter="updateBudget(slotProps.data)" :disabled="permissionStore.can('data-budget-update') ? false : true" mode="currency" currency="IDR" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
