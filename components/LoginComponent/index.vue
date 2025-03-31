<template>
    <v-row class="justify-center align-center bg-black py-12 container">
        <v-col cols="10" md="6" class="bg-primary rounded-xl shadow">
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
        loading.value = true;

        axios.post('/users', user.value).then(response => {
            loading.value = false;
            sessionStorage.setItem('user', JSON.stringify(response.token));
            router.push('/pedidos');
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
        width: 60%;
        height: 10%;
        border-radius: 20px;
    }

    .shadow {
        box-shadow: 4px 4px 15px #C0812D;
    }
</style>