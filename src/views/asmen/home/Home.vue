<script setup>
import { onMounted, ref } from 'vue';

// Given accsess public funtion
onMounted(() => {
    loadDepresiasi();
});

// Load Data Pengakuan
const loadDepresiasi = async () => {
    // console.log(localStorage.getItem('roles'))
}
</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12 text-center p-4">
            <img :src="'/layout/home2.jpg'" alt="Home Pages" class="my-4 md:my-3 w-30rem md:w-30rem" />
            <h1 class="text-2xl font-semibold">Selamat datang di website kami,</h1>
            <h1><span class="font-bold">Asset Management</span> <span class="font-normal">- PT. Industri Nabati Lestari</span></h1>
        </div>
    </div>
</template>