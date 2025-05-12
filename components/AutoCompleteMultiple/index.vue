<template>
    <v-autocomplete
        v-model="selecteds"
        :disabled="props.disabled"
        :items="items"
        color="blue-grey-lighten-2"
        item-title="nome"
        item-value="id"
        :label="props.label"
        chips
        closable-chips
        multiple
        variant="outlined"
        rounded="xl"
        :type="props.type"
        :no-data-text="msgNoData"
        @keydown.enter="setNewValue"
        @change="setNewValue"
    >
        <template v-slot:chip="{ props, item }">
            <v-chip
                class="text-white font-weight-bold"
                v-bind="props"
                :text="item.nome"
            ></v-chip>
        </template>
    </v-autocomplete>
</template>

<script setup>
    const props = defineProps([ 'items', 'label', 'selecteds', 'disabled', 'outsideList', 'maxLength', 'type' ]);
    const emit = defineEmits([ 'salvar' ]);

    const msgNoData = ref('Sem dados');
    const selecteds = ref(
        props.items.length && Array.isArray(props.selecteds) ? props.selecteds.map(id => props.items.find(item => item.id === id)) : props.selecteds
    );
    const items = ref(props.items);

    const setNewValue = (ev) => {
        if(props.outsideList && selecteds.value.length < props.maxLength) {
            selecteds.value.push(ev.target.value);
            if(props.maxLength >= 100) emitEvent();
        }
        
        ev.target.value = '';
        ev.target.dispatchEvent(new Event('input'));

        setMsg();
    }
    
    const emitEvent = () => {
        emit('salvar', selecteds.value)
    }

    const setMsg = () => {
        if((selecteds.value && props.outsideList) && selecteds.value.length < props.maxLength) msgNoData.value = "Inserir novo valor";
        else if( selecteds.value &&  selecteds.value.length === props.maxLength) msgNoData.value = "Quantidade de materiais atingida";
        else msgNoData.value = 'Sem dados';
    };

    watch(() => selecteds.value, () => {
        setMsg();
        emitEvent();
    });

    onMounted(() => setMsg());
</script>
