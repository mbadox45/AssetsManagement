<script setup>
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute  } from 'vue-router';
import moment from 'moment';


// API
import GroupService from '@/api/GroupService';
import AreaService from '@/api/AreaService';
import SupplierService from '@/api/SupplierService';
import StockPickingService from '@/api/StockPickingService';
import AdjustmentService from '@/api/AdjustmentService';
import UserService from '@/api/UserService';
import AssetsService from '@/api/AssetsService';
import { URL_API } from '@/api/env';
import { formAsset, settingPertanyaan, BreadcrumbHome, listKondisi, listCostCentre } from '@/api/DataVariable';

// Component
import InputDepartmen from './components/form_Input/InputDepartmen.vue';


// Variable
const toast = useToast();
const router = useRouter();
const route = useRoute();

const params = route.params.cond;
const id_question = route.query.id;
const tgl_question = route.query.tanggal;

const judul = ref(null);
const deskipsi = ref(null);
const forms = ref(formAsset);
const forms_spesifikasi = ref([{nama: "", value: ""}]);
const answers = ref(null);
const changePertanyaan = ref(true);
const disabled_depresiasi = ref(true);
const disabled_asset_value = ref(true);
const loading = ref(null);
const checked = ref(false);

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
const list_mis = ref([])
const list_mis2 = ref([])

const list_gambar = ref([])
const status_gambar = ref(true)

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
const loadAsset = async() => {
    try {
        const asset = await AssetsService.getAssetsByID(id_question,{tanggal:tgl_question});
        const response = asset.data;
        const data = response.data;
        // console.log(data)
        forms.value = {
            id: data.id,
            id_grup: data.sub_group.id_grup,
            id_sub_grup: data.sub_group.id,
            nama: data.nama,
            brand: data.brand,
            masa_manfaat: data.masa_manfaat,
            tgl_perolehan: data.tgl_perolehan,
            nilai_perolehan: Number(data.nilai_perolehan),
            nilai_depresiasi_awal: Number(data.nilai_depresiasi_awal),
            id_mis: data.id_mis,
            id_lokasi: data.id_lokasi,
            id_departemen: Number(data.id_departemen),
            id_pic: Number(data.id_pic),
            cost_centre: data.cost_centre,
            kondisi: data.kondisi,
            keterangan: data.keterangan,
            id_supplier: Number(data.id_supplier),
            id_kode_adjustment: data.id_kode_adjustment,
            fairValue: data.fair_values[0].nilai,
            valueInUse: data.value_in_uses[0].nilai,
        }
        const spek = data.spesifikasi.map(item => JSON.parse(item));
        const foto = data.fotoFixedAssets;

        // Spek
        const list =[];
        for (let i = 0; i < spek.length; i++) {
            list[i] = {
                value: spek[i].value, nama: spek[i].nama,
            }
        }
        forms_spesifikasi.value = list;

        // Foto
        const list_foto =[];
        for (let i = 0; i < foto.length; i++) {
            list_foto[i] = {
                id: foto[i].id, name: foto[i].nama_file, img: `${foto[i].nama_file}`,
            }
        }
        list_gambar.value = list_foto
        console.log(list_foto)

        cekKondisiAsset();
        cekDepresiasi(data.fair_values[0].nilai, data.value_in_uses[0].nilai);
    } catch (error) {
        console.error('Error fetching data:', error);
        resetForm()
    }
}

const loadDropdown = async () => {
    let endTime = null;
    loading.value = 'loading';

    // await loadMIS();
    await loadSupplier();
    await loadAdjustment();
    await loadGroup();
    await loadLocation();
    await loadUser();
    await loadDept();

    endTime = performance.now();
    if (endTime != null) {
        loading.value = null;
    } else {
        loading.value = 'failed';
    }
}

const loadUser = async () => {
    try {
        // Load API
        const user = await UserService.getUsers();
        // Declare API
        const user_data = user.data.data;
        // Selection Data
        const listUser = [];
        for (let i = 0; i < user_data.length; i++) {
            listUser[i] = {nama: user_data[i].name, id_pic: user_data[i].id}
        }
        list_pic.value = listUser;
    } catch (error) {
        list_pic.value = [];
        console.error('Error fetching data:', error);
    }
}

