import moment from "moment/moment";
const date_now = moment().format('DD-MM-YYYY')
const date_ago =  moment().subtract(10, 'days').format('DD-MM-YYYY');

// API
// import GroupService from "./GroupService";

// List for dropdown
export const listAkses = [
    { name: 1, level_akses: 1 },
    { name: 2, level_akses: 2 },
    { name: 3, level_akses: 3 },
    { name: 4, level_akses: 4 },
    { name: 5, level_akses: 5 },
    { name: 6, level_akses: 6 },
    { name: 7, level_akses: 7 },
    { name: 8, level_akses: 8 },
    { name: 9, level_akses: 9 },
    { name: 10, level_akses: 10 },
];
export const listRequired = [
    { name: 'Required', require: 1 },
    { name: 'Optional', require: 0 },
];
export const listCategory = [
    { name: 'Kategori 1', category_id: 1 },
    { name: 'Kategori 2', category_id: 2 },
    { name: 'Kategori 3', category_id: 3 },
];
export const typeAnswer = [
    { name: 'Text (Type: Text)', type: 'text', icon:'/layout/icon/textinput.png' },
    { name: 'Text (Type: Number)', type: 'number', icon:'/layout/icon/number.png' },
    { name: 'Checkbox', type: 'checkbox', icon:'/layout/icon/checkbox.png' },
    { name: 'Radio', type: 'radio', icon:'/layout/icon/radio.png' },
    { name: 'Dropdown', type: 'dropdown', icon:'/layout/icon/dropdown.png' },
    { name: 'File', type: 'file', icon:'/layout/icon/file.png' },
    { name: 'Range', type: 'range', icon:'/layout/icon/range.png' },
];
export const listKondisi = [
    { name: 'Baru', kondisi: 'baru' },
    { name: 'Baik', kondisi: 'baik' },
    { name: 'Rusak', kondisi: 'rusak' },
    { name: 'Perbaikan', kondisi: 'perbaikan' },
    { name: 'Lelang', kondisi: 'lelang' },
];
export const listCostCentre = [
    { name: 'Auxilary', cost_centre: 'Auxiliary' },
    { name: 'Refinery', cost_centre: 'Refinery' },
    { name: 'Fractination', cost_centre: 'Fractination' },
    { name: 'Packaging', cost_centre: 'Packaging' },
];

export const fieldFixedPengakuan = [
    { name: 'Kode Aktiva', code: 'KA' },
    { name: 'Kode Penyusutan', code: 'KP' },
    { name: 'Debet', code: 'DE' },
];

export const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Menu Pertanyaan
export const settingPertanyaan = [
    {
        label: 'Options',
        items: [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
                }
            }
        ]
    },
    {
        label: 'Navigate',
        items: [
            {
                label: 'Vue Website',
                icon: 'pi pi-external-link',
                url: 'https://vuejs.org/'
            },
            {
                label: 'Router',
                icon: 'pi pi-upload',
                to: '/fileupload'
            }
        ]
    }
];


// Breadcrumb Variable
export const BreadcrumbHome =  { icon: 'pi pi-home', to: '/home' };

// Variable default Forms
export const formAdjustment = {
    id: 0,
    nama_margin: '',
    kode_margin: '',
    nama_loss: '',
    kode_loss: '',
}
export const formArea = {
    id: 0,
    nama_area: '',
    locations: [],
}
export const formSupplier = {
    id: 0,
    nama: '',
    kode: '',
    keterangan: '',
}
export const formGroup = {
    id: 0,
    nama_grup: '',
    kode_aktiva_tetap: '',
    kode_akm_penyusutan: '',
    format: '',
    subGroups: [],
}
export const formAssetDept = {
    id: null,
    tgl_serah: '',
    nama: '',
    brand: '',
    id_lokasi: null,
    id_pic: null,
    kondisi: '',
    keterangan: '',
    spesifikasi: [],
}
export const formAsset = {
    id: 0,
    id_grup: null,
    id_sub_grup: null,
    nama: '',
    brand: '',
    masa_manfaat: '',
    tgl_perolehan: '',
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
}
export const formSurvey = {
    id: 0,
    desc: '',
    title: '',
    from: '',
    to: '',
    order_sp:[],
    value:[],
    question_order:'',
}
export const formCategory = {
    id: 0,
    name: '',
}
export const formFairValue = {
    id: null,
    id_asset: null,
    nilai: null,
}
export const formValueInUse = {
    id: null,
    id_asset: null,
    nilai: null,
}
export const formQuestion = {
    id: 0,
    category_id: 0,
    question: null,
    type: null,
    require: null,
    value:[],
    desc:[],
    extra:[],
}


