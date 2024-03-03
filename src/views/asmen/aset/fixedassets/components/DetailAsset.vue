<script setup>
    import { onMounted, ref, defineProps } from 'vue';
    import { month, formFairValue } from '@/api/DataVariable';
    import moment from 'moment';

    // API
    import AssetsService from '@/api/AssetsService';
    import { URL_API } from '@/api/env';
    
    // Variable
    const props = defineProps({
        nomor_dialog:{
            type:String
        },
        status_dialog:{
            type:String
        },
        tgl:{
            type:String
        },
        data_dialog:{
            type:Array
        },
        in_props: String, // Change the type to match your prop type
    });
    const tanggal = props.tgl;
    const datas = props.data_dialog;
    const expandedRows = ref([]);
    const roles = ref(localStorage.getItem('roles'));
    const loading = ref(true)

    // Data Table
    const list_data = ref(null)
    const list_spek = ref([])
    const list_foto = ref([])

    const loadData = async() => {
        try {
            const asset = await AssetsService.getAssetsByID(datas.id,{tanggal:tanggal});
            const response = asset.data;
            const data = response.data;
            list_data.value = data;
            const foto = data.foto_fixed_assets;
            // console.log(foto)
            
            // Spek
            if (foto.length > 0) {
                list_spek.value = data.spesifikasi.map(item => JSON.parse(item));
                const list =[];
                for (let i = 0; i < foto.length; i++) {
                    list[i] = {
                        id: foto[i].id, name: foto[i].nama_file, img: `${foto[i].nama_file}`,
                    }
                }
                list_foto.value = list
            } else {
                list_foto.value = []
                list_spek.value = data.spesifikasi
            }

            // calculateInitialBalance
            if (roles.value > 8) {
                const convertedData = [];
                for (const year in data.calculateInitialBalance) {
                    const yearData = data.calculateInitialBalance[year];
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
                list_data.value.calculateInitialBalance=convertedData
            }
            
            loading.value = false
        } catch (error) {
            loading.value = false
            list_data.value = null;
            list_foto.value = []

        }
    }
    onMounted(() => {
        loadData();
    })

    // Format Curency
    const formatCurrency = (value) => {
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };
</script>

<template>
    <div v-show="loading === true" >
        <div class="flex align-items-center justify-content-center">
            <div>
                <ProgressSpinner aria-label="Loading" style="width: 50px; height: 50px" strokeWidth="8"/>
            </div>
            <div>
                <div class="text-gray-500 font-semibold">Please wait ...</div>
            </div>
        </div>
    </div>
    <div v-show="loading === false" >
        <div class="grid p-fluid px-4" v-if="list_data != null">
            <div class="col-12">
                <h5 class="text-lg">DETAIL DATA : </h5>
                <div class="grid px-4">
                    <div class="col-12 md:col-6 sm:col-6">
                        <div class="grid">
                            <div class="col-4">Nama Asset</div>
                            <div class="col-8">: {{ list_data.nama }}</div>
                            <div class="col-4">Brand</div>
                            <div class="col-8">: <strong>{{ list_data.brand }}</strong></div>
                            <div class="col-4">Kondisi</div>
                            <div class="col-8">: {{ list_data.kondisi.toUpperCase() }}</div>
                            <div class="col-4">PIC</div>
                            <div class="col-8">: <strong>{{ list_data.assetUserName }}</strong></div>
                            <div class="col-4">Lokasi</div>
                            <div class="col-8" >: {{ list_data.location.nama }}</div>
                            <div class="col-4" v-show="roles > 8">Cost Centre</div>
                            <div class="col-8" v-show="roles > 8">: {{ list_data.cost_centre }}</div>
                        </div>
                    </div>
                    <div class="col-12 md:col-6 sm:col-6">
                        <div class="grid">
                            <div class="col-4">Area</div>
                            <div class="col-8">: {{ list_data.location.area.nama }}</div>
                            <div class="col-4">Tgl Perolehan</div>
                            <div class="col-8">: {{ list_data.tgl_perolehan }}</div>
                            <div class="col-4">Masa Manfaat</div>
                            <div class="col-8">: {{ list_data.masa_manfaat }} Bulan</div>
                            <div class="col-4">Usia Asset</div>
                            <div class="col-8">: {{ list_data.assetAge }} Bulan</div>
                            <div class="col-4" v-show="roles > 8">Supplier</div>
                            <div class="col-8" v-show="roles > 8">: <strong>{{ list_data.supplier.nama }}</strong></div>
                            <div class="col-4">MIS</div>
                            <div class="col-8">: {{ list_data.assetMIS }}</div>
                        </div>
                    </div>
                    <div class="col-12 md:col-12 sm:col-12">
                        <div>
                            <h6 class="text-md">Spesifikasi: </h6>
                            <DataTable :value="list_spek" showGridlines tableStyle="min-width: 50rem">
                                <Column field="nama" header="Jenis Spesifikasi"></Column>
                                <Column field="value" header="Keterangan"></Column>
                            </DataTable>
                        </div>
                        <div class="mt-3" v-show="list_foto.length > 0">
                            <h6 class="text-md">Foto Asset: </h6>
                            <div class="flex flex-row px-3 py-2 gap-2 align-items-center">
                                <div v-for="(foto, index) in list_foto" :key="index">
                                    <Image :src="foto.img" :alt="foto.name" width="120" preview  />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12" v-show="roles >= 9">
                <h5 class="text-lg">JURNAL AKTIVA : </h5>
                <div class="grid px-4">
                    <div class="col-12 md:col-6 sm:col-6">
                        <div class="grid">
                            <div class="col-4">Nilai Depresiasi Awal</div>
                            <div class="col-8">: {{ list_data.nilai_depresiasi_awal }}</div>
                            <div class="col-4">Depresiasi Perbulan</div>
                            <div class="col-8">: {{ list_data.monthlyDepreciation }}</div>
                            <div class="col-4">Depresiasi Tahun Terakhir</div>
                            <div class="col-8">: {{ list_data.annualDepreciation }}</div>
                            <div class="col-4">Akumulasi Depresiasi</div>
                            <div class="col-8">: {{ list_data.accumulatedDepreciation }}</div>
                        </div>
                    </div>
                    <div class="col-12 md:col-6 sm:col-6">
                        <div class="grid">
                            <div class="col-4">Kode Aktiva</div>
                            <div class="col-8">: <strong class="text-red-400">{{ list_data.formated_kode_aktiva }}</strong></div>
                            <div class="col-4">Kode Depresiasi</div>
                            <div class="col-8">: <strong class="text-red-400">{{ list_data.formated_kode_penyusutan }}</strong></div>
                            <div class="col-4">Nilai Perolehan</div>
                            <div class="col-8">: {{ list_data.nilai_perolehan }}</div>
                            <div class="col-4">Nilai Buku</div>
                            <div class="col-8">: {{ list_data.bookValue }}</div>
                        </div>
                    </div>
                    <div class="col-12 md:col-12 sm:col-12">
                        <h6 class="text-md">Perhitungan Nilai Saldo Awal : </h6>
                        <DataTable v-model:expandedRows="expandedRows" :value="list_data.calculateInitialBalance" class="p-datatable-sm">
                            <Column frozen expander style="width: 3rem" />
                            <Column field="year" header="Year" sortable>
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.year }}</span>
                                </template>
                            </Column>
                            <Column field="initialBalanceThisYear" header="Initial Balance" sortable>
                                <template #body="{data}">
                                    {{ formatCurrency(data.initialBalanceThisYear) }}
                                </template>
                            </Column>
                            <Column field="totalThisYear" header="Total" sortable>
                                <template #body="{data}">
                                    {{ formatCurrency(data.totalThisYear) }}
                                </template>
                            </Column>
                            <Column field="totalAccumulationUntilThisYear" header="Total Acumulate" sortable>
                                <template #body="{data}">
                                    {{ formatCurrency(data.totalAccumulationUntilThisYear) }}
                                </template>
                            </Column>
                            <template #expansion="slotProps">
                                <div class="p-3">
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
                                </div>
                            </template>
                        </DataTable>
                    </div>
                    <div class="col-12 md:col-12 sm:col-12">
                        <h6 class="text-md">Nilai Asset : </h6>
                        <div class="grid px-3">
                            <div class="col-6">
                                <h6 class="text-md font-normal">List Nilai Wajar : </h6>
                                <DataTable :value="list_data.fair_values" class="p-datatable-sm">
                                    <Column field="nilai" header="Nilai">
                                        <template #body="{data}">
                                            {{ formatCurrency(Number(data.nilai)) }}
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                            <div class="col-6">
                                <h6 class="text-md font-normal">List Nilai Dalam Penggunaan : </h6>
                                <DataTable :value="list_data.value_in_uses" class="p-datatable-sm">
                                    <Column field="nilai" header="Nilai">
                                        <template #body="{data}">
                                            {{ formatCurrency(Number(data.nilai)) }}
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <h3 class="text-center">Data Not Found</h3>
        </div>
    </div>
</template>