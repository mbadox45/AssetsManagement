<script setup>
import { onMounted, ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

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
        model.value = [
            {
                label: 'Menu',
                items: [
                    { label: 'Beranda', icon: 'pi pi-fw pi-home', to: '/beranda' },
                    { label: 'Survey', icon: 'pi pi-fw pi-comments', to: '/survey-user' },
                ]
            },
            {
                label: 'Profile',
                items: [
                    { label: 'Update Password', icon: 'pi pi-fw pi-lock', to: '/update-password' },
                ]
            },
        ];
    } else if (roles == '1') {
        model.value = [
            {
                label: 'Home',
                items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
            },
            {
                label: 'BAST',
                items: [
                    { label: 'Submission', icon: 'pi pi-fw pi-verified', to: '/serah-terima', },
                ]
            },
        ];
    } else if (roles == '8') {
        model.value = [
            {
                label: 'Home',
                items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
            },
            {
                label: 'Master',
                items: [
                    { label: 'Area', icon: 'pi pi-fw pi-map-marker', to: '/area', },
                    { label: 'Group', icon: 'pi pi-fw pi-sitemap', to: '/group',},
                ]
            },
            {
                label: 'Asset',
                items: [
                    { label: 'Fixed Assets', icon: 'pi pi-fw pi-check-circle', to: '/fix-asset',},
                ]
            },
        ];
    } else {
        model.value = [
            {
                label: 'Home',
                items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
            },
            
            {
                label: 'Master',
                items: [
                    { label: 'Adjustment', icon: 'pi pi-fw pi-cog', to: '/adjustment', },
                    { label: 'Area', icon: 'pi pi-fw pi-map-marker', to: '/area', },
                    { label: 'Supplier', icon: 'pi pi-fw pi-box', to: '/supplier',},
                    { label: 'MIS', icon: 'pi pi-fw pi-shield', to: '/mis',},
                    { label: 'Group', icon: 'pi pi-fw pi-sitemap', to: '/group',},
                ]
            },
            {
                label: 'Asset',
                items: [
                    { label: 'Fixed Assets', icon: 'pi pi-fw pi-check-circle', to: '/fix-asset',},
                ]
            },
            {
                label: 'Journal',
                items: [
                    { label: 'Asset Recognition', icon: 'pi pi-fw pi-star', to: '/pengakuan',},
                    { label: 'Asset Depreciation', icon: 'pi pi-fw pi-sun', to: '/depresiasi',},
                    { label: 'Correction', icon: 'pi pi-fw pi-bookmark', to: '/koreksi',},
                ]
            },
        ]
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
