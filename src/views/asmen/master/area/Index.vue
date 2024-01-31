<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';


// API
import AreaService from '@/api/AreaService';
import { formArea } from '@/api/DataVariable';


// Variable
const dialogs = ref(false)
const titledialogs = ref(null);
const forms = ref(formArea);
const form_location = ref([{id:null, nama:'', keterangan: ''}]);
const statusdialog = ref(null);
const listArea = ref([]);
const filters = ref();
const expandedRows = ref([]);
const loadingTable = ref(null);
const selectedArea = ref();
const cm = ref();
const menuModel = ref([
    {label: 'Logs', icon: 'pi pi-fw pi-hashtag', command: () => viewArea('view',selectedArea)},
    {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => showDialog('edit',selectedArea.value)},
]);

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Master', to:'/area' }, { label: 'Area', class:'font-bold', disabled:true  }]);

const toast = useToast();

// Given accsess public funtion
onMounted(() => {
    loadArea();
});

const viewArea = (status,data) => {
    console.log(status,data.value);
};
const onRowContextMenu = (event) => {
    cm.value.show(event.originalEvent);
};

// Load Data Area
const loadArea = async () => {
    loadingTable.value = 'Loading ...';
    try {
        const response = await AreaService.getArea();
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
                nama : data[i].nama,
                locations : data[i].locations,
                logs : data[i].logs,
            }
        }
        listArea.value = list;
    } catch (error) {
        loadingTable.value = 'Data not found !';
        listArea.value = [];
    }
}

// Filter Table
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nama: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
        nama_area: '',
        locations: [],
    }
    form_location.value = [{id:null, nama:'', keterangan: ''}]
}

// Add Form Locations
const addsForm = () => {
    form_location.value.push({id:null, nama:'', keterangan: ''});
};
const removeForm = (index) => {
    form_location.value.splice(index, 1);
};

// Menampilkan Dialog Form
const showDialog = (status, item) => {
    dialogs.value = true;
    if (status == 'add') {
        titledialogs.value = 'Create Area';
        statusdialog.value = status
        resetForm()
    } else if (status == 'delete') {
        titledialogs.value = item.nama;
        statusdialog.value = status
        const location = item.locations;
        const list = [];
        for (let i = 0; i < location.length; i++) {
            list[i] = {
                id: location[i].id,
                keterangan: location[i].keterangan,
                nama: location[i].nama,
            }
        }
        form_location.value = list
    } else {
        titledialogs.value = 'Edit Area';
        statusdialog.value = status
        forms.value = {
            id: item.id,
            nama_area: item.nama,
        };
        const location = item.locations;
        const list = [];
        for (let i = 0; i < location.length; i++) {
            list[i] = {
                id: location[i].id,
                keterangan: location[i].keterangan,
                nama: location[i].nama,
            }
        }
        form_location.value = list
    }
}

