<template>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

onBeforeMount(() => {
  router.replace('/login');
});
</script>