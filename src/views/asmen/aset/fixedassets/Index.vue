<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';


// API
import AssetsService from '@/api/AssetsService';
import { month, formFairValue } from '@/api/DataVariable';
import moment from 'moment';


// Variable
const dialogs = ref(false)
const titledialogs = ref(null);
const statusdialog = ref(null);
const statusAssetValue = ref(null);
const filters = ref();
const tanggal = ref(moment(new Date()).format('YYYY-MM-DD'));

// Main Table
const expandedRows = ref([]);
const expandedRows2 = ref([]);
const listGroup = ref([]);
const loadingTable = ref(null);

// Table Fair Value
const editingRowsFairValue = ref([]);
const listFairValue = ref([]);
const nilaiFV = ref(formFairValue);
const loadingTableFV = ref(null);

// Table Value In Use
const editingRowsValueInUse = ref([]);
const listValueInUse = ref([]);
const nilaiVIU = ref(null);
const loadingTableVIU = ref(null);

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Asset', to:'/fix-asset' }, { label: 'Fixed Assets', class:'font-bold', disabled:true  }]);

const toast = useToast();
const router = useRouter();

// Message
const messagesFV = ref([]);
let count = ref(0);
const addMessagesFV = (type, msg) => {
    messagesFV.value = [{ severity: type, content: msg, id: count.value++ },];
};

// Given access public funtion
onMounted(() => {
    loadAsset();
});

// Load Data Area
const loadAsset = async () => {
    loadingTable.value = 'Loading ....'
    try {
        const response = await AssetsService.getAssets({tanggal: tanggal.value});
        const load = response.data;
        const data = load.data;

        // Loading Checking
        if (data.length > 0) {
            loadingTable.value = null;
        } else {
            loadingTable.value = 'Data not found';
        }

        const list = [];
        for (let i = 0; i < data.length; i++) {
            // Convert Data Array calculateInitialBalance
            const convertedData = [];
            for (const year in data[i].calculateInitialBalance) {
                const yearData = data[i].calculateInitialBalance[year];
                const monthlyDepreciation = [];
                let index = 1;
                for (const month in yearData.monthlyDepreciation) {
                    monthlyDepreciation.push({
                        no: index++,
                        month: parseInt(month),
                        value: yearData.monthlyDepreciation[month],
                    });
                }

                convertedData.push({
                    year: parseInt(year),
                    initialBalanceThisYear: yearData.initialBalanceThisYear,
                    totalThisYear: yearData.totalThisYear,
                    totalAccumulationUntilThisYear: yearData.totalAccumulationUntilThisYear,
                    monthlyDepreciation: monthlyDepreciation,
                });
            }

            // console.log(convertedData)
            list[i] = {
                id:data[i].id,
                nama: data[i].nama,
                brand: data[i].brand,
                assetUserName: data[i].assetUserName,
                assetAge: data[i].assetAge,
                masa_manfaat: data[i].masa_manfaat,
                sisa_masa_manfaat: Number(data[i].masa_manfaat) - data[i].assetAge,
                nomor: data[i].nomor,
                spesifikasi: data[i].spesifikasi,
                tgl_perolehan: moment(data[i].tgl_perolehan).format('DD MMM YYYY'),
                endMasaManfaatDate: moment(data[i].endMasaManfaatDate).format('DD MMM YYYY'),
                accumulatedDepreciation: data[i].accumulatedDepreciation,
                bookValue: data[i].bookValue,
                nilai_perolehan: data[i].nilai_perolehan,
                nilai_depresiasi_awal: data[i].nilai_depresiasi_awal,
                monthlyDepreciation: data[i].monthlyDepreciation,
                annualDepreciation: data[i].annualDepreciation,
                accumulatedDepreciation: data[i].accumulatedDepreciation,
                location: data[i].location.nama,
                calculateInitialBalance: convertedData,
            };
        }
        // console.log(list)
        listGroup.value = list;
    } catch (error) {
        listGroup.value = [];
    }
}

// Filter Table
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nama: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        nomor: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        assetUserName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};

// Format Curency
const formatCurrency = (value) => {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
};

