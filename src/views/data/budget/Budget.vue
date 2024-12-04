<script setup>
import { BudgetServices } from '@/service/data/BudgetService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';

const budgets = ref();
const isLoading = ref(false);

const fetchBudgets = async () => {
    try {
        isLoading.value = true;
        budgets.value = await BudgetServices.getData({ month: dropdownValue.value.name, year: new Date().getFullYear() });
        console.log(budgets.value);
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchBudgets();
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
    }
}

watch(dropdownValue, (newValue) => {
    fetchBudgets({ code: newValue.code });
});

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
                <Button label="Template" icon="pi pi-palette" severity="secondary" @click="exportCSV($event)" />
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
                    <InputNumber v-model="slotProps.data.budget.amount" @keyup.enter="updateBudget(slotProps.data)" mode="currency" currency="IDR" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
