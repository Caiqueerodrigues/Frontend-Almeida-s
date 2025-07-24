<template>
    <v-form ref="form">
        <v-row class="h-100 justify-center align-center">
            <v-col cols="12">
                <h2 class="text-center text-secondary py-4">
                    Olá, {{ usernameToken() }}
                </h2>
            </v-col>

            <v-col 
                cols="8"
            >
                <v-img
                    width="100%"
                    height="400px"
                    cover
                    :src="user.photo"
                    class="ma-3 rounded-xl d-flex justify-space-between pointer"
                    @click.stop="triggerFileInput()"
                >
                    <v-icon
                        @click.stop="triggerFileInput()"
                        class="pa-8 ma-3 text-secondary"
                        size="40"
                    >
                        mdi-pencil
                    </v-icon>
                    <input
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        @change="handleFileChange"
                        style="display: none"
                    />
                </v-img>
            </v-col>

            <v-col cols="12" md="8">
                <v-text-field
                    rounded="xl"
                    label="Nome Completo"
                    v-model="user.fullName"
                    type="text"
                    variant="outlined"
                    :rules="[ (value) => !!value || 'Campo obrigatório!' ]"
                ></v-text-field>
            </v-col>
            <v-col cols="8" class="d-flex">
                <v-text-field
                    rounded="xl"
                    label="Como gostaria de ser chamado(a)?"
                    class="w-50 mr-5"
                    v-model="user.name"
                    type="text"
                    variant="outlined"
                    :rules="[ (value) => !!value || 'Campo obrigatório!' ]"
                ></v-text-field>
                <v-text-field
                    rounded="xl"
                    class="w-50"
                    label="Função"
                    v-model="user.funct"
                    type="text"
                    variant="outlined"
                    :rules="[ (value) => !!value || 'Campo obrigatório!' ]"
                ></v-text-field>
            </v-col>

            <v-col cols="8" class="d-flex">
                <v-select
                    chips
                    rounded="xl"
                    class="w-select"
                    label="Sexo"
                    :items="[ 'M', 'F' ]"
                    variant="outlined"
                    :rules="[ (value) => !!value || 'Campo obrigatório!' ]"
                    v-model="user.sex"
                ></v-select>

                <v-text-field
                    rounded="xl"
                    class="w-50 ms-5"
                    label="Nome de Usuário"
                    v-model="user.user"
                    type="text"
                    variant="outlined"
                    :rules="[ (value) => !!value || 'Campo obrigatório!' ]"
                ></v-text-field>

                <v-radio-group
                    v-model="user.active"
                    inline
                    class="d-flex justify-center color-default"
                    label="Está ativo?"
                >
                    <v-radio
                        label="Sim"
                        :value="true"
                    ></v-radio>
                    <v-radio
                        label="Não"
                        :value="false"
                    ></v-radio>
                </v-radio-group>
            </v-col>

            <v-col cols="8" class="d-flex ga-4">
                <div class="w-50">
                    <p class="text-secondary font-weight-bold text-center">Seu primeiro login</p>
                    <VueDatePicker 
                        v-model="user.firstLogin"
                        locale="pt-BR"
                        :format="formatDate"
                        dark
                        disabled
                    ></VueDatePicker>
                </div>
                <div class="w-50">
                    <p class="text-secondary font-weight-bold text-center">Seu último login</p>
                    <VueDatePicker 
                        v-model="user.lastLogin"
                        locale="pt-BR"
                        :format="formatDate"
                        dark
                        disabled
                    ></VueDatePicker>
                </div>
            </v-col>

            <v-col cols="8">
                <p class="text-h6 text-center text-secondary">TROCAR DE SENHA</p>
            </v-col>
            <v-col cols="8" class="mt-0 d-flex pt-0">
                <v-text-field
                    v-model="user.newPassword"
                    rounded="xl"
                    class="mb-2 w-50"
                    variant="outlined"
                    label="Insira a nova senha"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visible ? 'text' : 'password'"
                    @click:append-inner="visible = !visible"
                ></v-text-field>
                <v-text-field
                    v-model="confirmNewPassword"
                    rounded="xl"
                    class="mb-2 w-50 ms-4"
                    variant="outlined"
                    label="Insira novamente a nova senha"
                    :rules="[rules.confirmPasswordRequiredIfFilled, rules.confirmPasswordMustMatch]"
                    type="password"
                    @click:append-inner="visible = !visible"
                ></v-text-field>
            </v-col>

            <v-col cols="8" class="d-flex justify-center mb-8">
                <v-btn variant="outlined" class="rounded-xl mr-6 font-weight-bold" @click="onCancelar()">
                    CANCELAR
                </v-btn>
                <v-btn color="success" class="rounded-xl px-10 font-weight-bold" @click="submit()">
                    SALVAR
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
<script setup>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import { idUserToken, usernameToken } from '~/services/tokenService';

    const axios = inject("axios");
    const router = useRouter();
    const showToastify = inject("showToastify");
    const validForm = inject("validateForm");

    const form = ref(null);
    const fileInput = ref(null);
    const id = ref(null);
    const visible = ref(false);
    const confirmNewPassword = ref(null);
    const rules = {
        confirmPasswordRequiredIfFilled: (value) => {
            if (user.value.newPassword) {
                return !!value || 'Campo obrigatório!';
            }
            return true;
        },
        confirmPasswordMustMatch: (value) => {
            if (user.value.newPassword && confirmNewPassword.value !== user.value.newPassword) {
                return 'As senhas não coincidem!';
            }
            return true;
        },
    };
    const user = ref({
        name: '',
        fullName: '',
        funct: '',
        photo: '',
        sex: '',
        user: '',
        active: null,
        newPassword: null,
        firstLogin: '',
        lastLogin: '',
    });

    const triggerFileInput = () => {
        fileInput.value?.click();
    };

    const handleFileChange = (event) => {
        const file = event?.target?.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                user.value.photo = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const onCancelar = () => {
        router.back();
    }

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const getDados = () => {
        axios.get(`/users/${id.value}`).then(response => {
            user.value = response;
        }).catch(e => console.error(e));
    }

    const submit = () => {
        if(form.value) {
            showToastify('Em desenvolvimento', 'info');
            //TODO BACKEND
        }
    }

    onBeforeMount(() => {
        id.value = idUserToken();
        getDados();
    })
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