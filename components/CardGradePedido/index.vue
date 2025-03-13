<template>
    <div class="container" @mouseleave="emitEvent()" v-if="!props.plus">
        <div class="interno d-flex flex-column align-center pt-4">
            <v-icon class="close" @click="addRemoveItem('remove')">
                mdi-close
            </v-icon>
            <v-text-field
                rounded="xl"
                class="mb-2 w-75"
                v-model="item.grade"
                variant="outlined"
                type="tel"
                :hide-details="true"
                :rules="[(value) => !!value || '']"
                @input="formateddGrade($event)"
            ></v-text-field>
            <div class="divider"></div>
            <v-text-field
                rounded="xl"
                class="mb-4 mt-2 w-75"
                v-model="item.qtd"
                type="number"
                :hide-details="true"
                variant="outlined"
                :rules="[(value) => !!value || '']"
                @input="formatQuantity"
            ></v-text-field>
        </div>
    </div>
    <div class="container" @click="addRemoveItem('add')" v-if="props.plus">
        <div class="interno d-flex align-center justify-center text-secondary cursor-pointer">
            <v-icon size="100">
                mdi-plus
            </v-icon>
        </div>
    </div>
</template>
<script setup>
    const props = defineProps([ 'item', 'index', 'plus' ]);
    const emit = defineEmits([ 'salvar', 'add', 'remove' ]);

    const item = ref(props.item ? 
        {
        grade: props.item.grade,
        qtd: props.item.qtd,
        index: props.index
    }
    : {}
    );

    const formateddGrade = () => {
        let gradeText = String(item.value.grade).replace(/\D/g, '');
        let result = '';

        if (gradeText[0] === '0') gradeText = gradeText.slice(1);

        if (gradeText.length > 4) {
            result = gradeText.slice(0, 2) + "/" + gradeText.slice(2, 4) + "/" + gradeText.slice(4, 6);
        } 
        else if (gradeText.length > 2) {
            result = gradeText.slice(0, 2) + "/" + gradeText.slice(2, 4);
        }
        else {
            result = gradeText;
        }

        item.value.grade = result;
    };

    const formatQuantity = () => {
        let formattedValue = String(item.value.qtd);

        if (formattedValue.length > 4) {
            formattedValue = formattedValue.slice(0, -1);
        }

        item.value.qtd = Number(formattedValue);
    };

    const emitEvent = () => {
        emit('salvar', item.value);
    };

    const addRemoveItem = (type) => {
        emit(type, { grade: '', qtd: null });
    }
</script>
<style scoped>
    .container {
        width: 170px;
        min-height: 170px;
        padding: 1px 4px 4px 0px;
        border-radius: 40px;
        box-shadow: 5px 5px 15px #D96429;
        position: relative;
    }
    
    .interno {
        background-color: #00000093;
        height: 100%;
        width: 100%;
        border-radius: 40px;
    }

    .divider {
        height: 4px;
        width: 80%;
        background-color: #C84222;
    }

    .close {
        position: absolute;
        right: 5px;
        margin-top: -15px;
        cursor: pointer;
    }

    :deep(.v-input--density-default .v-field__input) {
        text-align: center;
        padding-inline: 0;
    }
</style>