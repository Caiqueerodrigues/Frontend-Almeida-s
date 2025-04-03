<template>
    <v-row class="justify-center align-center bg-black py-12 container">
        <v-col cols="10" md="4" class="bg-primary rounded-xl shadow">
                <v-form :ref="form">
                    <v-row class="ma-0 pa-0 flex-column">
                        <v-col cols="12" class="ma-0 pa-0 d-flex justify-center">
                            <img src="/public/images/logo_sem_fundo.png" alt="Logo almeida">
                        </v-col>
                        <v-col cols="12" class="mb-0 pb-0">
                            <v-text-field
                                v-model="user.user"
                                rounded="xl"
                                class="mb-2"
                                variant="outlined"
                                type="text"
                                label="Insira seu usuário"
                                :rules="[(value) => !!value || 'O usuário é obrigatório!']"
                                @keydown.enter="submit()"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" class="mt-0  pt-0">
                                <v-text-field
                                v-model="user.password"
                                rounded="xl"
                                class="mb-2"
                                variant="outlined"
                                label="Insira sua senha"
                                :rules="[(value) => !!value || 'A senha é obrigatório!']"
                                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                :type="visible ? 'text' : 'password'"
                                @click:append-inner="visible = !visible"
                                @keydown.enter="submit()"
                            >
                        </v-text-field>
                        </v-col>
                        <v-col cols="12" class="text-center mt-0 pt-0">
                            <v-btn
                                variant="flat"
                                color="success"
                                rounded="xl"
                                :loading="loading"
                                :disabled="!user.user || !user.password"
                                @click="submit()"
                            >
                            Entrar
                        </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
</template>
<script setup>
    const axios = inject('axios');
    const showToastify = inject('showToastify');
    const router = useRouter();
    
    const loading = ref(false);
    const visible = ref(false);
    const form = ref(null);
    const user = ref({ user: null, password: null });

    const submit = async () => {
        if(!user.value.user || !user.value.password) {
            showToastify('Campos sem preenchimento', 'info');
            return;
        }

        loading.value = true;

        user.value.user = user.value.user.toLowerCase().trim() 
        axios.post('/users', user.value).then(response => {
            loading.value = false;
            sessionStorage.setItem('user', response.response);
            setTimeout(() => {
                router.push('/pedidos/0');
            }, 1000);
        }).catch(err => {
            loading.value = false;
            console.error(err);
        })
    }
</script>
<style scoped>
    .container {
        height: 100dvh;
    }

    img {
        width: 30%;
        height: 10%;
        border-radius: 20px;
    }

    .shadow {
        box-shadow: 4px 4px 15px #C0812D;
    }
</style>