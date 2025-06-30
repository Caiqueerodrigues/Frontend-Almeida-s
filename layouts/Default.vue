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
                        <v-col cols="1" md="0"></v-col>
                    </v-row>
                </v-toolbar-title>
            </v-app-bar>

            <v-navigation-drawer
                v-model="drawer"
                class="bg-black"
                temporary
            >
                <p class="font-weight-bold ml-2 text-center text-secondary my-4">Bem vindo(a) {{ tokenUser() }}</p>
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
    import { tokenUser } from '../services/tokenService';

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
        // {
        //     title: 'Sair',
        //     route: '/login',
        //     icon: 'mdi-power',
        // },
    ]);
    const itemSelected = ref(null);
    const mounted = ref(false);

    const goTo = (route) => {
        drawer.value = !drawer.value;
        itemSelected.value = route;
        
        if(route === '/login') {
            sessionStorage.removeItem('token');
        }

        navigateTo(route);
    };

    watch(() => route.fullPath, (nv) => {
        itemSelected.value = route.fullPath;
    });

    onMounted(() => {
        itemSelected.value = route.fullPath;
        mounted.value = true;
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