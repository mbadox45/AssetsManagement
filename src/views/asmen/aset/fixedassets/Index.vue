<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';


// API
import AssetsService from '@/api/AssetsService';
import { month, formFairValue } from '@/api/DataVariable';
import moment from 'moment';

// Component
import DialogAsset from './components/DialogAsset.vue';
import DetailAsset from './components/DetailAsset.vue';
import FormEditAsset from './components/FormEditAsset.vue';
import ApproveBast from '../../bast/components/ApproveBast.vue';


// Variable
const roles = ref(localStorage.getItem('roles'));
const dialogs = ref(false)
const titledialogs = ref(null);
const statusdialog = ref(null);
const datadialog = ref(null);
const statusAssetValue = ref(null);
const filters = ref();
const tanggal = ref(moment(new Date()).format('YYYY-MM-DD'));

// Main Table
const expandedRows = ref([]);
const expandedRows2 = ref([]);
const listGroup = ref([]);
const total_nilai_perolehan = ref(null);
const loadingTable = ref(null);
const selectedAsset = ref();
const cm = ref();
const menuModel = ref([]);

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
    loadMenuAction();
});

const onRowContextMenu = (event) => {
    cm.value.show(event.originalEvent);
};

const viewAssets = (status,data) => {
    if (status === 'hide') {
        try {
            AssetsService.toggleActive(data.id).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    toast.add({ severity: 'success', summary: 'Successfully', detail: `Data updated successfully`, life: 3000 });
                    resetForm();
                } else {
                    toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
                }
            }).catch(error => {
                console.error(error.response.status);
                toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
            })
        } catch (error) {
            console.log(error);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        }
    } else {
        console.log(status,data.value);
    }
};

const loadMenuAction = () => {
    if (roles.value > 8) {
        menuModel.value = [
            {label: 'View Details', icon: 'pi pi-fw pi-search', command: () => showDialog('detail',selectedAsset.value)},
            {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editAssets('edit',selectedAsset.value.id)},
            {label: 'Hide', icon: 'pi pi-fw pi-times', command: () => viewAssets('hide',selectedAsset.value)},
            { separator: true },
            {label: 'Calculate Initial Balance', icon: 'pi pi-fw pi-calculator', command: () => showDialog('calculate',selectedAsset.value)},
            {label: 'Asset Value', icon: 'pi pi-fw pi-money-bill', command: () => showDialog('value',selectedAsset.value)},
            {label: 'BAST', icon: 'pi pi-fw pi-file', command: () => showDialog('approve_dept',selectedAsset)},
        ]
    } else {
        menuModel.value = [
            {label: 'View Details', icon: 'pi pi-fw pi-search', command: () => showDialog('detail',selectedAsset.value)},
            {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => showDialog('edit',selectedAsset.value)},
            { separator: true },
            {label: 'BAST', icon: 'pi pi-fw pi-file', command: () => showDialog('approve_dept',selectedAsset.value)},
        ]
    }
}

