<script setup>
import { useLayout } from '@/layout/composables/layout';
import { DashboardService } from '@/service/dashboard/DashboardService';
import { toTokenKey } from '@primevue/themes';
import { onMounted, ref, watch } from 'vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const chartOptions = ref(null);
const dashboardData = ref(null);

const incomeVsExpenseByMonth = ref(null);
const lineOptions = ref(null);

const expenseByWallet = ref(null);

const expenseStreamByMonth = ref(null);
const incomeStreamByMonth = ref(null);
const total_expense_this_month = ref(0);
const total_income_this_month = ref(0);
const total_money_in_all_wallet = ref(0);

onMounted(() => {
    chartOptions.value = setChartOptions();
    getDashboardData();
});

async function getDashboardData() {
    dashboardData.value = await DashboardService.getDashboardData();
    total_expense_this_month.value = dashboardData.value.data.total_expense_this_month;
    total_income_this_month.value = dashboardData.value.data.total_income_this_month;
    total_money_in_all_wallet.value = dashboardData.value.data.total_money_in_all_wallet;

    expenseStreamByMonth.value = convertToStackedChartDataWithBudget(dashboardData.value.data.expense_stream_by_month);
    incomeStreamByMonth.value = convertToStackedChartData(dashboardData.value.data.income_stream_by_month);
    incomeVsExpenseByMonth.value = convertToLineData(dashboardData.value.data.income_vs_expense_by_month);
    expenseByWallet.value = convertToPieData(dashboardData.value.data.expense_by_wallet);
}

function convertToStackedChartData(data) {
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const labels = Object.keys(data).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    const datasets = [];
    const categoryTotals = {};

    labels.forEach((month) => {
        data[month].forEach((item) => {
            if (!categoryTotals[item.category]) {
                categoryTotals[item.category] = {
                    label: `${item.category}`,
                    data: Array(labels.length).fill(0),
                    backgroundColor: generateColor(),
                    borderColor: 'transparent'
                };
                datasets.push(categoryTotals[item.category]);
            }
            const monthIndex = labels.indexOf(month);
            categoryTotals[item.category].data[monthIndex] = item.total;
        });
    });

    return {
        labels,
        datasets
    };
}

function convertToStackedChartDataWithBudget(data) {
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const labels = Object.keys(data).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    const datasets = [];
    const categoryTotals = {};

    labels.forEach((month) => {
        data[month].forEach((item) => {
            if (!categoryTotals[item.category]) {
                categoryTotals[item.category] = {
                    label: `${item.category}`,
                    data: Array(labels.length).fill(0),
                    borderColor: generateColor(),
                    backgroundColor: generateColor(),
                    stack: 'combined',
                    type: 'bar',
                    order: 1
                };

                // budget
                if (item.category === 'budget') {
                    categoryTotals[item.category] = {
                        label: `${item.category}`,
                        data: Array(labels.length).fill(0),
                        borderColor: 'green',
                        backgroundColor: 'green',
                        type: 'line',
                        order: 0,
                        tension: 0.4
                    };
                }

                datasets.push(categoryTotals[item.category]);
            }
            const monthIndex = labels.indexOf(month);
            categoryTotals[item.category].data[monthIndex] = item.total;
        });
    });
    return {
        labels,
        datasets
    };
}

function generateColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            tooltip: {
                callbacks: {
                    footer: (tooltipItems) => {
                        let budget = toTokenKey(tooltipItems[0].dataset.label) === 'budget' ? tooltipItems[0].parsed.y : 0;
                        let sum = 0 - budget;
                        tooltipItems.forEach((tooltipItem) => {
                            if (tooltipItem != 'budget') {
                                sum += tooltipItem.parsed.y;
                            }
                        });
                        return `Total: ${sum.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: 'transparent',
                    borderColor: 'transparent'
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: borderColor,
                    borderColor: 'transparent',
                    drawTicks: false
                }
            }
        }
    };
}

// line chart
const documentStyle = getComputedStyle(document.documentElement);
const textColor = documentStyle.getPropertyValue('--text-color');
const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

function convertToLineData(data) {
    const months = Object.keys(data);
    const incomeData = months.map((month) => data[month].income);
    const expenseData = months.map((month) => data[month].expense);

    return {
        labels: months,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-green-700'),
                borderColor: documentStyle.getPropertyValue('--p-green-700'),
                tension: 0.4
            },
            {
                label: 'Expense',
                data: expenseData,
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
                borderColor: documentStyle.getPropertyValue('--p-orange-500'),
                tension: 0.4
            },
            {
                label: 'Balance',
                data: incomeData.map((income, index) => income - expenseData[index]),
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-blue-500'),
                borderColor: documentStyle.getPropertyValue('--p-blue-500'),
                tension: 0.4
            }
        ]
    };
}

lineOptions.value = {
    plugins: {
        legend: {
            labels: {
                fontColor: textColor
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder,
                drawBorder: false
            }
        },
        y: {
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder,
                drawBorder: false
            }
        }
    }
};

const formatCurrency = (value) => {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
};

function convertToPieData(data) {
    const labels = data.map((item) => item.wallet);
    const totals = data.map((item) => item.total);

    const documentStyle = getComputedStyle(document.documentElement);
    const colors = [
        documentStyle.getPropertyValue('--p-indigo-500'),
        documentStyle.getPropertyValue('--p-purple-500'),
        documentStyle.getPropertyValue('--p-teal-500'),
        documentStyle.getPropertyValue('--p-orange-500'),
        documentStyle.getPropertyValue('--p-red-500')
    ];
    const hoverColors = [
        documentStyle.getPropertyValue('--p-indigo-400'),
        documentStyle.getPropertyValue('--p-purple-400'),
        documentStyle.getPropertyValue('--p-teal-400'),
        documentStyle.getPropertyValue('--p-orange-400'),
        documentStyle.getPropertyValue('--p-red-400')
    ];

    return {
        labels,
        datasets: [
            {
                data: totals,
                backgroundColor: colors.slice(0, data.length),
                hoverBackgroundColor: hoverColors.slice(0, data.length),
                label: 'Wallet Totals'
            }
        ]
    };
}

const pieOptions = {
    plugins: {
        legend: {
            labels: {
                usePointStyle: true,
                color: textColor
            }
        }
    }
};

watch([getPrimary, getSurface, isDarkTheme], () => {
    chartOptions.value = setChartOptions();
    dashboardData.value = getDashboardData();
});
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Expense This Month </span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ formatCurrency(total_expense_this_month - 0) }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium"> + 43% </span>
                <span class="text-muted-color">compare to last month</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Income This Month</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ formatCurrency(total_income_this_month - 0) }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-red-500 font-medium">%52- </span>
                <span class="text-muted-color">compare to last month</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Balance</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ formatCurrency(total_income_this_month - total_expense_this_month) }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">520 </span>
                <span class="text-muted-color">newly registered</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Combined Wallet Balance</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ formatCurrency(total_money_in_all_wallet - 0) }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">85 </span>
                <span class="text-muted-color">responded</span>
            </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Expense Stream</div>
                <Chart type="bar" :data="expenseStreamByMonth" :options="chartOptions" class="h-80" />
            </div>
            <div class="card">
                <div class="font-semibold text-xl mb-4">Monthly Cashflow</div>
                <Chart type="line" :data="incomeVsExpenseByMonth" :options="lineOptions"></Chart>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Revenue Stream</div>
                <Chart type="bar" :data="incomeStreamByMonth" :options="chartOptions" class="h-80" />
            </div>
            <div class="card">
                <div class="font-semibold text-xl mb-4">Expense by Wallet</div>
                <div class="flex flex-col items-center">
                    <Chart type="pie" :data="expenseByWallet" :options="pieOptions" class="h-80" />
                </div>
            </div>
        </div>
    </div>
</template>
