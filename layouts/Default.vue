<template>
    <v-card>
        <Loading v-if="loading || !mounted"/>
        <v-layout>
            <v-app-bar color="#000" class="pr-4">
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" :disabled="loading"></v-app-bar-nav-icon>

                <v-toolbar-title class="text-secondary ml-n2">
                    <v-row class="align-center justify-space-between">
                        <v-col cols="1" @click.stop="!loading ? drawer = !drawer : ''">
                            <img src="../assets/images/logo.png" alt="Logo da empresa" class="leao">
                        </v-col>
                        <v-col cols="9" class="d-flex justify-center pl-12">
                            <img src="../assets/images/logo_escrito.png" alt="Texto da logo da empresa" class="logoEscrito">
                        </v-col>
                        <v-col cols="1" md="0"></v-col>
                    </v-row>
                </v-toolbar-title>

                <!-- <template v-if="$vuetify.display.mdAndUp">
                <v-btn icon="mdi-magnify" variant="text"></v-btn>

                <v-btn icon="mdi-filter" variant="text"></v-btn>
                </template>

                <v-btn icon="mdi-dots-vertical" variant="text"></v-btn> -->
            </v-app-bar>

            <v-navigation-drawer
                v-model="drawer"
                class="bg-black"
                temporary
            >
            <v-list>
                <v-list-item 
                    v-for="item in items" 
                    :key="item.title"
                    class="pointer"
                >
                    <v-list-item-content>
                        <v-list-item-title 
                            @click="!loading && goTo(item.route)" 
                            class="text-surface font-weight-bold text-center py-4"             
                            :class="itemSelected === item.route ? 'selected' : ''"
                        >
                            <v-icon class="pb-2" color="primary">{{item.icon}}</v-icon>
                            {{ item.title }}
                            <v-icon class="pb-2" color="primary">{{item.icon}}</v-icon>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            </v-navigation-drawer>

            <v-main class="h-100 px-5 bg-primary text-white">
                <NuxtPage />
            </v-main>
        </v-layout>
    </v-card>
</template>
<script setup>
    const loading = inject("loading");
    const route = useRoute()
    const drawer = ref(false);
    const items = ref([
        {
            title: 'Clientes',
            route: '/clientes',
            icon: 'mdi-account-tie',
        },
        {
            title: 'Modelos',
            route: '/modelos',
            icon: 'mdi-shoe-heel',
        },
        {
            title: 'Materiais',
            route: '/materiais',
            icon: 'mdi-script',
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
    ]);
    const itemSelected = ref(null);
    const mounted = ref(false);

    const goTo = (route) => {
        drawer.value = !drawer.value;
        itemSelected.value = route;
        
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
</style>