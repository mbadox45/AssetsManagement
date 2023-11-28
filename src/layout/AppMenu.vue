<script setup>
import { onMounted, ref } from 'vue';

// Components
import AppMenuItem from './AppMenuItem.vue';

// API & DATAVARIABLE
import {menu_role_distributor, menu_role_under_8, menu_role_min_8, menu_role_min_9} from '@/api/MenuService';

const payload = ref(JSON.parse(localStorage.getItem('payload')));
const token = localStorage.getItem('usertoken');
const roles = localStorage.getItem('roles');

const model = ref([]);

onMounted(() => {
    token;
    load();
    Menu();
});

const Menu = () => {
    // console.log(roles)
    if (roles == 'distributor') {
        model.value = menu_role_distributor;
    } else if (roles == '1') {
        model.value = menu_role_under_8;
    } else if (roles == '8') {
        model.value = menu_role_min_8;
    } else {
        model.value = menu_role_min_9;
    }
}

const load = () => {
    // console.log(token.value)
}
</script>

<template>
    <ul class="layout-menu">
        <li class="mb-3 text-center">
            <img src="/layout/inl.png" alt="Prime Blocks" class="w-6 mt-3" />
        </li>
        <li class="text-center">
            <strong>{{ payload.name }}</strong>
        </li>
        <li class="text-center mb-5">
            <span>{{ payload.email }}</span>
        </li>
        <Divider class="my-5" />
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
