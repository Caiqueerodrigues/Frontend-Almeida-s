<template>
    <p class="pl-3 text-secondary font-weight-bold">
        {{ props.title }}
    </p>
    <VueDatePicker 
        v-model="dateSelected"
        locale="pt-BR"
        :min-date="new Date('2000-01-01')"
        :max-date="new Date()"
        :model-type="props.format"
        :format="format"
        auto-apply
        enable-seconds
        time-picker-inline
        month-name-format="long"
        :name="props.name"
        dark
        :clearable="props.clearable ?? false"
        :range="props.range"
        @update:modelValue="emitEvento"
    ></VueDatePicker>
</template>
<script setup>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    
    const props = defineProps([ 'title', 'range', 'format', 'name', 'date', 'onlyDate', 'clearable' ]);
    const emit = defineEmits([ 'dateEmit' ]);

    const dateSelected = ref(props.date && props.date instanceof Date ? props.date.toISOString() : null);
    
    const format = (date) => {
        const adjustedDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));

        let day = adjustedDate.getDate();
        const month = adjustedDate.getMonth() + 1;
        const year = adjustedDate.getFullYear();
        const hour = adjustedDate
            .toISOString()
            .split("T")[1]
            .split('.')[0];

        return props.onlyDate ?
            `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}` :
            `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year} ${hour}`;
    }

    const emitEvento = () => {
        emit("dateEmit", dateSelected.value);
    }
</script>
<style scoped>
    :deep(.dp__input) {
        background-color: #A60014;
        border-radius: 20px;
        border-color: #D96429;
        color: #D96429;
        font-weight: bold;
    }

    :deep(.dp__menu) {
        border-radius: 20px;
        border-color: #D96429;
        font-weight: bold;
        padding-bottom: 20px;
    }
</style>