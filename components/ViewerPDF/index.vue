<template>
    <v-row class="justify-center" v-if="isClient">
        <v-col cols="12" class="mt-4 text-center">
            <v-btn @click="downloadPDF" color="success" rounded="xl" class="mx-2" variant="flat">
                Baixar
            </v-btn>
        </v-col>
        <v-col cols="11" md="6" class="px-auto">
            <VuePdf 
                v-for="page in numOfPages" 
                :key="page" 
                :src="pdfSrc" 
                :page="page" 
            />
        </v-col>
    </v-row>
</template>
<script setup>
    const { VuePdf, createLoadingTask } = await import('vue3-pdfjs/esm');
    const props = defineProps([ 'pdf', 'nomeFile']);

    const pdfSrc = ref(props.pdf);
    const numOfPages = ref(0);
    const isClient = ref(false);

    const downloadPDF = () => {
        const link = document.createElement('a');
        link.href = pdfSrc.value;
        link.download = `${props.nomeFile}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    onMounted(() => {
        isClient.value = true;
        const loadingTask = createLoadingTask(pdfSrc.value)
        loadingTask.promise.then((pdf) => {
            numOfPages.value = pdf.numPages
        });
    });
</script>
<style scoped>
</style>