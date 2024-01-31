<script setup>
    import { onMounted, ref, defineProps } from 'vue';

    // Variable
    const props = defineProps({
        id_departemen:{
            type:Number
        },
    });
    const id_departemen = props.id_departemen;
    const roles = ref(localStorage.getItem('roles'));

    // Data Table
    const list_departemen = ref(null)

    const loadDept = async () => {
        try {
            // Load API
            const dept = await UserService.getDept();
            // Declare API
            const dept_data = dept.data.data;
            // Selection Data
            const listDept = [];
            for (let i = 0; i < dept_data.length; i++) {
                listDept[i] = {nama: dept_data[i].department, id_departemen: dept_data[i].id}
            }
            list_departemen.value = listDept;
            console.log(dept)
        } catch (error) {
            list_departemen.value = [];
            console.error('Error fetching data:', error);
        }
    }

    loadDept();
    
</script>

<template>
    <Dropdown v-model="id_departemen" :options="list_departemen" filter optionLabel="nama" optionValue="id_departemen" placeholder="Select a Departemen"></Dropdown>
</template>