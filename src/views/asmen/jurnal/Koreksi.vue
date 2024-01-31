<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import moment from 'moment';

// API
import JournalService from '@/api/JournalService';


// Variable
// Fair Value
const listFairValue = ref([]);
const filters = ref();
const loadingTable = ref(null);
const tanggalFairValue = ref(moment(new Date()).format('YYYY-MM-DD'));

// Value In Use
const listValueInUse = ref([]);
const filtersValueInUse = ref();
const loadingTableValueInUse = ref(null);
const tanggalValueInUse = ref(moment(new Date()).format('YYYY-MM-DD'));

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Journal', to:'/koreksi' }, { label: 'Correction', class:'font-bold', disabled:true  }]);

// Given accsess public funtion
onMounted(() => {
    loadKoreksi();
});

// Load Data Koreksi
const loadKoreksi = async () => {
    loadFairValue();
    loadValueInUse();
}
const loadFairValue = async () => {
    loadingTable.value = 'Loading ....'
    try {
        const response = await JournalService.getFairValue({tanggal: tanggalFairValue.value});
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
                id: data[i].id,
                formated_kode_aktiva: data[i].formated_kode_aktiva,
                formated_kode_penyusutan: data[i].formated_kode_penyusutan,
                grup: data[i].grup,
                subgrup: data[i].subgrup,
                nama_aset: data[i].nama_aset,
                bookValue: data[i].bookValue.toString(),
                latest_fair_values_nilai: data[i].latest_fair_values_nilai.toString(),
                difference: data[i].difference.toString(),
                comparison_result: data[i].comparison_result,
            }
        }
        listFairValue.value = list;
        console.log(list)
    } catch (error) {
        loadingTable.value = 'Data not found !';
        listFairValue.value = [];
    }
}
const loadValueInUse = async () => {
    loadingTableValueInUse.value = 'Loading ....'
    try {
        const response = await JournalService.getValueInUse({tanggal: tanggalFairValue.value});
        const load = response.data;
        const data = load.data;
        if (data.length > 0) {
            loadingTableValueInUse.value = null;
        } else {
            loadingTableValueInUse.value = 'Data not found !';
        }

        const list = [];
        for (let i = 0; i < data.length; i++) {
            list[i] = {
                no : i+1,
                id: data[i].id,
                formated_kode_aktiva: data[i].formated_kode_aktiva,
                formated_kode_penyusutan: data[i].formated_kode_penyusutan,
                grup: data[i].grup,
                subgrup: data[i].subgrup,
                nama_aset: data[i].nama_aset,
                bookValue: data[i].bookValue,
                latest_value_in_use: data[i].latest_value_in_use,
                difference: data[i].difference,
                comparison_result: data[i].comparison_result,
                debet: data[i].debet,
                kredit: data[i].kredit,
                info: data[i].info,
            }
        }
        listValueInUse.value = list;
    } catch (error) {
        loadingTableValueInUse.value = 'Data not found !';
        listValueInUse.value = [];
    }
}