const loadDept = async () => {
    try {
        // Load API
        const dept = await UserService.getDept();
        // Declare API
        const dept_data = dept.data.data;
        // Selection Data
        const listDept = [];
        for (let i = 0; i < dept_data.length; i++) {
            listDept[i] = {nama: dept_data[i].department, id_departemen: dept_data[i].id}
        }
        list_departemen.value = listDept;
        // console.log(dept)
    } catch (error) {
        list_departemen.value = [];
        console.error('Error fetching data:', error);
    }
}

const loadAdjustment = async () => {
    try {
        // Load API
        const adjustment = await AdjustmentService.getAdjustment();
        // Declare API
        const adjustment_data = adjustment.data.data;

        // Selection Data
        const listAdjustment = [];
        for (let i = 0; i < adjustment_data.length; i++) {
            listAdjustment[i] = {nama: `Loss (${adjustment_data[i].kode_loss} - ${adjustment_data[i].nama_loss}), Margin (${adjustment_data[i].kode_margin} - ${adjustment_data[i].nama_margin})`, id_kode_adjustment: adjustment_data[i].id}
        }
        list_adjustment.value = listAdjustment;
    } catch (error) {
        list_adjustment.value = [];
        console.error('Error fetching data:', error);
    }
}

const loadMIS = async () => {
    try {
        // Load API
        const mis = await StockPickingService.getMis();
        // Declare API
        const mis_data = mis.data.data;
        // Selection Data
        const listSupplier = [];
        for (let i = 0; i < mis_data.length; i++) {
            listSupplier[i] = {nama: `${mis_data[i].id} - ${mis_data[i].name}`, id_mis: mis_data[i].name}
        }
        list_mis.value = listSupplier;
    } catch (error) {
        list_mis.value = [];
        console.error('Error fetching data:', error);
    }
}

const loadAfterMIS = (event) => {
    const load = list_mis.value.filter(item => item.nama.includes(event.query.toUpperCase()))
    list_mis2.value = load
    // console.log(load, event)
}

const loadSupplier = async () => {
    try {
        // Load API
        const supplier = await SupplierService.getSupplier();
        // Declare API
        const supplier_data = supplier.data.data;
        // Selection Data
        const listSupplier = [];
        for (let i = 0; i < supplier_data.length; i++) {
            listSupplier[i] = {nama: `${supplier_data[i].kode} - ${supplier_data[i].nama}`, id_supplier: supplier_data[i].id}
        }
        list_supplier.value = listSupplier;
    } catch (error) {
        list_supplier.value = [];
        console.error('Error fetching data:', error);
    }
}

const loadGroup = async () => {
    try {
        // Load API
        const group = await GroupService.getGroup();
        // Declare API
        const group_data = group.data.data;
        // Selection Data
        const listGroup = [];
        for (let i = 0; i < group_data.length; i++) {
            listGroup[i] = {nama: group_data[i].nama, id_grup: group_data[i].id}
        }
        list_group.value = listGroup;
        if (forms.value.id_grup !== null) {
            loadSubGroup();
        }
    } catch (error) {
        list_group.value = [];
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
        list_subgroup.value = [];
        console.error('Error fetching data:', error);
    }
}

const loadLocation = async () => {
    try {
        // Load API
        const location = await AreaService.getLocation();
        // Declare API
        const location_data = location.data.data;
        // Selection Data
        const listLocation = [];
        for (let i = 0; i < location_data.length; i++) {
            listLocation[i] = {nama: location_data[i].nama + ' (' + location_data[i].area.nama + ' - '+ location_data[i].keterangan + ')', id_lokasi: location_data[i].id}
        }
        list_lokasi.value = listLocation;
    } catch (error) {
        loading.value = 'error'
        list_lokasi.value = [];
        console.error('Error fetching data:', error);
    }
}

// Pengecekan Depresiasi
const cekDepresiasi = () => {
    const year = moment(forms.value.tgl_perolehan).format('YYYY');
    const now_year = moment().format('YYYY');
    if (year >= now_year) {
        forms.value.nilai_depresiasi_awal = 0;
        // console.log(forms.value.nilai_depresiasi_awal);
        disabled_depresiasi.value = true;
    } else {
        // console.log('depresiasi is value');
        disabled_depresiasi.value = false;
        if (params === 'add') {
            forms.value.nilai_depresiasi_awal = null;
        }
    }
}