// Load Data Area
const loadAsset = async () => {
    loadingTable.value = 'Loading'
    try {
        let response;
        if (roles.value > 8) {
            response = await AssetsService.getAssets({tanggal: tanggal.value});
        } else {
            response = await AssetsService.getDeptFixedAsset();
        }
        const load = response.data;
        const data = load.data;

        // Loading Checking
        if (data.length > 0) {
            loadingTable.value = null;
        } else {
            loadingTable.value = 'Data not found';
        }

        const list = [];
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            if (roles.value > 8) {
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

                list[i] = {
                    id:data[i].id,
                    nama: data[i].nama,
                    brand: data[i].brand,
                    nomor: data[i].nomor,
                    assetUserName: data[i].assetUserName,
                    assetAge: data[i].assetAge,
                    masa_manfaat: data[i].masa_manfaat,
                    sisa_masa_manfaat: Number(data[i].masa_manfaat) - data[i].assetAge,
                    tgl_perolehan: moment(data[i].tgl_perolehan).format('DD MMM YYYY'),
                    id_pic : data[i].id_pic,
                    id_lokasi : data[i].id_lokasi,
                    lokasi : data[i].location.nama,
                    area : data[i].location.area.nama,
                    kondisi : data[i].kondisi,
                    keterangan : data[i].keterangan,
                    id_departemen : data[i].id_departemen,
                    spesifikasi: data[i].spesifikasi,
                    endMasaManfaatDate: moment(data[i].endMasaManfaatDate).format('DD MMM YYYY'),
                    accumulatedDepreciation: data[i].accumulatedDepreciation,
                    bookValue: data[i].bookValue,
                    location: data[i].location.nama,
                    formated_kode_penyusutan: data[i].formated_kode_penyusutan,
                    formated_kode_aktiva: data[i].formated_kode_aktiva,
                    supplier: data[i].supplier,
                    cost_centre: data[i].cost_centre,
                    fair_values: data[i].fair_values,
                    value_in_uses: data[i].value_in_uses,
                    nilai_perolehan: data[i].nilai_perolehan,
                    nilai_depresiasi_awal: data[i].nilai_depresiasi_awal,
                    monthlyDepreciation: data[i].monthlyDepreciation,
                    annualDepreciation: data[i].annualDepreciation,
                    calculateInitialBalance: convertedData,
                    adjustment_kode_loss: data[i].adjustment.kode_loss,
                    adjustment_nama_loss: data[i].adjustment.nama_loss,
                    adjustment_kode_margin: data[i].adjustment.kode_margin,
                    adjustment_nama_margin: data[i].adjustment.nama_margin,
                    // assetMIS_name: data[i].assetMIS.name,
                };
                if (data[i].status === 1) {
                    total += data[i].nilai_perolehan;
                }
                // console.log(data[i].supplier)

            } else {
                list[i] = {
                    id:data[i].id,
                    nama: data[i].nama,
                    brand: data[i].brand,
                    nomor: data[i].nomor,
                    assetUserName: data[i].assetUserName,
                    assetAge: data[i].assetAge,
                    masa_manfaat: data[i].masa_manfaat,
                    sisa_masa_manfaat: Number(data[i].masa_manfaat) - data[i].assetAge,
                    tgl_perolehan: moment(data[i].tgl_perolehan).format('DD MMM YYYY'),
                    id_pic : data[i].id_pic,
                    id_lokasi : data[i].id_lokasi,
                    lokasi : data[i].location.nama,
                    area : data[i].location.area.nama,
                    kondisi : data[i].kondisi,
                    id_departemen : data[i].id_departemen,
                    keterangan : data[i].keterangan,
                    spesifikasi: data[i].spesifikasi,
                    bast_fixed_assets: null
                    // bast_fixed_assets: data[i].bast_fixed_assets != null ? data[i].bast_fixed_assets[(data[i].bast_fixed_assets.length) - 1] : data[i].bast_fixed_assets
                };
            }
        }
        
        if (roles.value > 8) {
            total_nilai_perolehan.value = formatCurrency(total);
        }
        // console.log(list)
        
        listGroup.value = list;
    } catch (error) {
        loadingTable.value = 'Data Not Found';
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
        router.push(`/form-asset/${cond}?id=${id}&tanggal=${tanggal.value}`);
    }
}

// Menampilkan Dialog Form
const showDialog = async (status, item) => {
    dialogs.value = true;
    statusdialog.value = status
    if (status === 'detail') {
        titledialogs.value = `DETAIL ASSET <i class="pi pi-angle-double-right mx-2"></i> ${item.nomor}`;
        datadialog.value = item;
    } else if (status === 'calculate') {
        titledialogs.value = `CALCULATE INITIAL BALANCE <i class="pi pi-angle-double-right mx-2"></i> ${item.nomor}`;
        datadialog.value = item.calculateInitialBalance;
    } else if (status === 'value') {
        titledialogs.value = `ASSET VALUE <i class="pi pi-angle-double-right mx-2"></i> ${item.nomor}`;
        datadialog.value = {fair_value: item.fair_values, value_in_uses: item.value_in_uses, id_asset:item.id};
    } else if (status === 'approve_dept') {
        titledialogs.value = `APPROVE BAST <i class="pi pi-angle-double-right mx-2"></i> ${item.nomor}`;
        datadialog.value = {bast: item.bast_fixed_assets, assetUserName: item.assetUserName};
    } else {
        titledialogs.value = `EDIT ASSET <i class="pi pi-angle-double-right mx-2"></i> ${item.nomor}`;
        datadialog.value = item;
    }
}

// Menampilkan Dialog Form
const hideDialog = (status) => {
    if (status === 'save') {
        dialogs.value = false
        toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
    } else if (status === 'approve') {
        dialogs.value = false
        toast.add({ severity: 'success', summary: 'Successfully', detail: `Data approved successfully`, life: 3000 });
    } else if (status === 'warning') {
        dialogs.value = false;
        toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
    } else if (status === 'error') {
        dialogs.value = false;
        toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
    } else {
        dialogs.value = false;
    }
}

</script>

