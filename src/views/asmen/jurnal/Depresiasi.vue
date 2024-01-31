<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import moment from 'moment';

// API
import JournalService from '@/api/JournalService';


// Variable
const listDepresiasi = ref([]);
const filters = ref();
const loadingTable = ref(null);

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Journal', to:'/depresiasi' }, { label: 'Asset Depreciation', class:'font-bold', disabled:true  }]);

// Given accsess public funtion
onMounted(() => {
    loadDepresiasi();
});

// Load Data Pengakuan
const loadDepresiasi = async () => {
    loadingTable.value = 'Loading ....'
    try {
        const response = await JournalService.getDepresiasi();
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
                nama_aset: data[i].nama_aset,
                grup: data[i].grup,
                subgrup: data[i].subgrup,
                tgl_perolehan: data[i].tgl_perolehan,
                nilai_perolehan: data[i].nilai_perolehan,
                masa_manfaat: data[i].masa_manfaat,
                formated_kode_aktiva: data[i].formated_kode_aktiva,
                formated_kode_penyusutan: data[i].formated_kode_penyusutan,
                monthlyDepreciation: data[i].monthlyDepreciation,
            }
        }
        listDepresiasi.value = list;
    } catch (error) {
        loadingTable.value = 'Data not found !';
        listDepresiasi.value = [];
    }
}

// Filter Table
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nama_aset: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        grup: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        subgrup: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        tgl_perolehan: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        nilai_perolehan: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        masa_manfaat: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        formated_kode_aktiva: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        formated_kode_penyusutan: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        monthlyDepreciation: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    };
};

initFilters();

// Format Curency
const formatCurrency = (value) => {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
};

</script>

<template>
    <div class="grid">
        <Toast/>
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid">
                    <div class="col-12 md:col-6 sm:col-6">
                        <h5>Data Depresiasi Aset</h5>
                    </div>
                </div>
                <!-- Datatable -->
                <div class="grid">
                    <div class="col-12">
                        <h5 class="text-center font-normal" v-show="loadingTable !== null">{{ loadingTable }}</h5>
                        <DataTable v-show="loadingTable === null" v-model:filters="filters" :value="listDepresiasi" paginator showGridlines :rows="10" dataKey="id"
                            filterDisplay="menu" :loading="loading" scrollable :globalFilterFields="['formated_kode_aktiva', 'formated_kode_penyusutan', 'nama_aset']">
                            <template #header>
                                <div class="flex justify-content-between">
                                    <download-excel :data="listDepresiasi" class="py-3 px-2 cursor-pointer font-semibold text-sm text-green-700 hover:text-green-500 " worksheet = "Depresiasi Asset" :name="`Depresiasi Asset ${moment().format('YYYY-MM-DD')}.xls`"><i class="pi pi-download"></i> Export to Excel</download-excel>
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                                    </span>
                                </div>
                            </template>
                            <template #empty> No customers found. </template>
                            <template #loading> Loading customers data. Please wait. </template>
                            <Column field="no" header="No" sortable frozen style="min-width: 8rem" exportHeader="No">
                                <template #body="{ data }">
                                    {{ data.no }}
                                </template>
                            </Column>
                            <Column field="formated_kode_aktiva" header="Kode Aktiva" sortable style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.formated_kode_aktiva }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                </template>
                            </Column>
                            <Column field="formated_kode_penyusutan" header="Kode Penyusutan" sortable style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.formated_kode_penyusutan }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                </template>
                            </Column>
                            <Column field="nama_aset" header="Nama Asset" sortable style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.nama_aset }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                </template>
                            </Column>
                            <Column field="grup" header="Group" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.grup }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                </template>
                            </Column>
                            <Column field="subgrup" header="Sub Group" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.subgrup }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                </template>
                            </Column>
                            <Column field="tgl_perolehan" header="Tgl Perolehan" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ moment(data.tgl_perolehan).format('DD MMM YYYY') }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                </template>
                            </Column>
                            <Column field="nilai_perolehan" header="Nilai Perolehan" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ formatCurrency(Number(data.nilai_perolehan)) }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                </template>
                            </Column>
                            <Column field="masa_manfaat" header="Masa Manfaat" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.masa_manfaat }} Bulan
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                </template>
                            </Column>
                            <Column field="monthlyDepreciation" header="Depresiasi Per Bulan" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ formatCurrency(Number(data.monthlyDepreciation)) }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>