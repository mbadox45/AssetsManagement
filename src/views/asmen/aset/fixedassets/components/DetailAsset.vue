<script setup>
    import { onMounted, ref, defineProps } from 'vue';
    import { month, formFairValue } from '@/api/DataVariable';
    import moment from 'moment';

    // API
    import AssetsService from '@/api/AssetsService';
    
    // Variable
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
    const status = props.status_dialog;
    const datas = props.data_dialog;
    const expandedRows = ref([]);
    const roles = ref(localStorage.getItem('roles'));

    // Data Table
    const list_data = ref(null)

    const loadData = async() => {
        list_data.value = datas;
        if (roles.value > 8) {
            list_data.value.nilai_depresiasi_awal = formatCurrency();
            list_data.value.monthlyDepreciation = formatCurrency();
            list_data.value.annualDepreciation = formatCurrency();
            list_data.value.accumulatedDepreciation = formatCurrency();
            list_data.value.nilai_perolehan = formatCurrency();
            list_data.value.bookValue = formatCurrency();
            // Calculate
            // list_data.value.initialBalanceThisYear = formatCurrency();
            // list_data.value.totalThisYear = formatCurrency();
            // list_data.value.totalAccumulationUntilThisYear = formatCurrency();
            
            // list_data.value.initialBalanceThisYear = formatCurrency();
        }
        // console.log(datas);
        // console.log(roles.value);
    }

    loadData();

    // Format Curency
    const formatCurrency = (value) => {
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };
</script>

<template>
    <div class="grid p-fluid px-4">
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
                        <div class="col-8" >: {{ list_data.lokasi }}</div>
                        <div class="col-4" v-show="roles > 8">Cost Centre</div>
                        <div class="col-8" v-show="roles > 8">: {{ list_data.cost_centre }}</div>
                    </div>
                </div>
                <div class="col-12 md:col-6 sm:col-6">
                    <div class="grid">
                        <div class="col-4">Area</div>
                        <div class="col-8">: {{ list_data.area }}</div>
                        <div class="col-4">Tgl Perolehan</div>
                        <div class="col-8">: {{ list_data.tgl_perolehan }}</div>
                        <div class="col-4">Masa Manfaat</div>
                        <div class="col-8">: {{ list_data.masa_manfaat }} Bulan</div>
                        <div class="col-4">Usia Asset</div>
                        <div class="col-8">: {{ list_data.assetAge }} Bulan</div>
                        <div class="col-4" v-show="roles > 8">Supplier</div>
                        <div class="col-8" v-show="roles > 8">: <strong>{{ list_data.supplier }}</strong></div>
                        <div class="col-4">Keterangan</div>
                        <div class="col-8">: {{ list_data.keterangan }}</div>
                    </div>
                </div>
                <div class="col-12 md:col-12 sm:col-12">
                    <h6 class="text-md">Spesifikasi: </h6>
                    <DataTable :value="list_data.spesifikasi" showGridlines tableStyle="min-width: 50rem">
                        <Column field="nama" header="Jenis Spesifikasi"></Column>
                        <Column field="value" header="Keterangan"></Column>
                    </DataTable>
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
</template>