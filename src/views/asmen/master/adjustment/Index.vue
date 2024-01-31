<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';


// API
import AdjustmentService from '@/api/AdjustmentService';
import { formAdjustment} from '@/api/DataVariable';


// Variable
const dialogs = ref(false)
const titledialogs = ref(null);
const forms = ref(formAdjustment);
const statusdialog = ref(null);
const listAdjustment = ref([]);
const filters = ref();
const loadingTable = ref(null);
const selectedArea = ref();
const cm = ref();
const menuModel = ref([
    {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => showDialog('edit',selectedArea.value)},
]);

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Master', to:'/adjustment' }, { label: 'Adjustment', class:'font-bold', disabled:true  }]);

const toast = useToast();

// Given accsess public funtion
onMounted(() => {
    loadAdjustment();
});

const onRowContextMenu = (event) => {
    cm.value.show(event.originalEvent);
};

// Load Data Adjustment
const loadAdjustment = async () => {
    loadingTable.value = 'Loading ...';
    try {
        const response = await AdjustmentService.getAdjustment();
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
                kode_loss : data[i].kode_loss,
                nama_loss : data[i].nama_loss,
                kode_margin : data[i].kode_margin,
                nama_margin : data[i].nama_margin,
            }
        }
        listAdjustment.value = list;
    } catch (error) {
        loadingTable.value = 'Data not found !';
        listAdjustment.value = [];
    }
}

// Filter Table
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        kode_loss: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        kode_margin: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        nama_loss: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        nama_margin: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
        nama_margin: '',
        kode_margin: '',
        nama_loss: '',
        kode_loss: '',
    }
}

// Menampilkan Dialog Form
const showDialog = (status, item) => {
    dialogs.value = true;
    if (status == 'add') {
        titledialogs.value = 'Create User';
        statusdialog.value = status
        resetForm()
    } else if (status == 'delete') {
        titledialogs.value = 'Delete User';
        statusdialog.value = status
        forms.value = {
            id: item.id,
            nama_margin: item.nama_margin,
            kode_margin: item.kode_margin,
            nama_loss: item.nama_loss,
            kode_loss: item.kode_loss,
        };
    } else {
        titledialogs.value = 'Edit User';
        statusdialog.value = status
        forms.value = {
            id: item.id,
            nama_margin: item.nama_margin,
            kode_margin: item.kode_margin,
            nama_loss: item.nama_loss,
            kode_loss: item.kode_loss,
        };
    }
}

// Aksi Add & Update dari form Dialog
const postDialog = () => {
    // console.log(forms.value)
    dialogs.value = false;
    if (statusdialog.value == 'add') {
        // console.log(statusdialog.value)
        AdjustmentService.addAdjustment(forms.value).then(res => {
            const load = res.data;
            if (load.code == 200) {
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            }
        }).catch(error => {
            console.error(error.response.status);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        })
        setTimeout(() => {loadAdjustment();}, 3000);
    } else if (statusdialog.value == 'delete') {
        console.log(statusdialog.value)
    } else {
        AdjustmentService.updateAdjustment(forms.value.id,forms.value).then(res => {
            const load = res.data;
            if (load.code == 200) {
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
                // setTimeout(loadUser(), 3000);
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            }
        }).catch(error => {
            console.error(error.response.status);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        })
        setTimeout(() => {loadAdjustment();}, 3000);
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
                    <label for="firstname2">Kode Margin</label>
                    <InputText type="text" placeholder="Kode Margin" v-model="forms.kode_margin"/>
                </div>
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Nama Margin</label>
                    <InputText type="text" placeholder="Nama Margin" v-model="forms.nama_margin"/>
                </div>
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Kode Loss</label>
                    <InputText type="text" placeholder="Kode Loss" v-model="forms.kode_loss"/>
                </div>
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Nama Loss</label>
                    <InputText type="text" placeholder="Nama Loss" v-model="forms.nama_loss"/>
                </div>
            </div>
            <div class="p-fluid grid" v-else>
                <div class="field col-12 md:col-12">
                    <span>Apakah anda ingin menghapus <strong>{{ forms.name }}</strong> ?</span>
                </div>
            </div>
            <template #footer>
                <Button v-show="statusdialog != 'delete'" label="No" icon="pi pi-times" @click="dialogs = false" class="p-button-outlined p-button-danger" />
                <Button label="Save" icon="pi pi-save" @click="postDialog" class="p-button-outlined p-button-success" autofocus :disabled="disablebtnchangepass" />
            </template>
        </Dialog>
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid">
                    <div class="col-6 md:col-6 sm:col-6">
                        <h5>List Adjustment</h5>
                    </div>
                    <div class="col-6 md:col-6 sm:col-6 text-right">
                        <Button severity="info" size="small" icon="pi pi-plus" outlined label="Add Adjustment" @click="showDialog('add','')" />
                    </div>
                </div>
                <!-- Datatable -->
                <div class="grid">
                    <div class="col-12">
                        <h5 class="text-center font-normal" v-show="loadingTable !== null">{{ loadingTable }}</h5>
                        <ContextMenu ref="cm" :model="menuModel"/>
                        <DataTable v-model:filters="filters" :value="listAdjustment" paginator showGridlines :rows="10" dataKey="id" contextMenu v-model:contextMenuSelection="selectedArea" @rowContextmenu="onRowContextMenu"
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
                            <Column field="no" header="No" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.no }}
                                </template>
                            </Column>
                            <Column field="kode_margin" header="Kode Margin" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.kode_margin }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                                </template>
                            </Column>
                            <Column field="nama_margin" header="Nama Margin" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.nama_margin }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                                </template>
                            </Column>
                            <Column field="kode_loss" header="Kode Loss" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.kode_loss }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                                </template>
                            </Column>
                            <Column field="nama_loss" header="Nama Loss" style="min-width: 12rem">
                                <template #body="{ data }">
                                    {{ data.nama_loss }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>