// Data Bodong
// export const listGroup = GroupService.getGroupData;

export const FormPreview = [
    {
        id:1,
        chapter:'Tingkat Kepentingan',
        categories:[
            {
                category_id:1,
                category:'Misi Dunia',
                survey:[
                    {
                        id:1,
                        pertanyaan:'Apa yang terjadi jika DMS tidak ada di muka bumi ini?',
                        type: 'text',
                        require:1,
                        jawaban: ''
                    },
                    {
                        id:2,
                        pertanyaan:'Apa saja yg di berbuat DMS untuk membawa perdamaian dunia?',
                        type: 'option',
                        require:0,
                        jawaban: [
                            {desc:'Menyelamatkan bumi dari kiamat sugra', value: 1},
                            {desc:'Menghancurkan dunia dan seisinya', value: 2},
                        ]
                    },
                ],
            },
            {
                category_id:2,
                category:'Visi Dunia',
                survey:[
                    {
                        id:3,
                        pertanyaan:'Mengapa DMS harus ada di bumi ini?',
                        type: 'text',
                        require:1,
                        jawaban: ''
                    },
                    {
                        id:4,
                        pertanyaan:'Bagaimana cara DMS bisa menyelamatkan dunia dari perang dunia?',
                        type: 'option',
                        require:1,
                        jawaban: [
                            {desc:'Kentut berjama`ah', value: 1},
                            {desc:'Bertanya kepada ahlinya dan melempar tanggung jawabnya ke oranglain', value: 2},
                            {desc:'Akhlak BUMN', value: 3},
                        ]
                    },
                ],
            },
        ]
    },
    {
        id:2,
        chapter:'Tingkat Kepuasan thd. Supplier Lain Sejenis',
        categories:[
            {
                category_id:1,
                category:'Misi Dunia',
                survey:[
                    {
                        id:1,
                        pertanyaan:'Apa yang terjadi jika DMS tidak ada di muka bumi ini?',
                        type: 'text',
                        require:1,
                        jawaban: ''
                    },
                    {
                        id:2,
                        pertanyaan:'Apa saja yg di berbuat DMS untuk membawa perdamaian dunia?',
                        type: 'option',
                        require:0,
                        jawaban: [
                            {desc:'Menyelamatkan bumi dari kiamat sugra', value: 1},
                            {desc:'Menghancurkan dunia dan seisinya', value: 2},
                        ]
                    },
                ],
            },
            {
                category_id:2,
                category:'Visi Dunia',
                survey:[
                    {
                        id:3,
                        pertanyaan:'Mengapa DMS harus ada di bumi ini?',
                        type: 'text',
                        require:1,
                        jawaban: ''
                    },
                    {
                        id:4,
                        pertanyaan:'Bagaimana cara DMS bisa menyelamatkan dunia dari perang dunia?',
                        type: 'option',
                        require:1,
                        jawaban: [
                            {desc:'Kentut berjama`ah', value: 1},
                            {desc:'Bertanya kepada ahlinya dan melempar tanggung jawabnya ke oranglain', value: 2},
                            {desc:'Akhlak BUMN', value: 3},
                        ]
                    },
                ],
            },
        ]
    },
]