// Filter Table
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nama_aset: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        grup: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        subgrup: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        bookValue: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        nilai_perolehan: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        latest_value_in_use: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        formated_kode_aktiva: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        formated_kode_penyusutan: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        difference: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        comparison_result: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    };
    filtersValueInUse.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nama_aset: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        grup: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        subgrup: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        bookValue: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        nilai_perolehan: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        latest_value_in_use: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        formated_kode_aktiva: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        formated_kode_penyusutan: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        difference: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        comparison_result: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        debet: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        kredit: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        info: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
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
                        <h5>Data Nilai Koreksi</h5>
                    </div>
                </div>
                <!-- Datatable -->
                <div class="grid">
                    <div class="col-12">
                        <TabView>
                            <TabPanel header="Fair Value">
                                <h5 class="font-normal"><span class="font-bold mr-2">#</span> Fair Value</h5>
                                <div class="p-inputgroup flex-1 mb-2">
                                    <span class="p-inputgroup-addon bg-cyan-600 text-white">Tanggal Asset</span>
                                    <InputText v-model="tanggalFairValue" type="date" placeholder="Tanggal"/>
                                </div>
                                <h5 class="text-center font-normal" v-show="loadingTable !== null">{{ loadingTable }}</h5>
                                <DataTable v-show="loadingTable === null" v-model:filters="filters" :value="listFairValue" paginator showGridlines :rows="10" dataKey="id"
                                    filterDisplay="menu" :loading="loading" scrollable :globalFilterFields="['formated_kode_aktiva', 'formated_kode_penyusutan', 'nama_aset']">
                                    <template #header>
                                        <div class="flex justify-content-between">
                                            <download-excel :data="listFairValue" class="py-3 px-2 cursor-pointer font-semibold text-sm text-green-700 hover:text-green-500 " worksheet = "Correction" :name="`Fair Value ${moment().format('YYYY-MM-DD')}.xls`" @change="loadFairValue"><i class="pi pi-download"></i> Export to Excel</download-excel>
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
                                    <Column field="nama_aset" header="Asset Name" sortable style="min-width: 12rem">
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
                                    <Column field="bookValue" header="Book Value" style="min-width: 12rem">
                                        <template #body="{ data }">
                                            {{ formatCurrency(Number(data.bookValue)) }}
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                        </template>
                                    </Column>
                                    <Column field="latest_fair_values_nilai" header="Latest Fair Value" style="min-width: 12rem">
                                        <template #body="{ data }">
                                            {{ formatCurrency(Number(data.latest_fair_values_nilai)) }}
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                        </template>
                                    </Column>
                                    <Column field="difference" header="Different" style="min-width: 12rem">
                                        <template #body="{ data }">
                                            {{ formatCurrency(Number(data.difference)) }}
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                        </template>
                                    </Column>
                                    <Column field="comparison_result" header="Comparison Result" style="min-width: 12rem">
                                        <template #body="{ data }">
                                            {{ data.comparison_result }}
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                        </template>
                                    </Column>
                                </DataTable>
                            </TabPanel>
                            <TabPanel header="Value In Use">
                                <h5 class="font-normal"><span class="font-bold mr-2">#</span> Value In Use</h5>
                                <div class="p-inputgroup flex-1 mb-2">
                                    <span class="p-inputgroup-addon bg-cyan-600 text-white">Tanggal Asset</span>
                                    <InputText v-model="tanggalValueInUse" type="date" placeholder="Tanggal"/>
                                </div>
                                <h5 class="text-center font-normal" v-show="loadingTableValueInUse !== null">{{ loadingTableValueInUse }}</h5>
                                <DataTable v-show="loadingTableValueInUse === null" v-model:filters="filtersValueInUse" :value="listValueInUse" paginator showGridlines :rows="10" dataKey="id"
                                    filterDisplay="menu" :loading="loading" scrollable :globalFilterFields="['formated_kode_aktiva', 'formated_kode_penyusutan', 'nama_aset']">
                                    <template #header>
                                        <div class="flex justify-content-between">
                                            <download-excel :data="listValueInUse" class="py-3 px-2 cursor-pointer font-semibold text-sm text-green-700 hover:text-green-500 " worksheet = "Correction" :name="`Value In Use ${moment().format('YYYY-MM-DD')}.xls`" @change="loadValueInUse"><i class="pi pi-download"></i> Export to Excel</download-excel>
                                            <span class="p-input-icon-left">
                                                <i class="pi pi-search" />
                                                <InputText v-model="filtersValueInUse['global'].value" placeholder="Keyword Search" />
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
                                    <Column field="nama_aset" header="Asset Name" sortable style="min-width: 12rem">
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
                                    <Column field="bookValue" header="Book Value" style="min-width: 12rem">
                                        <template #body="{ data }">
                                            {{ formatCurrency(Number(data.bookValue)) }}
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                        </template>
                                    </Column>
                                    <Column field="latest_value_in_use" header="Latest Value In Use" style="min-width: 12rem">
                                        <template #body="{ data }">
                                            {{ formatCurrency(Number(data.latest_value_in_use)) }}
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                        </template>
                                    </Column>
                                    <Column field="difference" header="Different" style="min-width: 12rem">
                                        <template #body="{ data }">
                                            {{ formatCurrency(Number(data.difference)) }}
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                        </template>
                                    </Column>
                                    <Column field="comparison_result" header="Comparison Result" style="min-width: 12rem">
                                        <template #body="{ data }">
                                            {{ data.comparison_result }}
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                        </template>
                                    </Column>
                                    <Column field="debet" header="Debet" style="min-width: 12rem">
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
                                    <Column field="info" header="Info" style="min-width: 12rem">
                                        <template #body="{ data }">
                                            {{ data.info }}
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search" />
                                        </template>
                                    </Column>
                                </DataTable>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>