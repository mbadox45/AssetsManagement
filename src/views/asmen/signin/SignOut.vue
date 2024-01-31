<script setup>
import { onMounted, ref } from 'vue';

onMounted(() => {
    load();
});
const load = () => {
    localStorage.removeItem('usertoken');
    localStorage.removeItem('payload');
    localStorage.removeItem('roles');
    // router.push('/auth/login')
    window.close();

}
</script>

<template>
    <h1>Sign Out</h1>
</template>

<style lang="scss" scoped></style>