// Row Edit Fair Value
const onRowEditSaveFairValue = (event) => {
    let { newData, index } = event;

    listFairValue.value[index] = newData;
};

// Row Edit Value In Use
const onRowEditSaveValueInUse = (event) => {
    let { newData, index } = event;

    listValueInUse.value[index] = newData;
};

// route go to Form Asset
const editAssets = (cond ,id) => {
    if (cond == 'add') {
        router.push(`/form-asset/${cond}`);
    } else {
        router.push(`/form-asset/${cond}?id=${id}`);
    }
}

// Menampilkan Dialog Form
const showDialog = async (status, item) => {
    dialogs.value = true;
    statusdialog.value = status
    if (status == 'detail') {
        titledialogs.value = `DETAIL ASSET <i class="pi pi-angle-double-right mx-2"></i> ${item.nomor}`;
    } else if (status == 'value') {
        // Title Dialog
        titledialogs.value = `ASSET VALUE <i class="pi pi-angle-double-right mx-2"></i> ${item.nomor}`;

        // Data Fair Value
        const fairValue = await AssetsService.getFairValue(item.id);
        const dataFV = fairValue.data.data;
        const list = [];
        for (let i = 0; i < dataFV.length; i++) {
            let dis_trash = false;
            if (i === 0) {
                dis_trash = true
            }
            list[i] = {
                no: i+1,
                id: dataFV[i].id,
                id_asset: dataFV[i].id_fixed_asset,
                nilai: dataFV[i].nilai,
                disabled: dis_trash,
            }
        }
        listFairValue.value = list;

        // Data Value In Use
        const valueInUse = await AssetsService.getValueInUse(item.id);
        const dataVIU = valueInUse.data.data;
        const list2 = [];
        for (let i = 0; i < dataVIU.length; i++) {
            let dis_trash = false;
            if (i === 0) {
                dis_trash = true
            }
            list2[i] = {
                no: i+1,
                id: dataVIU[i].id,
                id_asset: dataFV[i].id_fixed_asset,
                nilai: dataVIU[i].nilai,
                disabled: dis_trash,
            }
        }
        listValueInUse.value = list2;
    } else {
        titledialogs.value = 'Edit Group';
        statusdialog.value = status
    }
}

const postTable = (status, item) => {
    console.log(status, item.id);
    statusAssetValue.value = status
    if (status === 'edit_fv') {
        nilaiFV.value.nilai = item.nilai;
        nilaiFV.value.id = item.id;
        nilaiFV.value.id_fixed_asset = item.id_fixed_asset;
        console.log(nilaiFV.value);
    } else if (status === 'save_fv') {
        AssetsService.updateFairValue().then(res => {
            const load = res.data;
            if (load.code == 200) {
                addMessagesFV('success','Data berhasil di update');
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            }
        }).catch(error => {
            console.error(error.response.status);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        })
        console.log(nilaiFV.value);
    } else {
        nilaiFV.value.nilai = null;
        nilaiFV.value.id = null;
    }
}


</script>

