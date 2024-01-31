<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import moment from 'moment';

// API
import JournalService from '@/api/JournalService';


// Variable
const listPengakuan = ref([]);
const filters = ref();
const loadingTable = ref(null);

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Journal', to:'/pengakuan' }, { label: 'Asset Recognition', class:'font-bold', disabled:true  }]);

// Given accsess public funtion
onMounted(() => {
    loadPengakuan();
});

// Load Data Pengakuan
const loadPengakuan = async () => {
    loadingTable.value = 'Loading ....'
    try {
        const response = await JournalService.getPengakuan();
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
                debet : data[i].debet,
                kredit : data[i].kredit,
                grup : data[i].grup,
                sub_grup : data[i].sub_grup,
                tgl_perolehan : data[i].tgl_perolehan,
                nilai_perolehan : data[i].nilai_perolehan,
                masa_manfaat : data[i].masa_manfaat,
                formated_kode_aktiva : data[i].formated_kode_aktiva,
                formated_kode_penyusutan : data[i].formated_kode_penyusutan,
                supplier_code : data[i].supplier_code,
            }
        }
        listPengakuan.value = list;
    } catch (error) {
        loadingTable.value = 'Data not found !';
        listPengakuan.value = [];
    }
}

// Filter Table
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        debet: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        kredit: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        grup: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        sub_grup: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        tgl_perolehan: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        nilai_perolehan: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        masa_manfaat: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        formated_kode_aktiva: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        formated_kode_penyusutan: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        supplier_code: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
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
                        <h5>Data Pengakuan Aset</h5>
                    </div>
                </div>
                <!-- Datatable -->
                <div class="grid">
                    <div class="col-12">
                        <h5 class="text-center font-normal" v-show="loadingTable !== null">{{ loadingTable }}</h5>
                        <DataTable v-show="loadingTable === null" v-model:filters="filters" :value="listPengakuan" paginator showGridlines :rows="10" dataKey="id"
                            filterDisplay="menu" :loading="loading" scrollable :globalFilterFields="['formated_kode_aktiva', 'formated_kode_penyusutan', 'debet', 'kredit']">
                            <template #header>
                                <div class="flex justify-content-between">
                                    <download-excel :data="listPengakuan" class="py-3 px-2 cursor-pointer font-semibold text-sm text-green-700 hover:text-green-500 " worksheet = "Pengakuan Asset" :name="`Pengakuan Asset ${moment().format('YYYY-MM-DD')}.xls`"><i class="pi pi-download"></i> Export to Excel</download-excel>
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                                    </span>
                                </div>
                            </template>
                            <template #empty> No customers found. </template>
                            <template #loading> Loading customers data. Please wait. </template>
                            <Column field="no" header="No" sortable frozen style="min-width: 12rem" exportHeader="No">
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
                            <Column field="debet" header="Debet" sortable style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.debet }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                </template>
                            </Column>
                            <Column field="kredit" header="Kredit" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.kredit }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                </template>
                            </Column>
                            <Column field="supplier_code" header="Kode Supplier" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.supplier_code }}
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
                            <Column field="sub_grup" header="Sub Group" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.sub_grup }}
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
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>