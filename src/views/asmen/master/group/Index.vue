<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';


// API
import GroupService from '@/api/GroupService';
import { formGroup } from '@/api/DataVariable';


// Variable
const roles = localStorage.getItem('roles');
const dialogs = ref(false)
const titledialogs = ref(null);
const forms = ref(formGroup);
const form_subgroup = ref([{id:null, nama:'', kode_aktiva_tetap: '', kode_akm_penyusutan: ''}]);
const statusdialog = ref(null);
const listGroup = ref([]);
const filters = ref();
const expandedRows = ref([]);
const loadingTable = ref(null);
const selectedGroup = ref();
const cm = ref();
const menuModel = ref([
    {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => showDialog('edit',selectedGroup.value)},
]);

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Master', to:'/group' }, { label: 'Group', class:'font-bold', disabled:true  }]);

const toast = useToast();

// Given accsess public funtion
onMounted(() => {
    loadGroup();
});

const onRowContextMenu = (event) => {
    cm.value.show(event.originalEvent);
};

// Load Data Area
const loadGroup = async () => {
    loadingTable.value = 'Loading ...';
    try {
        const response = await GroupService.getGroup();
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
                nama: data[i].nama,
                kode_aktiva_tetap: data[i].kode_aktiva_tetap,
                kode_akm_penyusutan: data[i].kode_akm_penyusutan,
                format: data[i].format,
                sub_groups : data[i].sub_groups,
            }
        }
        listGroup.value = list;
    } catch (error) {
        loadingTable.value = 'Data not found !';
        listGroup.value = [];
    }
}

// Filter Table
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nama: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        kode_aktiva_tetap: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        kode_akm_penyusutan: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        format: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
        nama_grup: '',
        kode_aktiva_tetap: '',
        kode_akm_penyusutan: '',
        format: '',
        subGroups: [],
    }
    form_subgroup.value = [{id:null, nama:'', kode_aktiva_tetap: '', kode_akm_penyusutan: ''}]
}

// Add Form Locations
const addsForm = () => {
    form_subgroup.value.push({id:null, nama:'', kode_aktiva_tetap: '', kode_akm_penyusutan: ''});
};
const removeForm = (index) => {
    form_subgroup.value.splice(index, 1);
};

// Menampilkan Dialog Form
const showDialog = (status, item) => {
    dialogs.value = true;
    if (status == 'add') {
        titledialogs.value = 'Create Group';
        statusdialog.value = status
        resetForm()
    } else if (status == 'delete') {
        titledialogs.value = 'Detail Group';
        statusdialog.value = status
        forms.value = {
            id: item.id,
            nama_grup: item.nama,
            kode_aktiva_tetap: item.kode_aktiva_tetap,
            kode_akm_penyusutan: item.kode_akm_penyusutan,
            format: item.format,
        };
        const location = item.sub_groups;
        const list = [];
        for (let i = 0; i < location.length; i++) {
            list[i] = {
                id: location[i].id,
                kode_aktiva_tetap: location[i].kode_aktiva_tetap,
                kode_akm_penyusutan: location[i].kode_akm_penyusutan,
                nama: location[i].nama,
            }
        }
        form_subgroup.value = list
        form_subgroup.value.sort((a, b) => a.id - b.id);
    } else {
        titledialogs.value = 'Edit Group';
        statusdialog.value = status
        forms.value = {
            id: item.id,
            nama_grup: item.nama,
            kode_aktiva_tetap: item.kode_aktiva_tetap,
            kode_akm_penyusutan: item.kode_akm_penyusutan,
            format: item.format,
        };
        const location = item.sub_groups;
        const list = [];
        for (let i = 0; i < location.length; i++) {
            list[i] = {
                id: location[i].id,
                kode_aktiva_tetap: location[i].kode_aktiva_tetap,
                kode_akm_penyusutan: location[i].kode_akm_penyusutan,
                nama: location[i].nama,
            }
        }
        form_subgroup.value = list
        form_subgroup.value.sort((a, b) => a.id - b.id);
    }
}

