<script setup>
    import { onMounted, ref, defineProps, defineEmits } from 'vue';
    import { month, formAssetDept, listKondisi } from '@/api/DataVariable';
    import moment from 'moment';

    // API
    import AreaService from '@/api/AreaService';
    import UserService from '@/api/UserService';
    import AssetsService from '@/api/AssetsService';
    
    // Props
    const props = defineProps({
        nomor_dialog:{
            type:String
        },
        status_dialog:{
            type:String
        },
        data_dialog:{
            type:Array
        },
        in_props: String, // Change the type to match your prop type
    });

    // Emit from Index.vue
    const emit = defineEmits(['submit'])

    // Variable
    const status = props.status_dialog;
    const datas = props.data_dialog;
    const expandedRows = ref([]);
    const roles = ref(localStorage.getItem('roles'));
    // Forms
    const forms = ref(formAssetDept);
    const forms_spesifikasi = ref([{nama: "", value: ""}]);

    // Dropdown Variable
    const list_pic = ref([])
    const list_kondisi = ref(listKondisi)
    const list_lokasi = ref([])

    // Data Table
    const list_data = ref(null)

    onMounted(() => {
        loadData();
    });

    // Function
    const loadData = async() => {
        console.log(datas);
        forms.value = {
            id: datas.id,
            nama: datas.nama,
            brand: datas.brand,
            id_lokasi: datas.id_lokasi,
            kondisi: datas.kondisi,
            tgl_serah: moment().format('YYYY-MM-DD'),
            keterangan: datas.keterangan,
            id_pic: Number(datas.id_pic),
        } 
        const spek = datas.spesifikasi;
        const list = [];
        for (let i = 0; i < spek.length; i++) {
            list[i] = {
                nama: spek[i].nama,
                value: spek[i].value
            }
        }
        forms_spesifikasi.value = list;
        // emit('submit');
        loadLocation();
        loadUser();
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
                listLocation[i] = {nama: location_data[i].nama + ' (' + location_data[i].area.nama + ')', id_lokasi: location_data[i].id}
            }
            list_lokasi.value = listLocation;
        } catch (error) {
            loading.value = 'error'
            list_lokasi.value = [];
            console.error('Error fetching data:', error);
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

    const postData = (ket) => {
        forms.value.spesifikasi = forms_spesifikasi.value;
        AssetsService.updateDeptFixedAsset(forms.value.id,forms.value).then(res => {
            const load = res.data;
            if (load.code == 200) {
                emit('submit', ket)
            } else {
                emit('submit', 'warning')
            }
        }).catch(error => {
            emit('submit', 'error')
            console.error(error.response.status);
        })
    }


</script>

<template>
    <div class="grid px-4">
        <div class="field col-12 md:col-6 p-fluid">
            <label for="firstname2">Nama Asset <span class="text-red-500">*</span></label>
            <InputText type="text" v-model="forms.nama" placeholder="Contoh: Laptop Asus Zenbook A15X"/>
        </div>
        <div class="field col-12 md:col-6 p-fluid">
            <label for="firstname2">Brand <span class="text-red-500">*</span></label>
            <InputText type="text" v-model="forms.brand" placeholder="Contoh: Asus"/>
        </div>
        <div class="field col-12 md:col-6 p-fluid">
            <label for="firstname2">Lokasi <span class="text-red-500">*</span></label>
            <Dropdown v-model="forms.id_lokasi" :options="list_lokasi" filter optionLabel="nama" optionValue="id_lokasi" placeholder="Select a Location"></Dropdown>
        </div>
        <div class="field col-12 md:col-6 p-fluid">
            <label for="firstname2">PIC Asset <span class="text-red-500">*</span></label>
            <Dropdown v-model="forms.id_pic" :options="list_pic" filter optionLabel="nama" optionValue="id_pic" placeholder="Select a PIC"></Dropdown>
        </div>
        <div class="field col-12 md:col-6 p-fluid">
            <label for="firstname2">Tanggal Serah Terima <span class="text-red-500">*</span></label>
            <InputText type="date" v-model="forms.tgl_serah" placeholder="Contoh: Laptop Asus Zenbook A15X"/>
        </div>
        <div class="field col-12 md:col-6 p-fluid">
            <label for="firstname2">Kondisi <span class="text-red-500">*</span></label>
            <Dropdown v-model="forms.kondisi" :options="list_kondisi" optionLabel="name" optionValue="kondisi" placeholder="Select a Condition"></Dropdown>
        </div>
        <div class="field col-12 md:col-12 p-fluid">
            <label for="firstname2">Keterangan <span class="text-red-500">*</span></label>
            <Textarea v-model="forms.keterangan" autoResize rows="3"/>
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
        <div class="field col-12 md:col-12 text-right">
            <Button :label="'No'" icon="pi pi-times" @click="postData('no')" class="p-button-outlined p-button-danger mr-2" />
            <Button label="Save" icon="pi pi-save" class="p-button-outlined p-button-success" autofocus @click="postData('save')" />
        </div>
    </div>
</template>