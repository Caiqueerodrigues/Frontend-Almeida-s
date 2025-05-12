<template>
    <v-row class="justify-center" v-if="isClient">
        <v-col cols="5" md="6" class="mt-4 text-center">
            <v-btn @click="downloadPDF" color="success" rounded="xl" class="mx-2" variant="flat">
                Baixar
            </v-btn>
        </v-col>
        <v-col cols="5" md="6" class="mt-4 text-start">
            <v-btn @click="shareFile" color="success" rounded="xl" class="mx-2" variant="flat">
                Compartilhar
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
    const showToastify = inject('showToastify');

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

    const shareFile = async () => {
        try {
            // 1. Baixar o arquivo PDF
            const response = await fetch(pdfSrc.value);
            const pdfBlob = await response.blob();
            
            // 2. Criar um arquivo para compartilhamento
            const file = new File([pdfBlob], `${props.nomeFile}.pdf`, { 
                type: 'application/pdf' 
            });
            
            // 3. Verificar se a API de compartilhamento suporta arquivos
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `Compartilhar ${props.nomeFile}`,
                    text: 'Aqui está o arquivo PDF que você pediu!'
                });
            } else {
                // Fallback para dispositivos que não suportam compartilhamento de arquivos
                if (navigator.share) {
                    // Compartilhar apenas texto/URL
                    await navigator.share({
                        title: `Compartilhar ${props.nomeFile}`,
                        text: 'Veja este arquivo PDF',
                        url: pdfSrc.value
                    });
                } else {
                    showToastify('Compartilhamento não suportado neste navegador. Use o botão de download.', 'info');
                }
            }
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
            if (error.name !== 'AbortError') {
                alert('Não foi possível compartilhar o arquivo. Use o botão de download.');
            }
        }
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