// Aksi Add & Update dari form Dialog
const postDialog = () => {
    dialogs.value = false;
    if (statusdialog.value == 'add') {
        const postData = {
            nama_area: forms.value.nama_area,
            locations: form_location.value
        }
        // console.log(postData)
        AreaService.addArea(postData).then(res => {
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
        setTimeout(() => {loadArea();}, 3000);
    } else if (statusdialog.value == 'delete') {
        console.log(statusdialog.value)
    } else {
        const postData = {
            nama_area: forms.value.nama_area,
            locations: form_location.value
        }
        AreaService.updateArea(forms.value.id,postData).then(res => {
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
        setTimeout(() => {loadArea();}, 3000);
    }
}

</script>

<template>
    <div class="grid">
        <Toast/>
        <Dialog v-model:visible="dialogs" :style="statusdialog != 'delete' ? { width: '850px' } : { width: '450px' }" :modal="true">
            <template #header>
                <h4>{{titledialogs}}</h4>
            </template>
            <div class="p-fluid formgrid grid" v-if="statusdialog != 'delete'">
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Nama Area</label>
                    <InputText type="text" placeholder="Nama Area" v-model="forms.nama_area"/>
                </div>
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Lokasi</label>
                    <div v-for="(form, index) in form_location" :key="index">
                        <div class="p-inputgroup flex-1 my-3">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-map-marker"></i>
                            </span>
                            <InputText placeholder="Nama Lokasi" v-model="form.nama" />
                            <InputText placeholder="Keterangan Lokasi" v-model="form.keterangan" />
                            <Button icon="pi pi-plus" severity="primary" @click="addsForm" outlined></Button>
                            <Button icon="pi pi-minus" severity="danger" @click="removeForm(index)" :disabled="index == 0 ? true : false" outlined></Button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-fluid grid" v-else>
                <div class="field col-12 md:col-12">
                    <h5 class="text-center">Location :</h5>
                    <Timeline :value="form_location" align="right" class="w-full">
                        <template #marker>
                            <span class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1 bg-cyan-500">
                                <i class="pi pi-map-marker"></i>
                            </span>
                        </template>
                        <template #content="slotProps">
                            {{ slotProps.item.nama }}
                        </template>
                        <template #opposite="slotProps">
                            <small class="p-text-secondary">{{slotProps.item.keterangan}}</small>
                        </template>
                    </Timeline>
                </div>
            </div>
            <template #footer>
                <Button :label="statusdialog != 'delete' ? 'No':'Cancel'" icon="pi pi-times" @click="dialogs = false" class="p-button-outlined p-button-danger" />
                <Button v-show="statusdialog != 'delete'" label="Save" icon="pi pi-save" @click="postDialog" class="p-button-outlined p-button-success" autofocus :disabled="disablebtnchangepass" />
            </template>
        </Dialog>
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid">
                    <div class="col-6 md:col-6 sm:col-6">
                        <h5>List Area</h5>
                    </div>
                    <div class="col-6 md:col-6 sm:col-6 text-right">
                        <Button severity="info" size="small" icon="pi pi-plus" outlined label="Add Area" @click="showDialog('add','')" />
                    </div>
                </div>
                <!-- Datatable -->
                <div class="grid">
                    <div class="col-12">
                        <h5 class="text-center font-normal" v-show="loadingTable !== null">{{ loadingTable }}</h5>
                        <ContextMenu ref="cm" :model="menuModel" />
                        <DataTable v-model:filters="filters" v-model:expandedRows="expandedRows" contextMenu v-model:contextMenuSelection="selectedArea" @rowContextmenu="onRowContextMenu" :value="listArea" showGridlines paginator :rows="10" dataKey="id"
                            filterDisplay="menu" :loading="loading" :globalFilterFields="['nama', 'locations.nama']" v-show="loadingTable === null">
                            <template #header>
                                <div class="flex justify-content-between align-items-center">
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                                    </span>
                                    <span class="font-normal text-sm"><span class="text-red-500 font-semibold">*</span> Silahkan klik kanan untuk mendapatkan aksi disetiap row tabel.</span>
                                </div>
                            </template>
                            <template #empty> No areas found. </template>
                            <template #loading> Loading areas data. Please wait. </template>
                            <Column expander style="width: 5rem"></Column>
                            <Column field="no" header="No" style="min-width: 3rem">
                                <template #body="{data}">
                                    {{ data.no }}
                                </template>
                            </Column>
                            <Column field="nama" header="Area" style="min-width: 12rem">
                                <template #body="{data}">
                                    {{ data.nama }}
                                </template>
                            </Column>
                            <template #expansion="slotProps">
                                <div class="p-3">
                                    <h6 class="font-normal">Lokasi untuk area <span class="font-semibold">{{ slotProps.data.nama }}</span></h6>
                                    <DataTable :value="slotProps.data.locations" class="p-datatable-sm" style="width: 30%;">
                                        <Column field="nama" sortable>
                                            <template #header>
                                                <span class="text-xs">Lokasi</span>
                                            </template>
                                            <template #body="{data}">
                                                <span class="text-sm">{{ data.nama }}</span>
                                            </template>
                                        </Column>
                                        <Column field="keterangan" sortable>
                                            <template #header>
                                                <span class="text-xs">Keterangan</span>
                                            </template>
                                            <template #body="{data}">
                                                <span class="text-sm">{{ data.keterangan }}</span>
                                            </template>
                                        </Column>
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