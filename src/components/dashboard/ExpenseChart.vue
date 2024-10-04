<script setup>
const props = defineProps({
    stackedChartData: {
        type: Object,
        required: true
    },
    chartOptions: {
        type: Object,
        required: true
    }
});

console.log('stackedChartData', props.stackedChartData);
</script>

<template>
    <Chart type="bar" :data="props.stackedChartData" :options="props.chartOptions" class="h-80" />
</template>