<template>
    <div class="grid">
        <Toast/>
        <Dialog v-model:visible="dialogs" :style="{ width: statusdialog == 'approve_dept' ? '700px' : '1100px' }" :modal="true">
            <template #header>
                <h4 class="font-normal" v-html="titledialogs"></h4>
            </template>
            <!-- Body -->
            <div v-if="statusdialog === 'detail'">
                <detail-asset :status_dialog="statusdialog" :data_dialog="datadialog" :tgl="tanggal" ></detail-asset>
            </div>
            <div v-else-if="statusdialog === 'edit'">
                <form-edit-asset :status_dialog="statusdialog" :data_dialog="datadialog" @submit="hideDialog" ></form-edit-asset>
            </div>
            <div v-else-if="statusdialog === 'approve_dept'">
                <approve-bast :status_dialog="statusdialog" :data_dialog="datadialog" @submit="hideDialog" />
            </div>
            <div v-else>
                <dialog-asset :status_dialog="statusdialog" :data_dialog="datadialog" ></dialog-asset>
            </div>
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
                        <Button severity="info" size="small" icon="pi pi-plus" outlined label="Add Asset" @click="editAssets('add','')"  v-show="roles > 8" />
                    </div>
                    <div class="p-fluid col-12 md:col-12 sm:col-12" v-show="roles > 8">
                        <div class="p-inputgroup flex-1">
                            <span class="p-inputgroup-addon bg-cyan-600 text-white">Tanggal Asset</span>
                            <InputText v-model="tanggal" type="date" placeholder="Tanggal" @change="loadAsset()" />
                        </div>
                    </div>
                </div>
                <!-- Datatable -->
                <div class="grid">
                    <div class="col-12" v-if="roles > 8">
                        <h4 class="text-center font-normal" v-show="loadingTable !== null && loadingTable !== 'Loading'">{{ loadingTable }}</h4>
                        <div v-show="loadingTable === 'Loading'" >
                            <div class="flex align-items-center justify-content-center">
                                <div>
                                    <ProgressSpinner aria-label="Loading" style="width: 50px; height: 50px" strokeWidth="8"/>
                                </div>
                                <div>
                                    <div class="text-gray-500 font-semibold">Please wait ...</div>
                                </div>
                            </div>
                        </div>
                        <ContextMenu ref="cm" :model="menuModel" />
                        <DataTable v-show="loadingTable === null" v-model:filters="filters" contextMenu v-model:contextMenuSelection="selectedAsset" @rowContextmenu="onRowContextMenu" v-model:expandedRows="expandedRows" :value="listGroup" scrollable showGridlines paginator :rows="10" dataKey="id"
                            filterDisplay="menu" :globalFilterFields="['nama', 'nomor', 'assetUserName']" class="p-datatable-sm">
                            <template #empty> No assets found, please select a date. </template>
                            <template #loading> Loading areas data. Please wait. </template>
                            <!-- Headers Template -->
                            <template #header>
                                <div class="flex justify-content-between align-item-center">
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                                    </span>
                                    <download-excel :data="listGroup" class="py-3 px-2 cursor-pointer font-semibold text-sm text-green-700 hover:text-green-500 " worksheet = "Fixed Asset" :name="`Fixed Assets ${moment().format('YYYY-MM-DD hh:mm:ss')}.xls`"><i class="pi pi-download mr-2"></i> Export to Excel</download-excel>
                                    <span class="font-normal text-sm py-3"><span class="text-red-500 font-semibold">*</span> Silahkan klik kanan untuk mendapatkan aksi disetiap row tabel.</span>
                                </div>
                            </template>
                            <!-- Headers Posisition -->
                            <ColumnGroup type="header">
                                <Row>
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
                                    <Column field="nilai_perolehan" style="min-width: 12rem" :rowspan="2" >
                                        <template #header>
                                            <span class="text-xs">Nilai Perolehan</span>
                                        </template>
                                    </Column>
                                    <Column field="bookValue" style="min-width: 12rem" :rowspan="2" >
                                        <template #header>
                                            <span class="text-xs">Book Value</span>
                                        </template>
                                    </Column>
                                    <Column :colspan="4" headerClass="text-center" >
                                        <template #header>
                                            <span class="text-xs text-center">Nilai Depresiasi</span>
                                        </template>
                                    </Column>
                                </Row>
                                <Row >
                                    <Column field="nilai_depresiasi_awal" >
                                        <template #header>
                                            <span class="text-xs">Depresiasi Awal</span>
                                        </template>
                                    </Column>
                                    <Column field="monthlyDepreciation" >
                                        <template #header>
                                            <span class="text-xs">Depresiasi Perbulan {{moment().format('MMM YYYY')}}</span>
                                        </template>
                                    </Column>
                                    <Column field="annualDepreciation" >
                                        <template #header>
                                            <span class="text-xs">Depresiasi Pertahun {{moment().format('YYYY')}}</span>
                                        </template>
                                    </Column>
                                    <Column field="accumulatedDepreciation" >
                                        <template #header>
                                            <span class="text-xs">Acum Dep. s/d {{moment().format('MMM YYYY')}}</span>
                                        </template>
                                    </Column>
                                </Row>
                            </ColumnGroup>

                            <!-- Body Posisition -->
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
                            <ColumnGroup type="footer">
                                <Row>
                                    <Column footer="Total Nilai Perolehan:" :colspan="10" footerStyle="text-align:right"/>
                                    <Column :footer="total_nilai_perolehan" :colspan="6" />
                                </Row>
                            </ColumnGroup>
                        </DataTable>
                    </div>
                    <div class="col-12" v-else>
                        <h4 class="text-center font-normal" v-show="loadingTable !== null && loadingTable !== 'Loading'">{{ loadingTable }}</h4>
                        <div v-show="loadingTable === 'Loading'" >
                            <div class="flex align-items-center justify-content-center">
                                <div>
                                    <ProgressSpinner aria-label="Loading" style="width: 50px; height: 50px" strokeWidth="8"/>
                                </div>
                                <div>
                                    <div class="text-gray-500 font-semibold">Please wait ...</div>
                                </div>
                            </div>
                        </div>
                        <ContextMenu ref="cm" :model="menuModel" />
                        <DataTable v-show="loadingTable === null" v-model:filters="filters" contextMenu v-model:contextMenuSelection="selectedAsset" @rowContextmenu="onRowContextMenu" v-model:expandedRows="expandedRows" :value="listGroup" scrollable showGridlines paginator :rows="10" dataKey="id"
                            filterDisplay="menu" :globalFilterFields="['nama', 'nomor', 'assetUserName']" class="p-datatable-sm">
                            <template #empty> No assets found, please select a date. </template>
                            <template #loading> Loading areas data. Please wait. </template>
                            <!-- Headers Template -->
                            <template #header>
                                <div class="flex justify-content-between align-item-center">
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                                    </span>
                                    <download-excel :data="listGroup" class="py-3 px-2 cursor-pointer font-semibold text-sm text-green-700 hover:text-green-500 " worksheet = "Depresiasi Asset" :name="`Depresiasi Asset ${moment().format('YYYY-MM-DD')}.xls`"><i class="pi pi-download mr-2"></i> Export to Excel</download-excel>
                                    <span class="font-normal text-sm py-3"><span class="text-red-500 font-semibold">*</span> Silahkan klik kanan untuk mendapatkan aksi disetiap row tabel.</span>
                                </div>
                            </template>
                            <Column field="nomor" frozen style="min-width: 3rem" sortable >
                                <template #header>
                                    <span class="text-xs">Nomor</span>
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Nomor Asset" />
                                </template>
                                <template #body="{data}">
                                    <strong class="text-sm">{{ data.nomor }}</strong>
                                </template>
                            </Column>
                            <Column field="nama" style="min-width: 12rem" sortable>
                                <template #header>
                                    <span class="text-xs">Nama Asset</span>
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by Nama Asset" />
                                </template>
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.nama }}</span>
                                </template>
                            </Column>
                            <Column field="brand" style="min-width: 12rem">
                                <template #header>
                                    <span class="text-xs">Brand</span>
                                </template>
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.brand }}</span>
                                </template>
                            </Column>
                            <Column field="assetUserName" style="min-width: 12rem">
                                <template #header>
                                    <span class="text-xs">PIC</span>
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by PIC" />
                                </template>
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.assetUserName }}</span>
                                </template>
                            </Column>
                            <Column field="lokasi" style="min-width: 12rem">
                                <template #header>
                                    <span class="text-xs">Lokasi Asset</span>
                                </template>
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.lokasi }}</span>
                                </template>
                            </Column>
                            <Column field="area" style="min-width: 12rem">
                                <template #header>
                                    <span class="text-xs">Area</span>
                                </template>
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.area }}</span>
                                </template>
                            </Column>
                            <Column field="tgl_perolehan" style="min-width: 12rem">
                                <template #header>
                                    <span class="text-xs">Tanggal Perolehan</span>
                                </template>
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.tgl_perolehan }}</span>
                                </template>
                            </Column>
                            <Column field="masa_manfaat" style="min-width: 12rem">
                                <template #header>
                                    <span class="text-xs">Masa Manfaat</span>
                                </template>
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.masa_manfaat }} Bulan</span>
                                </template>
                            </Column>
                            <Column field="assetAge" style="min-width: 12rem">
                                <template #header>
                                    <span class="text-xs">Usia Asset</span>
                                </template>
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.assetAge }} Bulan</span>
                                </template>
                            </Column>
                            <Column field="sisa_masa_manfaat" style="min-width: 12rem">
                                <template #header>
                                    <span class="text-xs">Status</span>
                                </template>
                                <template #body="{data}">
                                    <Badge :value="data.sisa_masa_manfaat > 0 ? 'Masih Dalam Masa Manfaat' : 'Diluar Masa Manfaat'" :severity="data.sisa_masa_manfaat > 0 ? 'success' : 'danger'"></Badge>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>