<template>
    <div class="grid">
        <Toast/>
        <Dialog v-model:visible="dialogs" :style="{ width: '1050px' }" :modal="true">
            <template #header>
                <h4 class="font-normal" v-html="titledialogs"></h4>
            </template>
            <div v-if="statusdialog == 'value'" class="grid p-fluid">
                <div class="col-12 md:col-6">
                    <h6 class="font-semibold">LIST FAIR VALUE</h6>
                    <!-- <Message severity="success">Data Berhasil di Update</Message> -->
                    <DataTable v-model:editingRows="editingRowsFairValue" showGridlines :value="listFairValue" editMode="row" dataKey="id"
                        @row-edit-save="onRowEditSaveFairValue" tableClass="editable-cells-table">
                        <Column field="no">
                            <template #header>
                                <span class="text-xs">No</span>
                            </template>
                            <template #body="{ data }">
                                <span class="text-sm">{{ data.no }}</span>
                            </template>
                        </Column>
                        <Column field="nilai">
                            <template #header>
                                <span class="text-xs">Nilai</span>
                            </template>
                            <template #body="{ data }">
                                <InputNumber v-model="nilaiFV.nilai" v-if="statusAssetValue == 'edit_fv' " :minFractionDigits="2" :maxFractionDigits="3" placeholder="0.00" />
                                <span class="text-sm" v-else>{{ formatCurrency(Number(data.nilai)) }}</span>
                            </template>
                        </Column>
                        <!-- <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column> -->
                        <Column style="width: 30%; min-width: 10%" bodyStyle="text-align:center">
                            <template #body="{ data }">
                                <div v-if="statusAssetValue != 'edit_fv' " class="flex justify-content-center flex-wrap">
                                    <Button icon="pi pi-pencil" severity="warning" class="mr-2" outlined @click="postTable('edit_fv',data)" size="small"/>
                                    <Button icon="pi pi-trash" severity="danger" outlined @click="postTable('hapus_fv',data)" size="small" :disabled="data.disabled"/>
                                </div>
                                <div v-else class="flex justify-content-center flex-wrap">
                                    <Button icon="pi pi-save" severity="success" class="mr-2" outlined @click="postTable('save_fv',data)" size="small"/>
                                    <Button icon="pi pi-times" severity="secondary" outlined @click="postTable('back_fv',data)" size="small"/>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
                <div class="col-12 md:col-6">
                    <h6 class="font-semibold">LIST VALUE IN USE</h6>
                    <DataTable v-model:editingRows="editingRowsValueInUse" :value="listValueInUse" editMode="row" dataKey="id"
                        @row-edit-save="onRowEditSaveValueInUse" tableClass="editable-cells-table">
                        <Column field="nilai">
                            <template #header>
                                <span class="text-xs">Nilai</span>
                            </template>
                            <template #body="{ data }">
                                <span class="text-sm">{{ formatCurrency(data.nilai) }}</span>
                            </template>
                            <template #editor="{ data, field }">
                                <InputText v-model="data[field]" />
                            </template>
                        </Column>
                        <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
                    </DataTable>
                </div>
            </div>
            <!-- Body -->
            <template #footer>
                <Button :label="statusdialog == 'edit' ? 'No':'Cancel'" icon="pi pi-times" @click="dialogs = false" class="p-button-outlined p-button-danger" />
                <Button v-show="statusdialog == 'edit'" label="Save" icon="pi pi-save" class="p-button-outlined p-button-success" autofocus />
            </template>
        </Dialog>
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid">
                    <div class="col-6 md:col-6 sm:col-6">
                        <h5>Fixed Assets</h5>
                    </div>
                    <div class="col-6 md:col-6 sm:col-6 text-right">
                        <Button severity="info" size="small" icon="pi pi-plus" outlined label="Add Asset" @click="editAssets('add','')" />
                    </div>
                    <div class="p-fluid col-12 md:col-12 sm:col-12">
                        <div class="p-inputgroup flex-1">
                            <span class="p-inputgroup-addon bg-cyan-600 text-white">Tanggal Asset</span>
                            <InputText v-model="tanggal" type="date" placeholder="Tanggal" @change="loadAsset()" />
                        </div>
                    </div>
                </div>
                <!-- Datatable -->
                <div class="grid">
                    <div class="col-12">
                        <h4 class="text-center font-normal" v-show="loadingTable !== null">{{ loadingTable }}</h4>
                        <DataTable v-show="loadingTable === null" v-model:filters="filters" v-model:expandedRows="expandedRows" :value="listGroup" scrollable showGridlines paginator :rows="10" dataKey="id"
                            filterDisplay="menu" :loading="loading" :globalFilterFields="['nama', 'nomor', 'assetUserName']" class="p-datatable-sm">
                            <template #empty> No assets found, please select a date. </template>
                            <template #loading> Loading areas data. Please wait. </template>
                            <!-- Headers Template -->
                            <template #header>
                                <div class="flex justify-content-between">
                                    <download-excel :data="listGroup" class="py-3 px-2 cursor-pointer font-semibold text-sm text-green-700 hover:text-green-500 " worksheet = "Depresiasi Asset" :name="`Depresiasi Asset ${moment().format('YYYY-MM-DD')}.xls`"><i class="pi pi-download mr-2"></i> Export to Excel</download-excel>
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                                    </span>
                                </div>
                            </template>
                            <!-- Headers Posisition -->
                            <ColumnGroup type="header">
                                <Row>
                                    <Column expander frozen style="width: 5rem" :rowspan="2" header="#"></Column>
                                    <Column field="nomor" frozen sortable :rowspan="2">
                                        <template #header>
                                            <span class="text-xs">Nomor</span>
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Nama Asset" />
                                        </template>
                                    </Column>
                                    <Column field="nama" :rowspan="2" style="min-width: 12rem" sortable>
                                        <template #header>
                                            <span class="text-xs">Nama Asset</span>
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Nama Asset" />
                                        </template>
                                    </Column>
                                    <Column field="brand" style="min-width: 12rem" :rowspan="2">
                                        <template #header>
                                            <span class="text-xs">Brand</span>
                                        </template>
                                    </Column>
                                    <Column field="assetUserName" style="min-width: 12rem" :rowspan="2">
                                        <template #header>
                                            <span class="text-xs">PIC</span>
                                        </template>
                                        <template #filter="{ filterModel }">
                                            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by PIC" />
                                        </template>
                                    </Column>
                                    <Column field="location" style="min-width: 12rem" :rowspan="2">
                                        <template #header>
                                            <span class="text-xs">Lokasi Asset</span>
                                        </template>
                                    </Column>
                                    <Column field="tgl_perolehan" style="min-width: 12rem" :rowspan="2">
                                        <template #header>
                                            <span class="text-xs">Tanggal Perolehan</span>
                                        </template>
                                    </Column>
                                    <Column field="endMasaManfaatDate" style="min-width: 12rem" :rowspan="2">
                                        <template #header>
                                            <span class="text-xs">Tanggal Berakhir Masa Manfaat</span>
                                        </template>
                                    </Column>
                                    <Column field="masa_manfaat" style="min-width: 12rem" :rowspan="2">
                                        <template #header>
                                            <span class="text-xs">Masa Manfaat</span>
                                        </template>
                                    </Column>
                                    <Column field="assetAge" style="min-width: 12rem" :rowspan="2">
                                        <template #header>
                                            <span class="text-xs">Usia Asset</span>
                                        </template>
                                    </Column>
                                    <Column field="sisa_masa_manfaat" style="min-width: 12rem" :rowspan="2">
                                        <template #header>
                                            <span class="text-xs">Status</span>
                                        </template>
                                    </Column>
                                    <Column field="nilai_perolehan" style="min-width: 12rem" :rowspan="2">
                                        <template #header>
                                            <span class="text-xs">Nilai Perolehan</span>
                                        </template>
                                    </Column>
                                    <Column field="bookValue" style="min-width: 12rem" :rowspan="2">
                                        <template #header>
                                            <span class="text-xs">Book Value</span>
                                        </template>
                                    </Column>
                                    <Column :colspan="4" headerClass="text-center">
                                        <template #header>
                                            <span class="text-xs text-center">Nilai Depresiasi</span>
                                        </template>
                                    </Column>
                                    <Column style="text-align: center; width: 100%; min-width: 60ch;" :rowspan="2"></Column>
                                </Row>
                                <Row>
                                    <Column field="nilai_depresiasi_awal">
                                        <template #header>
                                            <span class="text-xs">Depresiasi Awal</span>
                                        </template>
                                    </Column>
                                    <Column field="monthlyDepreciation">
                                        <template #header>
                                            <span class="text-xs">Depresiasi Perbulan {{moment().format('MMM YYYY')}}</span>
                                        </template>
                                    </Column>
                                    <Column field="annualDepreciation">
                                        <template #header>
                                            <span class="text-xs">Depresiasi Pertahun {{moment().format('YYYY')}}</span>
                                        </template>
                                    </Column>
                                    <Column field="accumulatedDepreciation">
                                        <template #header>
                                            <span class="text-xs">Acum Dep. s/d {{moment().format('MMM YYYY')}}</span>
                                        </template>
                                    </Column>
                                </Row>
                            </ColumnGroup>

                            <!-- Body Posisition -->
                            <Column frozen expander style="width: 5rem"></Column>
                            <Column field="nomor" frozen style="min-width: 3rem" sortable >
                                <template #body="{data}">
                                    <strong class="text-sm">{{ data.nomor }}</strong>
                                </template>
                            </Column>
                            <Column field="nama" style="min-width: 12rem" sortable>
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.nama }}</span>
                                </template>
                            </Column>
                            <Column field="brand" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.brand }}</span>
                                </template>
                            </Column>
                            <Column field="assetUserName" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.assetUserName }}</span>
                                </template>
                            </Column>
                            <Column field="location" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.location }}</span>
                                </template>
                            </Column>
                            <Column field="tgl_perolehan" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.tgl_perolehan }}</span>
                                </template>
                            </Column>
                            <Column field="endMasaManfaatDate" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.endMasaManfaatDate }}</span>
                                </template>
                            </Column>
                            <Column field="masa_manfaat" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.masa_manfaat }} Bulan</span>
                                </template>
                            </Column>
                            <Column field="assetAge" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.assetAge }} Bulan</span>
                                </template>
                            </Column>
                            <Column field="sisa_masa_manfaat" style="min-width: 12rem">
                                <template #body="{data}">
                                    <Badge :value="data.sisa_masa_manfaat > 0 ? 'Masih Dalam Masa Manfaat' : 'Diluar Masa Manfaat'" :severity="data.sisa_masa_manfaat > 0 ? 'success' : 'danger'"></Badge>
                                </template>
                            </Column>
                            <Column field="nilai_perolehan" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ formatCurrency(data.nilai_perolehan) }}</span>
                                </template>
                            </Column>
                            <Column field="bookValue" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ formatCurrency(data.bookValue) }}</span>
                                </template>
                            </Column>
                            <Column field="nilai_depresiasi_awal" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ formatCurrency(data.nilai_depresiasi_awal) }}</span>
                                </template>
                            </Column>
                            <Column field="monthlyDepreciation" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ formatCurrency(data.monthlyDepreciation) }}</span>
                                </template>
                            </Column>
                            <Column field="annualDepreciation" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ formatCurrency(data.annualDepreciation) }}</span>
                                </template>
                            </Column>
                            <Column field="accumulatedDepreciation" style="min-width: 12rem">
                                <template #body="{data}">
                                    <span class="text-sm">{{ formatCurrency(data.accumulatedDepreciation) }}</span>
                                </template>
                            </Column>
                            <Column style="text-align: center; width: 100%; min-width: 60ch;">
                                <template #body="{data}">
                                    <div class="flex flex-wrap justify-content-center gap-2">
                                        <Button type="button" class="google" @click="showDialog('detail', data)">
                                            <span class="flex align-items-center px-2 bg-purple-700 text-white text-xs">
                                                <i className="pi pi-external-link"></i>
                                            </span>
                                            <span className="px-3 py-2 flex align-items-center text-white text-sm">Details</span>
                                        </Button>
                                        <Button type="button" class="twitter" @click="showDialog('edit', data)">
                                            <span class="flex align-items-center px-2 bg-yellow-700 text-white text-xs">
                                                <i className="pi pi-pencil"></i>
                                            </span>
                                            <span className="px-3 py-2 flex align-items-center text-white text-sm">Edit</span>
                                        </Button>
                                        <Button type="button" class="discord" @click="showDialog('value', data)">
                                            <span class="flex align-items-center px-2 bg-bluegray-700 text-white text-xs">
                                                <i className="pi pi-money-bill"></i>
                                            </span>
                                            <span className="px-3 py-2 flex align-items-center text-white text-sm">Asset Value</span>
                                        </Button>
                                        <Button type="button" class="active">
                                            <span class="flex align-items-center px-2 bg-teal-700 text-white text-xs">
                                                <i className="pi pi-check"></i>
                                            </span>
                                            <span className="px-3 py-2 flex align-items-center text-white text-sm">Active</span>
                                        </Button>
                                    </div>
                                </template>
                            </Column>
                            <template #expansion="slotProps">
                                <div class="p-3">
                                    <h6 class="font-normal">Calculate Initial Balance for <span class="font-semibold">{{ slotProps.data.nomor }}</span></h6>
                                    <DataTable v-model:expandedRows="expandedRows2" :value="slotProps.data.calculateInitialBalance" class="p-datatable-sm" style="width: 30%;">
                                        <Column frozen expander style="width: 3rem" />
                                        <Column field="year" sortable>
                                            <template #header>
                                                <span class="text-xs">Year</span>
                                            </template>
                                            <template #body="{data}">
                                                <span class="text-sm">{{ data.year }}</span>
                                            </template>
                                        </Column>
                                        <Column field="initialBalanceThisYear" header="Initial Balance" sortable>
                                            <template #body="slotProps">
                                                {{ formatCurrency(slotProps.data.initialBalanceThisYear) }}
                                            </template>
                                        </Column>
                                        <Column field="totalThisYear" header="Total" sortable>
                                            <template #body="slotProps">
                                                {{ formatCurrency(slotProps.data.totalThisYear) }}
                                            </template>
                                        </Column>
                                        <Column field="totalAccumulationUntilThisYear" header="Total Acumulate" sortable>
                                            <template #body="slotProps">
                                                {{ formatCurrency(slotProps.data.totalAccumulationUntilThisYear) }}
                                            </template>
                                        </Column>
                                        <template #expansion="slotProps">
                                            <h6 class="font-normal">Detail Calculate for <span class="font-semibold">{{ slotProps.data.year }}</span></h6>
                                            <DataTable :value="slotProps.data.monthlyDepreciation" class="p-datatable-sm">
                                                <Column field="no" header="No" sortable></Column>
                                                <Column field="month" header="Month" sortable>
                                                    <template #body="slotProps">
                                                        {{ month[Number(slotProps.data.month)-1] }}
                                                    </template>
                                                </Column>
                                                <Column field="value" header="Total" sortable>
                                                    <template #body="slotProps">
                                                        {{ formatCurrency(slotProps.data.value) }}
                                                    </template>
                                                </Column>
                                            </DataTable>
                                        </template>
                                    </DataTable>
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.google {
    background: linear-gradient(to left, var(--purple-600) 50%, var(--purple-700) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    border-color: var(--purple-700);
    display: flex;
    align-items: stretch;
    padding: 0;

    &:enabled:hover {
        background: linear-gradient(to left, var(--purple-600) 50%, var(--purple-700) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        border-color: var(--purple-700);
    }

    &:focus {
        box-shadow: 0 0 0 1px var(--purple-400);
    }
}

.twitter {
    background: linear-gradient(to left, var(--yellow-600) 50%, var(--yellow-700) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    border-color: var(--yellow-700);
    padding: 0;
    display: flex;
    align-items: stretch;

    &:enabled:hover {
        background: linear-gradient(to left, var(--yellow-600) 50%, var(--yellow-700) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        border-color: var(--yellow-700);
    }

    &:focus {
        box-shadow: 0 0 0 1px var(--yellow-400);
    }
}

.discord {
    background: linear-gradient(to left, var(--bluegray-600) 50%, var(--bluegray-700) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    border-color: var(--bluegray-700);
    padding: 0;
    display: flex;
    align-items: stretch;

    &:enabled:hover {
        background: linear-gradient(to left, var(--bluegray-600) 50%, var(--bluegray-700) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        border-color: var(--bluegray-700);
    }

    &:focus {
        box-shadow: 0 0 0 1px var(--bluegray-400);
    }
}

.active {
    background: linear-gradient(to left, var(--teal-600) 50%, var(--teal-700) 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: background-position 0.5s ease-out;
    border-color: var(--teal-700);
    padding: 0;
    display: flex;
    align-items: stretch;

    &:enabled:hover {
        background: linear-gradient(to left, var(--teal-600) 50%, var(--teal-700) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        border-color: var(--teal-700);
    }

    &:focus {
        box-shadow: 0 0 0 1px var(--teal-400);
    }
}
</style>