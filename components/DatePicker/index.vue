<template>
    <p class="pl-3 text-secondary font-weight-bold">
        {{ props.title }}
    </p>
    <VueDatePicker 
        :class="props.class"
        v-model="dateSelected"
        locale="pt-BR"
        :min-date="minDate"
        :max-date="props.future ? null : now"
        :model-type="props.format"
        :format="format"
        auto-apply
        
        month-name-format="long"
        :name="props.name"
        dark
        :clearable="props.clearable ?? false"
        :range="props.range"
        @update:modelValue="emitEvento"
        :disabled="props.disabled ?? false"
    ></VueDatePicker>
</template>
<script setup>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import moment from 'moment-timezone';

    const props = defineProps([ 'title', 'range', 'format', 'name', 'date', 'onlyDate', 'clearable', 'class', 'disabled', 'future' ]);
    const emit = defineEmits([ 'dateEmit' ]);

    const timeZone = 'America/Sao_Paulo';

    const dateSelected = ref(
        props.date && props.date instanceof Date
            ? moment(props.date).tz(timeZone).toDate()
            : null
    );
    const minDate = moment('2000-01-01').tz(timeZone).toDate();
    const now = moment().tz(timeZone).toDate();

    const format = (date) => {
        const mDate = moment(date).tz(timeZone);
        const day = mDate.format('DD');
        const month = mDate.format('MM');
        const year = mDate.format('YYYY');
        const hour = mDate.format('HH:mm:ss');

        return props.onlyDate ?
            `${day}-${month}-${year}` :
            `${day}-${month}-${year} ${hour}`;
    }

    const emitEvento = () => {
        if (dateSelected.value) {
            emit("dateEmit", moment(dateSelected.value).tz(timeZone).toDate());
        } else {
            emit("dateEmit", null);
        }
    }
</script>
<style scoped>
    :deep(.dp__input) {
        background-color: #A60014;
        border-radius: 30px;
        border-color: #eeff00;
        color: #eeff00;
        font-weight: bold;
        padding-block: 15px;
    }

    :deep(.dp__menu) {
        border-radius: 20px;
        border-color: #eeff00;
        font-weight: bold;
        padding-bottom: 20px;
    }
</style>