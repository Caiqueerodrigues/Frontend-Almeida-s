<template>
    <v-card>
        <Loading v-if="loading || !mounted"/>
        <v-layout v-if="route.path !== '/login'">
            <v-app-bar color="#000" class="pr-4">
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" :disabled="loading"></v-app-bar-nav-icon>

                <v-toolbar-title class="text-secondary ml-n2">
                    <v-row class="align-center justify-space-between">
                        <v-col cols="1">
                            <img 
                                src="../assets/images/logo.png" 
                                alt="Logo da empresa" 
                                class="leao cursor-pointer" 
                                @click="navigateTo('/pedidos')"
                            >
                        </v-col>
                        <v-col cols="9" class="d-flex justify-center pl-12">
                            <img src="../assets/images/logo_escrito.png" alt="Texto da logo da empresa" class="logoEscrito">
                        </v-col>
                        <v-col cols="1" md="0">
                            <div class="text-center">
                                <v-menu
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :disabled="loading"
                                    location="bottom"
                                >
                                    <template v-slot:activator="{ props }">
                                        <v-btn
                                            v-bind="props"
                                        >
                                            <img :src="backgroundImage" alt="Avatar do usuário" style="width: 40px">
                                        </v-btn>
                                    </template>

                                    <v-card min-width="300">
                                        <v-list>
                                        <v-list-item
                                            :prepend-avatar="dadosUser.photo"
                                            :title="(dadosUser.sexo === 'M' ? 'Bem vindo ' : 'Bem vinda ') + (tokenUser() ?? '')"
                                            :subtitle="dadosUser.funcao + ` Almeida's Cortes`"
                                        ></v-list-item>
                                        </v-list>

                                        <v-divider></v-divider>
                                        <v-list>
                                            <v-list-item>
                                                <v-btn
                                                    variant="text"
                                                    @click="showToast('Em desenvolvimento')"
                                                >
                                                    <v-icon>mdi-account</v-icon>
                                                    PERFIL
                                                </v-btn>
                                            </v-list-item>
                                        </v-list>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn
                                                color="primary"
                                                variant="text"
                                                @click="menu = false, goTo('/login')"
                                            >
                                                <v-icon>mdi-power</v-icon>
                                                Sair
                                                <v-icon>mdi-power</v-icon>
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu>
                            </div>
                        </v-col>
                    </v-row>
                </v-toolbar-title>
            </v-app-bar>

            <v-navigation-drawer
                v-model="drawer"
                class="bg-black"
                temporary
            >
                <p class="font-weight-bold ml-2 text-center text-secondary my-4 d-flex align-center">
                    <img :src="backgroundImage" alt="Avatar do usuário" class="mr-2" style="width: 40px">
                    Bem vind{{ dadosUser.sexo === "M" ? 'o' : 'a' }} {{ tokenUser() ?? '' }}
                </p>
                <v-expansion-panels variant="accordion">
                    <v-expansion-panel
                        v-for="item in items" 
                        :key="item.title"
                        class="bg-transparent font-weight-bold text-default px-2 pb-3"
                        :title="item.title"
                    >
                        <template v-slot:text>
                            <v-btn
                                v-for="subItem in item.items" 
                                :key="subItem.title"
                                @click="!loading && goTo(subItem.route)" 
                                class="text-surface font-weight-bold text-center py-4 bg-transparent pointer"
                                :class="itemSelected === subItem.route || (subItem?.route.includes('pedido') && itemSelected?.includes('pedido')) ? 'selected' : ''"
                            >
                                <v-icon class="pb-2 mx-1" color="primary">{{ subItem.icon }}</v-icon>
                                    {{ subItem.title }}
                                <v-icon class="pb-2 mx-1" color="primary">{{ subItem.icon }}</v-icon>
                            </v-btn>
                        </template>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-navigation-drawer>

            <v-main class="h-100 px-5 bg-primary text-white">
                <NuxtPage />
            </v-main>
        </v-layout>
        <v-layout v-else>
            <NuxtPage />
        </v-layout>
    </v-card>
</template>
<script setup>
    import { tokenUser, tokenUserData } from '../services/tokenService';

    const showToastify = inject('showToastify');

    const loading = inject("loading");
    const route = useRoute()
    const drawer = ref(false);
    const items = ref([
        {
            title: 'Início',
            items: [
                {
                    title: 'Dashboard',
                    route: '/dashboard',
                    icon: 'mdi-finance',
                },
                {
                    title: 'Pedidos',
                    route: '/pedidos',
                    icon: 'mdi-currency-usd',
                },
                {
                    title: 'Relatórios',
                    route: '/relatorios',
                    icon: 'mdi-file-pdf-box',
                },
                {
                    title: 'Histórico',
                    route: '/historico',
                    icon: 'mdi-history',
                },
            ]
        },
        {
            title: "Produtos",
            items: [
                {
                    title: 'Materiais',
                    route: '/materiais',
                    icon: 'mdi-script',
                },
                {
                    title: 'Modelos',
                    route: '/modelos',
                    icon: 'mdi-shoe-heel',
                }
            ]
        },
        {
            title: "Gestão",
            items: [
                {
                    title: 'Clientes',
                    route: '/clientes',
                    icon: 'mdi-account-tie',
                },
                {
                    title: 'Funcionários',
                    route: '/funcionarios',
                    icon: 'mdi-account-group',
                }
            ]
        },
    ]);
    const itemSelected = ref(null);
    const mounted = ref(false);
    const menu = ref(false);
    const dadosUser = ref(false);
    const backgroundImage = ref('/images/account.png');

    const goTo = (route) => {
        drawer.value = false;
        itemSelected.value = route;
        
        if(route === '/login') {
            sessionStorage.removeItem('token');
        }

        navigateTo(route);
    };

    const showToast = (message) => {
        showToastify(message, 'info');
    };

    const setDadosUser = () => {
        const dados = tokenUserData();
        
        if(dados) {
            dadosUser.value = dados;
            backgroundImage.value = dadosUser.value.photo;
        } else {
            dadosUser.value = false;
        } 
    }

    watch(() => route.fullPath, (nv) => {
        itemSelected.value = route.fullPath;
        setDadosUser();
    });

    onMounted(() => {
        itemSelected.value = route.fullPath;
        mounted.value = true;
        setDadosUser();
    });
</script>
<style scoped>
    .h-100 {
        min-height: 100dvh !important;
    }

    .leao {
        height: 50px;
    }

    .logoEscrito {
        height: 60px;
    }

    .selected {
        color: #fff !important;
    }

    .text-default {
        color: #C0812D !important;
    }
</style>