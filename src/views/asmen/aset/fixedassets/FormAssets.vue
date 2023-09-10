<script setup>
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute  } from 'vue-router';
import moment from 'moment';


// API
import GroupService from '@/api/GroupService';
import AreaService from '@/api/AreaService';
import SupplierService from '@/api/SupplierService';
import AdjustmentService from '@/api/AdjustmentService';
import UserService from '@/api/UserService';
import AssetsService from '@/api/AssetsService';
import { formAsset, settingPertanyaan, BreadcrumbHome, listKondisi, listCostCentre } from '@/api/DataVariable';


// Variable
const toast = useToast();
const router = useRouter();
const route = useRoute();

const params = route.params.cond;
const id_question = route.query.id;

const judul = ref(null);
const deskipsi = ref(null);
const forms = ref(formAsset);
const forms_spesifikasi = ref([{id:null, nama: "", value: ""}]);
const answers = ref(null);
const changePertanyaan = ref(true);
const disabled_depresiasi = ref(true);

// Dropdown
const list_group = ref([])
const list_subgroup = ref([])
const list_lokasi = ref([])
const list_departemen = ref([])
const list_pic = ref([])
const list_kondisi = ref(listKondisi)
const list_cost_centre = ref(listCostCentre);
const list_supplier = ref([])
const list_adjustment = ref([])

const breadcrumbHome = ref(BreadcrumbHome);
const breadcrumbItems = ref([]);

// Detail Menu Peranyaan
const menu = ref(null);
const items = ref(settingPertanyaan);

// Given accsess public funtion
onMounted(() => {
    addForms(params);
    bcItems();
});

const changeQuestion = (val) => {
    changePertanyaan.value = val;
}

const bcItems = () => {
    if (params == 'add') {
        judul.value = 'Form Add Asset';
        deskipsi.value = '<span class="text-red-500">*</span> Wajib diisi.';
        breadcrumbItems.value = [
            { label: 'Home', to:'/home' }, { label: 'Master', to:'#' }, { label: 'Fixed Assets', to:'/fix-asset' }, { label: 'Form Add Asset', class:'font-bold', disabled:true}
        ]
    } else {
        judul.value = 'Form Edit Asset';
        deskipsi.value = '<span class="text-red-500">*</span> Wajib diisi.';
        breadcrumbItems.value = [
            { label: 'Home', to:'/home' }, { label: 'Master', to:'#' }, { label: 'Fixed Assets', to:'/fix-asset' }, { label: id_question, to:`/edit-question/${id_question}` }, { label: 'Edit Asset', class:'font-bold', disabled:true}
        ]
    }
}

