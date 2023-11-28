<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

// Components
import ApproveBast from './components/ApproveBast.vue';

// API
import BastService from '@/api/BastService';
import BastLayout from '@/api/BastLayout';
import {formAdjustment} from '@/api/DataVariable';


// Variable
const dialogs = ref(false)
const titledialogs = ref(null);
const datadialog = ref(null);
const forms = ref(formAdjustment);
const statusdialog = ref(null);
const listBast = ref([]);
const filters = ref();
const loadingTable = ref(null);
const selectedArea = ref();
const cm = ref();
const menuModel = ref(null);

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'BAST', to:'/serah-terima' }, { label: 'Submission', class:'font-bold', disabled:true  }]);

const toast = useToast();
const router = useRouter();

// Given accsess public funtion
onMounted(() => {
    loadAdjustment();
});

const onRowContextMenu = (event) => {
    cm.value.show(event.originalEvent);
    menuFunc();
};

const menuFunc = () => {
    if (selectedArea.value.status1 != 'Approved') {
        menuModel.value = [
            {label: 'BAST', icon: 'pi pi-fw pi-file', command: () => showDialog('approve_pic',selectedArea.value)},
        ];
    } else {
        menuModel.value = [
            {label: 'Download BAST', icon: 'pi pi-fw pi-download', command: () => showDialog('print',selectedArea.value)},
        ];
    }
}

// Load Data Adjustment
const loadAdjustment = async () => {
    loadingTable.value = 'Loading ...';
    try {
        const response = await BastService.getBastByPIC();
        const load = response.data;
        const data = load.data;
        if (data.length > 0) {
            loadingTable.value = null;
        } else {
            loadingTable.value = 'Data not found !';
        }
        const list = [];
        for (let i = 0; i < data.length; i++) {
            let status1 = 'Not Found';
            let status2 = 'Not Found';
            if (data[i].bast_fixed_assets != null) {
                const approve1 = data[i].bast_fixed_assets[(data[i].bast_fixed_assets.length) - 1].ttd_terima;
                if (approve1 == null) {
                    status1 = 'Not yet approved';
                } else {
                    status1 = 'Approved';
                }
                const approve2 = data[i].bast_fixed_assets[(data[i].bast_fixed_assets.length) - 1].ttd_checker;
                if (approve2 == null) {
                    status2 = 'Not yet approved';
                } else {
                    status2 = 'Approved';
                }
            }
            list[i] = {
                no : i+1,
                id : data[i].id,
                nomor : data[i].nomor,
                brand : data[i].brand,
                nama : data[i].nama,
                status1 : status1,
                status2 : status2,
                location : data[i].location.nama,
                bast_fixed_assets : data[i].bast_fixed_assets != null ? data[i].bast_fixed_assets[(data[i].bast_fixed_assets.length) - 1] : data[i].bast_fixed_assets,
            }
        }
        listBast.value = list;
    } catch (error) {
        loadingTable.value = 'Data not found !';
        listBast.value = [];
    }
}

// Filter Table
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};

// Menampilkan Dialog Form
const showDialog = async (status, item) => {
    if (status == 'approve_pic') {
        dialogs.value = true;
        statusdialog.value = status;
        titledialogs.value = `APPROVE BAST <i class="pi pi-angle-double-right mx-2"></i> ${item.nomor}`;
        datadialog.value = {bast: item.bast_fixed_assets};
    } else {
        await BastLayout.printDocument()
        // router.push(`/bast/${item.id}`)
    }
}

// Aksi Add & Update dari form Dialog
const postDialog = (status) => {
    // console.log(forms.value)
    if (status == 'approve') {
        toast.add({ severity: 'success', summary: 'Successfully', detail: `Data approved successfully`, life: 3000 });
        dialogs.value = false;
    } else if (status == 'warn') {
        toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
        dialogs.value = false;
    } else if (status == 'danger') {
        toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        dialogs.value = false;
    } else {
        dialogs.value = false;
    }
    
}

</script>

<template>
    <div class="grid">
        <Toast/>
        <Dialog v-model:visible="dialogs" :style="{ width: '700px' }" :modal="true">
            <template #header>
                <h4 v-html="titledialogs" class="font-normal"></h4>
            </template>
            <approve-bast :status_dialog="statusdialog" :data_dialog="datadialog" @submit="postDialog" />
        </Dialog>
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid">
                    <div class="col-12 md:col-6 sm:col-6">
                        <h5>MY ASSET</h5>
                    </div>
                </div>
                <!-- Datatable -->
                <div class="grid">
                    <div class="col-12">
                        <h5 class="text-center font-normal" v-show="loadingTable !== null">{{ loadingTable }}</h5>
                        <ContextMenu ref="cm" :model="menuModel"/>
                        <DataTable v-model:filters="filters" :value="listBast" paginator showGridlines :rows="10" dataKey="id" contextMenu v-model:contextMenuSelection="selectedArea" @rowContextmenu="onRowContextMenu"
                            filterDisplay="menu" :loading="loading" :globalFilterFields="['kode_loss', 'nama_loss', 'kode_margin', 'nama_margin']" v-show="loadingTable === null">
                            <template #header>
                                <div class="flex justify-content-between align-items-center">
                                    <!-- <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" /> -->
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                                    </span>
                                    <span class="font-normal text-sm"><span class="text-red-500 font-semibold">*</span> Silahkan klik kanan untuk mendapatkan aksi disetiap row tabel.</span>
                                </div>
                            </template>
                            <template #empty> No customers found. </template>
                            <template #loading> Loading customers data. Please wait. </template>
                            <Column field="nomor" header="Number" style="min-width: 12rem">
                                <template #body="{ data }">
                                    <strong>{{ data.nomor }}</strong>
                                </template>
                            </Column>
                            <Column field="brand" header="Brand" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.brand }}
                                </template>
                            </Column>
                            <Column field="nama" header="Tools Name" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.nama }}
                                </template>
                            </Column>
                            <Column field="location" header="Location" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.location }}
                                </template>
                            </Column>
                            <Column field="status1" header="Sign PIC" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.status1 }}
                                </template>
                            </Column>
                            <Column field="status2" header="Sign Dept" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.status2 }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>