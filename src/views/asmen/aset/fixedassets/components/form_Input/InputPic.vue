<script setup>
    import { onMounted, ref, defineProps } from 'vue';

    // Variable
    const props = defineProps({
        id_pic:{
            type:Number
        },
    });
    const id_pic = props.id_pic;

    // Data Table
    const list_pic = ref(null)

    const loadUser = async () => {
        try {
            // Load API
            const user = await UserService.getUsers();
            // Declare API
            const user_data = user.data.data;
            // Selection Data
            const listUser = [];
            for (let i = 0; i < user_data.length; i++) {
                listUser[i] = {nama: user_data[i].name, id_pic: user_data[i].id}
            }
            list_pic.value = listUser;
        } catch (error) {
            list_pic.value = [];
            console.error('Error fetching data:', error);
        }
    }

    loadUser();
    
</script>

<template>
    <Dropdown v-model="id_pic" :options="list_pic" filter optionLabel="nama" optionValue="id_pic" placeholder="Select a PIC"></Dropdown>
</template>