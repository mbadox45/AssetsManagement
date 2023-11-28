<script setup>
    import { onMounted, ref, defineProps } from 'vue';
    import { month, formFairValue } from '@/api/DataVariable';
    import moment from 'moment';

    // API
    import BastService from '@/api/BastService';
    
    // Variable
    const props = defineProps({
        nomor_dialog:{
            type:String
        },
        status_dialog:{
            type:String
        },
        data_dialog:{
            type:Array
        },
        in_props: String, // Change the type to match your prop type
    });
    const status = props.status_dialog;
    const datas = props.data_dialog;
    const expandedRows = ref([]);
    const roles = ref(localStorage.getItem('roles'));

    const emit = defineEmits(['submit'])

    // Data Table
    const list_data = ref(null)

    const loadData = async() => {
        console.log(datas);
        // console.log(status);
    }

    loadData();

    const approveBAST = async (ket) => {
        try {
            if (ket == 'approve') {
                if (status == 'approve_dept') {
                    const response = await BastService.getApproveCheck(datas.bast.id)
                    const data = response.data;
                    if (data.code == 200) {
                        emit('submit', ket)
                    } else {
                        emit('submit', 'error')
                    }
                } else {
                    const response = await BastService.getApproveAccept(datas.bast.id)
                    const data = response.data;
                    if (data.code == 200) {
                        emit('submit', ket)
                    } else {
                        emit('submit', 'error')
                    }
                }
            } else {
                emit('submit', ket)
            }
        } catch (error) {
            emit('submit', 'error')
        }
    }

</script>

<template>
    <div class="grid">
        <div class="col-12 text-center">
            <h5 class="text-1xl mb-4 font-normal">Do you want to approve this BAST for {{datas.assetUserName || 'Me'}}?</h5>
        </div>
        <div class="col-6">
            <Button label="Cancel" size="small" icon="pi pi-times" severity="secondary" @click="approveBAST('cancel')"/>
        </div>
        <div class="col-6 text-right">
            <Button label="Reject" size="small" icon="pi pi-trash" outlined severity="danger" @click="approveBAST('reject')"/>
            <Button label="Approve" size="small" icon="pi pi-check" outlined class="ml-2" severity="success" @click="approveBAST('approve')"/>
        </div>
    </div>
</template>