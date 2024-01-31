<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';


// API
import StockPickingService from '@/api/StockPickingService';
import { formSupplier } from '@/api/DataVariable';


// Variable
const dialogs = ref(false)
const titledialogs = ref(null);
const forms = ref(formSupplier);
const statusdialog = ref(null);
const listSupplier = ref([]);
const filters = ref();
const loadingTable = ref(null);
const selectedArea = ref();
const cm = ref();
const menuModel = ref([
    {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => showDialog('edit',selectedArea.value)},
]);

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Master', to:'/supplier' }, { label: 'Supplier', class:'font-bold', disabled:true  }]);

const toast = useToast();

// Given accsess public funtion
onMounted(() => {
    loadSupplier();
});

const onRowContextMenu = (event) => {
    cm.value.show(event.originalEvent);
};

// Load Data Supplier
const loadSupplier = async () => {
    loadingTable.value = 'Loading ...';
    try {
        const response = await StockPickingService.getMis();
        const load = response.data;
        const data = load.data;
        if (data.length > 0) {
            loadingTable.value = null;
        } else {
            loadingTable.value = 'Data not found !';
        }
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list[i] = {
                no : i+1,
                id : data[i].id,
                name : data[i].name,
                section : data[i].section,
                etc : data[i].required_for,
            }
        }
        listSupplier.value = list;
    } catch (error) {
        loadingTable.value = 'Data not found !';
        listSupplier.value = [];
    }
}

// Filter Table
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        section: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        etc: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};


// Reset Variable Form
const resetForm = () => {
    forms.value = {
        id: 0,
        nama: '',
        kode: '',
        keterangan: '',
    }
}

// Menampilkan Dialog Form
const showDialog = (status, item) => {
    dialogs.value = true;
    if (status == 'add') {
        titledialogs.value = 'Create Supplier';
        statusdialog.value = status
        resetForm()
    } else if (status == 'delete') {
        titledialogs.value = 'Delete Supplier';
        statusdialog.value = status
        forms.value = {
            id: item.id,
            nama: item.nama,
            kode: item.kode,
            keterangan: item.keterangan,
        };
    } else {
        titledialogs.value = 'Edit Supplier';
        statusdialog.value = status
        forms.value = {
            id: item.id,
            nama: item.nama,
            kode: item.kode,
            keterangan: item.keterangan,
        };
    }
}

</script>

<template>
    <div class="grid">
        <Toast/>
        <Dialog v-model:visible="dialogs" :style="{ width: '450px' }" :modal="true">
            <template #header>
                <h4>{{titledialogs}}</h4>
            </template>
            <div class="p-fluid formgrid grid" v-if="statusdialog != 'delete'">
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Nama Supplier</label>
                    <InputText type="text" placeholder="PT Maju Jaya Sempurna" v-model="forms.nama"/>
                </div>
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Kode</label>
                    <InputText type="text" placeholder="00x" v-model="forms.kode"/>
                </div>
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Keterangan</label>
                    <InputText type="text" placeholder="Keterangan" v-model="forms.keterangan"/>
                </div>
            </div>
            <div class="p-fluid grid" v-else>
                <div class="field col-12 md:col-12">
                    <span>Apakah anda ingin menghapus <strong>{{ forms.name }}</strong> ?</span>
                </div>
            </div>
            <template #footer>
                <Button v-show="statusdialog != 'delete'" label="No" icon="pi pi-times" @click="dialogs = false" class="p-button-outlined p-button-danger" />
                <Button label="Save" icon="pi pi-save" class="p-button-outlined p-button-success" autofocus/>
            </template>
        </Dialog>
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid">
                    <div class="col-6 md:col-6 sm:col-6">
                        <h5>List MIS</h5>
                    </div>
                    <div class="col-6 md:col-6 sm:col-6 text-right">
                        <!-- <Button severity="info" size="small" icon="pi pi-plus" outlined label="Add Supplier" @click="showDialog('add','')" /> -->
                    </div>
                </div>
                <!-- Datatable -->
                <div class="grid">
                    <div class="col-12">
                        <h5 class="text-center font-normal" v-show="loadingTable !== null">{{ loadingTable }}</h5>
                        <ContextMenu ref="cm" :model="menuModel"/>
                        <DataTable v-model:filters="filters" :value="listSupplier" paginator showGridlines :rows="10" dataKey="id" contextMenu v-model:contextMenuSelection="selectedArea" @rowContextmenu="onRowContextMenu"
                            filterDisplay="menu" :loading="loading" :globalFilterFields="['id', 'name', 'section', 'etc']" v-show="loadingTable === null">
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
                            <Column field="no" header="No" style="min-width: 2rem">
                                <template #body="{ data }">
                                    {{ data.no }}
                                </template>
                            </Column>
                            <Column field="name" header="ID" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.id }}
                                </template>
                            </Column>
                            <Column field="name" header="MIS" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.name }}
                                </template>
                            </Column>
                            <Column field="section" header="Section" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.section }}
                                </template>
                            </Column>
                            <Column field="etc" header="Etc" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.etc }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>