// Aksi Add & Update dari form Dialog
const postDialog = () => {
    dialogs.value = false;
    if (statusdialog.value == 'add') {
        const postData = {
            nama_grup: forms.value.nama_grup,
            kode_aktiva_tetap: forms.value.kode_aktiva_tetap,
            kode_akm_penyusutan: forms.value.kode_akm_penyusutan,
            format: forms.value.format,
            subGroups: form_subgroup.value
        }
        // console.log(postData)
        GroupService.addGroup(postData).then(res => {
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
        setTimeout(() => {loadGroup();}, 3000);
    } else if (statusdialog.value == 'delete') {
        console.log(statusdialog.value)
    } else {
        const postData = {
            nama_grup: forms.value.nama_grup,
            kode_aktiva_tetap: forms.value.kode_aktiva_tetap,
            kode_akm_penyusutan: forms.value.kode_akm_penyusutan,
            format: forms.value.format,
            subGroups: form_subgroup.value
        }
        GroupService.updateGroup(forms.value.id,postData).then(res => {
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
        setTimeout(() => {loadGroup();}, 3000);
    }
}

</script>

<template>
    <div class="grid">
        <Toast/>
        <Dialog v-model:visible="dialogs" :style="{ width: '850px' }" :modal="true">
            <template #header>
                <h4>{{titledialogs}}</h4>
            </template>
            <div class="p-fluid formgrid grid" v-if="statusdialog != 'delete'">
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Nama Group</label>
                    <InputText type="text" placeholder="Bunga" v-model="forms.nama_grup"/>
                </div>
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Kode Aktiva Tetap</label>
                    <InputText type="text" placeholder="00x" v-model="forms.kode_aktiva_tetap"/>
                </div>
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Kode Penyusutan</label>
                    <InputText type="text" placeholder="00x" v-model="forms.kode_akm_penyusutan"/>
                </div>
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Format Group</label>
                    <InputText type="text" placeholder="BNG 2" v-model="forms.format"/>
                </div>
                <div class="field col-12 md:col-12">
                    <div class="p-fluid formgrid grid mt-4" v-for="(form, index) in form_subgroup" :key="index">
                        <div class="field col-12 md:col-12 grid">
                            <div class="col-6">
                                <strong>SUB GROUP</strong>
                            </div>
                            <div class="col-6 text-right">
                                <Button icon="pi pi-plus" severity="primary" class="mx-2" @click="addsForm" outlined></Button>
                                <Button icon="pi pi-minus" severity="danger" @click="removeForm(index)" :disabled="index == 0 ? true : false" outlined></Button>
                            </div>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Nama Sub-Group</label>
                            <InputText type="text" placeholder="Sub Group" v-model="form.nama"/>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Kode Aktiva Tetap</label>
                            <InputText type="text" placeholder="00x" v-model="form.kode_aktiva_tetap "/>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Kode Penyusutan</label>
                            <InputText type="text" placeholder="00x" v-model="form.kode_akm_penyusutan"/>
                        </div>
                        <Divider/>
                    </div>
                </div>
            </div>
            <div class="p-fluid grid" v-else>
                <div class="field col-12 md:col-12">
                    <div class="grid">
                        <div class="col-12 md:col-6 sm:col-6">
                            <div class="grid">
                                <div class="col-4"><span>Format Group</span></div>
                                <div class="col-8">: <span>{{ forms.format }}</span></div>
                            </div>
                            <div class="grid">
                                <div class="col-4"><span>Nama Group</span></div>
                                <div class="col-8">: <strong>{{ forms.nama_grup }}</strong></div>
                            </div>
                        </div>
                        <div class="col-12 md:col-6 sm:col-6">
                            <div class="grid">
                                <div class="col-4"><span>Kode Aktiva Tetap</span></div>
                                <div class="col-8">: <span>{{ forms.kode_aktiva_tetap }}</span></div>
                            </div>
                            <div class="grid">
                                <div class="col-4"><span>Kode Penyusutan</span></div>
                                <div class="col-8">: <span>{{ forms.kode_akm_penyusutan }}</span></div>
                            </div>
                        </div>
                    </div>
                    <Divider align="center" type="solid">
                        <b>Sub Group</b>
                    </Divider>
                    <DataTable :value="form_subgroup" showGridlines tableStyle="min-width: 50rem">
                        <Column field="nama" header="Nama Sub Group"></Column>
                        <Column field="kode_aktiva_tetap" header="Kode Aktiva Tetap"></Column>
                        <Column field="kode_akm_penyusutan" header="Kode Penyusutan"></Column>
                    </DataTable>
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
                        <h5>List Group</h5>
                    </div>
                    <div class="col-6 md:col-6 sm:col-6 text-right">
                        <Button severity="info" size="small" icon="pi pi-plus" outlined label="Add Group" @click="showDialog('add','')" v-show="roles > 8" />
                    </div>
                </div>
                <!-- Datatable -->
                <div class="grid">
                    <div class="col-12">
                        <h5 class="text-center font-normal" v-show="loadingTable !== null">{{ loadingTable }}</h5>
                        <ContextMenu ref="cm" :model="menuModel" />
                        <DataTable v-model:filters="filters" v-model:expandedRows="expandedRows" :value="listGroup" showGridlines paginator :rows="10" dataKey="id" contextMenu v-model:contextMenuSelection="selectedGroup" @rowContextmenu="onRowContextMenu"
                            filterDisplay="menu" :loading="loading" :globalFilterFields="['nama', 'format', 'kode_aktiva_tetap', 'kode_akm_penyusutan']" v-show="loadingTable === null">
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
                            <Column field="nama" header="Group" style="min-width: 12rem">
                                <template #body="{data}">
                                    {{ data.nama }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by nama" />
                                </template>
                            </Column>
                            <Column field="format" header="Format Group" style="min-width: 12rem">
                                <template #body="{data}">
                                    {{ data.format }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by format group" />
                                </template>
                            </Column>
                            <Column field="kode_aktiva_tetap" header="Kode Aktiva Tetap" style="min-width: 12rem">
                                <template #body="{data}">
                                    {{ data.kode_aktiva_tetap }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by kode aktiva" />
                                </template>
                            </Column>
                            <Column field="kode_akm_penyusutan" header="Kode Penyusutan" style="min-width: 12rem">
                                <template #body="{data}">
                                    {{ data.kode_akm_penyusutan }}
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by kode penyusutan" />
                                </template>
                            </Column>
                            <template #expansion="slotProps">
                                <div class="p-3">
                                    <h6 class="font-normal">Group <i class="pi pi-angle-double-right"></i> <span class="font-semibold">{{ slotProps.data.nama }}</span></h6>
                                    <DataTable :value="slotProps.data.sub_groups" class="p-datatable-sm">
                                        <Column field="nama" sortable>
                                            <template #header>
                                                <span class="text-xs">Sub Group</span>
                                            </template>
                                            <template #body="{data}">
                                                <span class="text-sm">{{ data.nama }}</span>
                                            </template>
                                        </Column>
                                        <Column field="kode_aktiva_tetap" sortable>
                                            <template #header>
                                                <span class="text-xs">Kode Aktiva Tetap</span>
                                            </template>
                                            <template #body="{data}">
                                                <span class="text-sm">{{ data.kode_aktiva_tetap }}</span>
                                            </template>
                                        </Column>
                                        <Column field="kode_akm_penyusutan" sortable>
                                            <template #header>
                                                <span class="text-xs">Kode Penyusutan</span>
                                            </template>
                                            <template #body="{data}">
                                                <span class="text-sm">{{ data.kode_akm_penyusutan }}</span>
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