// Function Private
const loadDropdown = async () => {
    try {
        // Load API
        const group = await GroupService.getGroup();
        const location = await AreaService.getLocation();
        const supplier = await SupplierService.getSupplier();
        const adjustment = await AdjustmentService.getAdjustment();
        const user = await UserService.getUsers();

        // console.log(group);
        // console.log(location);
        // Declare API
        const group_data = group.data.data;
        const location_data = location.data.data;
        const supplier_data = supplier.data.data;
        const adjustment_data = adjustment.data.data;
        const user_data = user.data.data;
        // Selection Data
        const listGroup = [];
        for (let i = 0; i < group_data.length; i++) {
            listGroup[i] = {nama: group_data[i].nama, id_grup: group_data[i].id}
        }
        list_group.value = listGroup;
        const listLocation = [];
        for (let i = 0; i < location_data.length; i++) {
            listLocation[i] = {nama: location_data[i].nama + ' (' + location_data[i].area.nama + ')', id_lokasi: location_data[i].id}
        }
        list_lokasi.value = listLocation;
        const listSupplier = [];
        for (let i = 0; i < supplier_data.length; i++) {
            listSupplier[i] = {nama: supplier_data[i].nama, id_supplier: supplier_data[i].id}
        }
        list_supplier.value = listSupplier;
        const listAdjustment = [];
        for (let i = 0; i < adjustment_data.length; i++) {
            listAdjustment[i] = {nama: `Loss (${adjustment_data[i].kode_loss} - ${adjustment_data[i].nama_loss}), Margin (${adjustment_data[i].kode_margin} - ${adjustment_data[i].nama_margin})`, id_kode_adjustment: adjustment_data[i].id}
        }
        list_adjustment.value = listAdjustment;
        const listUser = [];
        for (let i = 0; i < user_data.length; i++) {
            listUser[i] = {nama: user_data[i].name, id_pic: user_data[i].id}
        }
        list_pic.value = listUser;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const loadSubGroup = async () => {
    try {
        // Load API
        const group = await GroupService.getSubGroupByGroupID(forms.value.id_grup);
        // Declare API
        const group_data = group.data.data;
        // Selection Data
        const listGroup = [];
        for (let i = 0; i < group_data.length; i++) {
            listGroup[i] = {nama: group_data[i].nama, id_sub_grup: group_data[i].id}
        }
        list_subgroup.value = listGroup;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Pengecekan Depresiasi
const cekDepresiasi = () => {
    const year = moment(forms.value.tgl_perolehan).format('YYYY');
    const now_year = moment().format('YYYY');
    if (year >= now_year) {
        forms.value.nilai_depresiasi_awal = 0;
        console.log(forms.value.nilai_depresiasi_awal);
        disabled_depresiasi.value = true;
    } else {
        console.log('depresiasi is value');
        disabled_depresiasi.value = false;
        forms.value.nilai_depresiasi_awal = null;
    }
}

const addForms = (type) => {
    if (type == 'edit') {
        answers.value = type;
        console.log(type)
    } else {
        answers.value = type;
        resetForm()
        loadDropdown();
    }
}

const addsForm = () => {
    // tot_answare.value++;
    forms_spesifikasi.value.push({
        id: null,
        value: '',
        nama: '',
    });
};

const removeForm = (index) => {
    forms_spesifikasi.value.splice(index, 1); // Remove the form at the specified index
};

const resetForm = () => {
    forms.value = {
        id: 0,
        id_grup: null,
        id_sub_grup: null,
        nama: '',
        brand: '',
        masa_manfaat: null,
        tgl_perolehan: null,
        nilai_perolehan: null,
        nilai_depresiasi_awal: null,
        id_lokasi: null,
        id_departemen: 1,
        id_pic: null,
        cost_centre: '',
        kondisi: '',
        keterangan: '',
        id_supplier: null,
        id_kode_adjustment: null,
        fairValue: null,
        valueInUse: null,
        spesifikasi: [],
    };
    forms_spesifikasi.value = [{id:null, nama: "", value: ""}]
}

const backToQuestion = () => {
    router.push({path:'/fix-asset'})
}

const postDialog = () => {
    // fill data in var array condition
    forms.value.spesifikasi = forms_spesifikasi.value;
    forms.value.tgl_perolehan = moment(forms.value.tgl_perolehan).format('YYYY-MM-DD')
    if (params == 'add') {
        AssetsService.addAssets(forms.value).then(res => {
            const load = res.data;
            if (load.code == 200) {
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
                resetForm();
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            }
        }).catch(error => {
            console.error(error.response.status);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        })
    } else if (params == 'edit') {
        console.log(params)
    } else {
        console.log(forms.value);
        console.log(params);
        toast.add({ severity: 'success', summary: 'Successfully', detail: `Delete successfully`, life: 3000 });
        resetForm();
    }
}

</script>

<template>
    <div class="grid">
        <Toast position="top-center"/>
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div>
                    <h5>{{judul}}</h5>
                    <span v-html="deskipsi"></span>
                </div>
                <Panel class="my-5">
                    <template #header>
                        <Button class="text-red-500 mr-2" outlined icon="pi pi-arrow-left" label="Kembali" size="small" @click="backToQuestion"></Button>
                    </template>
                    <template #icons>
                        <Button class="p-link text-blue-500 mr-2" outlined icon="pi pi-save" v-tooltip.top="'Simpan'" @click="postDialog"></Button>
                        <Button class="p-link text-gray-500 mr-2" outlined icon="pi pi-sync" v-tooltip.top="'Bersihkan Form'" @click="resetForm"></Button>
                        <Menu ref="menu" id="config_menu" :model="items" popup />
                    </template>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Nama Asset</label>
                            <InputText type="text" v-model="forms.nama" placeholder="Contoh: Laptop Asus Zenbook A15X"/>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Brand</label>
                            <InputText type="text" v-model="forms.brand" placeholder="Contoh: Asus"/>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Group</label>
                            <Dropdown v-model="forms.id_grup" :options="list_group" filter optionLabel="nama" optionValue="id_grup" placeholder="Select a Group" @change="loadSubGroup"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Sub Group</label>
                            <Dropdown v-model="forms.id_sub_grup" :options="list_subgroup" filter optionLabel="nama" optionValue="id_sub_grup" placeholder="Select a Sub Group"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="firstname2">Masa Manfaat</label>
                            <InputNumber v-model="forms.masa_manfaat" placeholder="0"/>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="firstname2">Tgl Perolehan</label>
                            <InputText type="date" v-model="forms.tgl_perolehan" @input="cekDepresiasi()"/>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="firstname2">Nilai Perolehan</label>
                            <InputNumber v-model="forms.nilai_perolehan" :minFractionDigits="2" :maxFractionDigits="3" placeholder="0.00" />
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="firstname2">Nilai Depresiasi Awal</label>
                            <InputNumber v-model="forms.nilai_depresiasi_awal" :minFractionDigits="2" :maxFractionDigits="3" placeholder="0.00" :disabled="disabled_depresiasi"/>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="firstname2">Lokasi</label>
                            <Dropdown v-model="forms.id_lokasi" :options="list_lokasi" filter optionLabel="nama" optionValue="id_lokasi" placeholder="Select a Location"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="firstname2">Departemen</label>
                            <Dropdown v-model="forms.id_departemen" :options="list_departemen" filter optionLabel="nama" optionValue="id_departemen" placeholder="Select a Departemen"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="firstname2">PIC Asset</label>
                            <Dropdown v-model="forms.id_pic" :options="list_pic" filter optionLabel="nama" optionValue="id_pic" placeholder="Select a PIC"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Cost Center</label>
                            <Dropdown v-model="forms.cost_centre" :options="list_cost_centre" optionLabel="name" optionValue="cost_centre" placeholder="Select a Cost Center"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Kondisi</label>
                            <Dropdown v-model="forms.kondisi" :options="list_kondisi" optionLabel="name" optionValue="kondisi" placeholder="Select a Condition"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Supplier</label>
                            <Dropdown v-model="forms.id_supplier" :options="list_supplier" filter optionLabel="nama" optionValue="id_supplier" placeholder="Select a Supplier"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Adjustment</label>
                            <Dropdown v-model="forms.id_kode_adjustment" :options="list_adjustment" filter optionLabel="nama" optionValue="id_kode_adjustment" placeholder="Select a Adjustment"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Fair Value</label>
                            <InputNumber v-model="forms.fairValue" :minFractionDigits="2" :maxFractionDigits="2" placeholder="0.00"/>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Value In Use</label>
                            <InputNumber v-model="forms.valueInUse" :minFractionDigits="2" :maxFractionDigits="2" placeholder="0.00"/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Keterangan</label>
                            <Textarea v-model="forms.keterangan" autoResize rows="3"/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <div class="p-fluid formgrid grid mt-4" v-for="(form, index) in forms_spesifikasi" :key="index">
                                <div class="field col-12 md:col-12 grid">
                                    <div class="col-6">
                                        <strong>Spesifikasi</strong>
                                    </div>
                                    <div class="col-6 text-right">
                                        <Button icon="pi pi-plus" severity="primary" class="mx-2" @click="addsForm" outlined></Button>
                                        <Button icon="pi pi-minus" severity="danger" @click="removeForm(index)" :disabled="index == 0 ? true : false" outlined></Button>
                                    </div>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="firstname2">Jenis Spesifikasi</label>
                                    <InputText type="text" placeholder="Contoh: Serial Number" v-model="form.nama"/>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="firstname2">Keterangan</label>
                                    <InputText type="text" placeholder="Contoh : SN1234567" v-model="form.value "/>
                                </div>
                                <Divider/>
                            </div>
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    </div>
</template>