// Pengecekan Depresiasi
const cekKondisiAsset = (fair, use) => {
    if (fair === 0 || use === 0) {
        if (checked.value == false) {
            disabled_asset_value.value = true;
        } else {
            disabled_asset_value.value = false;
        }
    } else if (fair > 0 || use === 0) {
        if (checked.value == false) {
            disabled_asset_value.value = true;
        } else {
            disabled_asset_value.value = false;
        }
    } else if (fair === 0 || use > 0) {
        if (checked.value == false) {
            disabled_asset_value.value = true;
        } else {
            disabled_asset_value.value = false;
        }
    } else{
        if (checked.value == false) {
            disabled_asset_value.value = true;
        } else {
            disabled_asset_value.value = false;
        }
    }
}

const addForms = (type) => {
    if (type == 'edit') {
        answers.value = type;
        loadAsset();
        loadDropdown();
        // console.log(type)
    } else {
        answers.value = type;
        resetForm()
        loadDropdown();
    }
}

const addsForm = () => {
    // tot_answare.value++;
    forms_spesifikasi.value.push({
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
        id_mis: null,
        id_departemen: null,
        id_pic: null,
        cost_centre: '',
        kondisi: '',
        keterangan: '',
        id_supplier: null,
        id_kode_adjustment: null,
        fairValue: 0,
        valueInUse: 0,
        spesifikasi: [],
    };
    forms_spesifikasi.value = [{nama: "", value: ""}]
}

const backToQuestion = () => {
    router.push({path:'/fix-asset'})
}

const showFile = () => {
    const fileInput = document.getElementById('fileInput');
    // Pastikan ada file yang dipilih
    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files;
        const list = []
        for (let i = 0; i < selectedFile.length; i++) {
            list[i] = {
                id: i+1,
                name: selectedFile[i].name,
                img : selectedFile[i]
            }
        }
        list_gambar.value = list;
        console.log(list)
        status_gambar.value = false
    } else {
        list_gambar.value = []
        status_gambar.value = true
    }
}

const getImageUrl = (file) => {
    return URL.createObjectURL(file);
};

const postDialog = async () => {
    // fill data in var array condition
    forms.value.spesifikasi = forms_spesifikasi.value;
    let formData = new FormData();
    formData.append('id', forms.value.id);
    formData.append('id_grup', forms.value.id_grup);
    formData.append('id_sub_grup', forms.value.id_sub_grup);
    formData.append('nama', forms.value.nama);
    formData.append('brand', forms.value.brand);
    formData.append('masa_manfaat', forms.value.masa_manfaat);
    formData.append('tgl_perolehan', moment(forms.value.tgl_perolehan).format('YYYY-MM-DD'));
    formData.append('nilai_perolehan', forms.value.nilai_perolehan);
    formData.append('nilai_depresiasi_awal', forms.value.nilai_depresiasi_awal);
    formData.append('id_lokasi', forms.value.id_lokasi);
    // formData.append('id_mis', 43037);
    formData.append('id_mis', forms.value.id_mis);
    formData.append('id_departemen', forms.value.id_departemen);
    formData.append('id_pic', forms.value.id_pic);
    formData.append('cost_centre', forms.value.cost_centre);
    formData.append('kondisi', forms.value.kondisi);
    formData.append('keterangan', forms.value.keterangan);
    // formData.append('id_supplier', 1627);
    formData.append('id_supplier', forms.value.id_supplier);
    formData.append('id_kode_adjustment', forms.value.id_kode_adjustment);
    formData.append('fairValue', forms.value.fairValue);
    formData.append('valueInUse', forms.value.valueInUse);
    // formData.append(`spesifikasi`, forms_spesifikasi.value);
    forms_spesifikasi.value.forEach((item, index) => {
        formData.append(`spesifikasi[${index}]`, JSON.stringify(item));
    });
    if (forms.value.id_grup != null && forms.value.id_sub_grup != null && forms.value.nama != '' && forms.value.brand != '' && forms.value.masa_manfaat != '' && forms.value.tgl_perolehan != '' && forms.value.nilai_perolehan != null && forms.value.nilai_depresiasi_awal != null && forms.value.id_lokasi != null && forms.value.id_mis != null && forms.value.id_departemen != null && forms.value.id_pic != null && forms.value.cost_centre != '' && forms.value.kondisi != '' && forms.value.keterangan != '' && forms.value.id_supplier != null && forms.value.id_kode_adjustment != null) {
        const list = list_gambar.value;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                formData.append(`foto[${i}]`, list[i].img);
            }
            if (params == 'add') {
                await AssetsService.addAssets(formData).then(res => {
                    const load = res.data;
                    if (load.code == 200) {
                        toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
                        loading.value = 'loading';
                        setTimeout(backToQuestion, 3000);
                    } else {
                        toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
                    }
                }).catch(error => {
                    console.error(error.response.status);
                    toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
                })
            } else if (params == 'edit') {
                const fileInput = document.getElementById('fileInput');
                if (fileInput.files.length > 0) {
                    for (let i = 0; i < list.length; i++) {
                        formData.append(`foto[${i}]`, list[i].img);
                    }
                }
                await AssetsService.updateAssets(forms.value.id, formData).then(res => {
                    const load = res.data;
                    if (load.code == 200) {
                        toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
                        loading.value = 'loading';
                        setTimeout(backToQuestion, 3000);
                    } else {
                        toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
                    }
                }).catch(error => {
                    console.error(error.response.status);
                    toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
                })
            } else {
                console.log(forms.value);
                console.log(params);
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Delete successfully`, life: 3000 });
                resetForm();
            }
        } else {
            toast.add({ severity: 'warn', summary: 'Attention', detail: `Please entry your images`, life: 3000 });
        }
    } else {
        toast.add({ severity: 'warn', summary: 'Attention', detail: `Please complete your data`, life: 3000 });
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
                <div v-show="loading === 'loading'" >
                    <div class="flex align-items-center justify-content-center">
                        <div>
                            <ProgressSpinner aria-label="Loading"/>
                        </div>
                        <div>
                            <div class="text-gray-500 font-semibold">Please wait ...</div>
                        </div>
                    </div>
                </div>
                <Panel class="my-5" v-show="loading === null">
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
                            <label for="firstname2">Nama Asset <span class="text-red-500">*</span></label>
                            <InputText type="text" v-model="forms.nama" placeholder="Contoh: Laptop Asus Zenbook A15X"/>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Brand <span class="text-red-500">*</span></label>
                            <InputText type="text" v-model="forms.brand" placeholder="Contoh: Asus"/>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Group <span class="text-red-500">*</span></label>
                            <Dropdown v-model="forms.id_grup" :options="list_group" filter optionLabel="nama" optionValue="id_grup" placeholder="Select a Group" @change="loadSubGroup"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Sub Group <span class="text-red-500">*</span></label>
                            <Dropdown v-model="forms.id_sub_grup" :options="list_subgroup" filter optionLabel="nama" optionValue="id_sub_grup" placeholder="Select a Sub Group"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="firstname2">Masa Manfaat <small class="font-semibold">(Bulan)</small><span class="text-red-500">*</span></label>
                            <InputNumber v-model="forms.masa_manfaat" placeholder="0"/>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="firstname2">Tgl Perolehan <span class="text-red-500">*</span></label>
                            <InputText type="date" v-model="forms.tgl_perolehan" @input="cekDepresiasi()"/>
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="firstname2">Nilai Perolehan <span class="text-red-500">*</span></label>
                            <InputNumber v-model="forms.nilai_perolehan" :minFractionDigits="2" :maxFractionDigits="3" placeholder="0.00" />
                        </div>
                        <div class="field col-12 md:col-3">
                            <label for="firstname2">Nilai Depresiasi Awal <span class="text-red-500">*</span></label>
                            <InputNumber v-model="forms.nilai_depresiasi_awal" :minFractionDigits="2" :maxFractionDigits="3" placeholder="0.00" :disabled="disabled_depresiasi"/>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="firstname2">MIS <span class="text-red-500">*</span></label>
                            <AutoComplete v-model="forms.id_mis" :suggestions="list_mis2" optionLabel="nama" optionValue="id_mis" @complete="loadAfterMIS" />
                            <!-- <Dropdown v-model="forms.id_mis" :options="list_mis" filter optionLabel="nama" optionValue="id_mis" placeholder="Select a MIS"></Dropdown> -->
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="firstname2">Lokasi <span class="text-red-500">*</span></label>
                            <Dropdown v-model="forms.id_lokasi" :options="list_lokasi" filter optionLabel="nama" optionValue="id_lokasi" placeholder="Select a Location"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="firstname2">Departemen <span class="text-red-500">*</span></label>
                            <!-- <input-departmen :id_departemen="forms.id_departemen" ></input-departmen> -->
                            <Dropdown v-model="forms.id_departemen" :options="list_departemen" filter optionLabel="nama" optionValue="id_departemen" placeholder="Select a Departemen"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="firstname2">PIC Asset <span class="text-red-500">*</span></label>
                            <Dropdown v-model="forms.id_pic" :options="list_pic" filter optionLabel="nama" optionValue="id_pic" placeholder="Select a PIC"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="firstname2">Cost Center <span class="text-red-500">*</span></label>
                            <Dropdown v-model="forms.cost_centre" :options="list_cost_centre" optionLabel="name" optionValue="cost_centre" placeholder="Select a Cost Center"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-4">
                            <label for="firstname2">Kondisi <span class="text-red-500">*</span></label>
                            <Dropdown v-model="forms.kondisi" :options="list_kondisi" optionLabel="name" optionValue="kondisi" placeholder="Select a Condition"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Supplier <span class="text-red-500">*</span></label>
                            <Dropdown v-model="forms.id_supplier" :options="list_supplier" filter optionLabel="nama" optionValue="id_supplier" placeholder="Select a Supplier"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="firstname2">Adjustment</label>
                            <Dropdown v-model="forms.id_kode_adjustment" :options="list_adjustment" filter optionLabel="nama" optionValue="id_kode_adjustment" placeholder="Select a Adjustment"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-2">
                            <label for="firstname2">Kategori Asset</label>
                            <ToggleButton v-model="checked" onLabel="Asset Besar" offLabel="Asset Kecil" :class="checked === false ? `w-9rem bg-teal-400 text-white border-white` : `w-9rem bg-blue-400 border-white`" @click="cekKondisiAsset(forms.fairValue, forms.valueInUse)" />
                        </div>
                        <div class="field col-12 md:col-5">
                            <label for="firstname2">Fair Value</label>
                            <InputNumber v-model="forms.fairValue" :minFractionDigits="2" :maxFractionDigits="2" placeholder="0.00" :disabled="disabled_asset_value"/>
                        </div>
                        <div class="field col-12 md:col-5">
                            <label for="firstname2">Value In Use</label>
                            <InputNumber v-model="forms.valueInUse" :minFractionDigits="2" :maxFractionDigits="2" placeholder="0.00" :disabled="disabled_asset_value"/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Keterangan <span class="text-red-500">*</span></label>
                            <Textarea v-model="forms.keterangan" autoResize rows="3"/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="foto" class="font-semibold">Capture <span class="text-red-500">*</span> <i class="pi pi-file-import ml-2 text-gray-500"></i></label>
                            <InputText type="file" placeholder="Exp: clothes, files, laptop, etc.." name="lampiran" id="fileInput" accept="image/*" multiple @change="showFile()"/>
                            <!-- <div class="flex flex-row gap-3 mt-2" v-show="status_gambar == false">
                                <div v-for="(list, index) in list_gambar" :key="index" class="flex flex-column">
                                    <span><i class="pi pi-image mr-2"></i>{{ list.name }}</span>
                                    <Image :src="getImageUrl(list.img)" :alt="list.name" width="50" :id="list.name" />
                                </div>
                            </div>
                            <div v-show="status_gambar == true" class="text-center text-gray-400">Gambar tidak tersedia</div> -->
                        </div>
                        <div class="field col-12 md:col-12">
                            <div class="p-fluid formgrid grid mt-4" v-for="(form, index) in forms_spesifikasi" :key="index">
                                <div class="field col-12 md:col-12 grid">
                                    <div class="col-6">
                                        <strong>Spesifikasi <span class="text-red-500">*</span></strong>
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