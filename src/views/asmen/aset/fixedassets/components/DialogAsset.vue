<script setup>
    import { onMounted, ref, defineProps } from 'vue';
    import { month, formFairValue, formValueInUse } from '@/api/DataVariable';

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

    // Data Table
    const list_table = ref([])
    const list_table2 = ref([])
    const loadingTable = ref(null)
    const loadingTable2 = ref(null)

    // Form Data
    const form_fairValue = ref(formFairValue)
    const disabled_fairValue = ref(true)
    const status_form_fairValue = ref('add_fv')
    const form_valueInUse = ref(formValueInUse)
    const disabled_valueInUse = ref(true)
    const status_form_valueInUse = ref('add_viu')

    const loadData = async() => {
        if (status === 'calculate') {
            list_table.value = datas;
        } else if (status === 'value') {
            // Data Fair Value
            console.log(datas)
            const dataFV = datas.fair_value;
            const list = [];
            for (let i = 0; i < dataFV.length; i++) {
                let dis_trash = false;
                if (i === 0) {
                    dis_trash = true
                }
                list[i] = {
                    no: i+1,
                    id: dataFV[i].id,
                    id_asset: dataFV[i].id_fixed_asset,
                    nilai: dataFV[i].nilai,
                    disabled: dis_trash,
                }
            }
            list_table.value = list;
            f_fairValue();

            // Data Value In Use
            const dataVIU = datas.value_in_uses;
            const list2 = [];
            for (let i = 0; i < dataVIU.length; i++) {
                let dis_trash = false;
                if (i === 0) {
                    dis_trash = true
                }
                list2[i] = {
                    no: i+1,
                    id: dataVIU[i].id,
                    id_asset: dataFV[i].id_fixed_asset,
                    nilai: dataVIU[i].nilai,
                    disabled: dis_trash,
                }
            }
            list_table2.value = list2;
            f_valueInUse();
        } else {
            list_table2.value = [];
            list_table.value = [];
        }
    }

    const loadFairValue = async() => {
        loadingTable.value = 'Loading ...';
        try {
            const fairValue = await AssetsService.getFairValue(datas.id_asset);
            const dataFV = fairValue.data.data;
            if (dataFV.length > 0) {
                loadingTable.value = null;
            } else {
                loadingTable.value = 'Data not found';
            }
            const list = [];
            for (let i = 0; i < dataFV.length; i++) {
                let dis_trash = false;
                if (i === 0) {
                    dis_trash = true
                }
                list[i] = {
                    no: i+1,
                    id: dataFV[i].id,
                    id_asset: dataFV[i].id_fixed_asset,
                    nilai: dataFV[i].nilai,
                    disabled: dis_trash,
                }
            }
            list_table.value = list;
        } catch (error) {
            loadingTable.value = 'Unauthorized access';
            list_table.value = [];
        }
    }

    const loadValueInUse = async() => {
        loadingTable2.value = 'Loading ...';

        try {
            const valueInUse = await AssetsService.getValueInUse(datas.id_asset);
            const dataVIU = valueInUse.data.data;
            if (dataVIU.length > 0) {
                loadingTable2.value = null;
            } else {
                loadingTable2.value = 'Data not found';
            }
            const list2 = [];
            for (let i = 0; i < dataVIU.length; i++) {
                let dis_trash = false;
                if (i === 0) {
                    dis_trash = true
                }
                list2[i] = {
                    no: i+1,
                    id: dataVIU[i].id,
                    id_asset: dataVIU[i].id_fixed_asset,
                    nilai: dataVIU[i].nilai,
                    disabled: dis_trash,
                }
            }
            list_table2.value = list2;
        } catch (error) {
            loadingTable2.value = 'Unauthorized access';
            list_table2.value = [];
        }
    }

    onMounted(() => {
        loadData();
        // disFairValue()
    })


    // Format Curency
    const formatCurrency = (value) => {
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    const disFairValue = () => {
        if (form_fairValue.value.nilai != null && form_fairValue.value.nilai != '') {
            disabled_fairValue.value = false
        } else {
            disabled_fairValue.value = true
        }
    }

    const disValueInUse = () => {
        if (form_fairValue.value.nilai != null && form_fairValue.value.nilai != '') {
            disabled_fairValue.value = false
        } else {
            disabled_fairValue.value = true
        }
    }

    // Refresh Form
    const f_fairValue = () => {
        status_form_fairValue.value = 'add_fv'
        form_fairValue.value = {
            id: null,
            id_asset: datas.id_asset,
            nilai: null,
        }
        // disFairValue()
    } 
    const f_valueInUse = () => {
        status_form_valueInUse.value = 'add_viu'
        form_valueInUse.value = {
            id: null,
            id_asset: datas.id_asset,
            nilai: null,
        }
        // disValueInUse();
    }

    // Get Edit Form
    const fe_fairValue = (stats, item) => {
        status_form_fairValue.value = stats
        form_fairValue.value = {
            id: item.id,
            id_asset: item.id_asset,
            nilai: item.nilai,
        }
    } 
    const fe_valueInUse = (stats, item) => {
        status_form_valueInUse.value = stats
        form_valueInUse.value = {
            id: item.id,
            id_asset: item.id_asset,
            nilai: item.nilai,
        }
    }

    // Post Data
    const postTable = (stat) => {
        if (stat === 'add_fv') {
            console.log(stat, form_fairValue.value)
            AssetsService.addFairValue(form_fairValue.value.id_asset, {nilai: form_fairValue.value.nilai}).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    loadFairValue();
                    f_fairValue();
                } else {
                    loadFairValue();
                }
            }).catch(error => {
                console.error(error.response.status);
            })
        } else if (stat === 'add_viu') {
            console.log(stat, form_valueInUse.value)
            AssetsService.addValueInUse(form_valueInUse.value.id_asset, {nilai: form_valueInUse.value.nilai}).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    loadValueInUse();
                    f_valueInUse()
                } else {
                    loadValueInUse();
                }
            }).catch(error => {
                console.error(error.response.status);
            })
        } else if (stat === 'edit_fv') {
            console.log(stat, form_fairValue.value)
            AssetsService.updateFairValue(form_fairValue.value.id_asset, form_fairValue.value.id, {nilai: form_fairValue.value.nilai}).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    loadFairValue();
                    f_fairValue();
                } else {
                    loadFairValue();
                }
            }).catch(error => {
                console.error(error.response.status);
            })
        } else if (stat === 'edit_viu') {
            console.log(stat, form_valueInUse.value)
            AssetsService.updateValueInUse(form_valueInUse.value.id_asset, form_valueInUse.value.id, {nilai: form_valueInUse.value.nilai}).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    loadValueInUse();
                    f_valueInUse();
                } else {
                    loadValueInUse();
                }
            }).catch(error => {
                console.error(error.response.status);
            })
        } else if (stat === 'delete_fv') {
            console.log(stat, form_fairValue.value)
        } else {
            console.log(stat, form_valueInUse.value)
        }
    }

    const deleteTable = (stat, item) => {
        if (stat === 'delete_fv') {
            console.log(stat, item)
            AssetsService.deleteFairValue(item.id_asset, item.id).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    loadFairValue();
                } else {
                    loadFairValue();
                }
            }).catch(error => {
                console.error(error.response.status);
            })
        } else {
            console.log(stat, item)
            AssetsService.deleteValueInUse(item.id_asset, item.id).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    loadValueInUse();
                } else {
                    loadValueInUse();
                }
            }).catch(error => {
                console.error(error.response.status);
            })
        }
    }
</script>

<template>
    <div class="grid p-fluid" v-if="status === 'calculate'">
        <div class="col-12">
            <DataTable v-model:expandedRows="expandedRows" :value="list_table" class="p-datatable-sm">
                <Column frozen expander style="width: 3rem" />
                <Column field="year" sortable>
                    <template #header>
                        <span class="text-xs">Year</span>
                    </template>
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
    </div>
    <div class="grid p-fluid" v-else-if="status === 'value'">
        <div class="col-12 md:col-6">
            <div class="grid">
                <div class="col-6">
                    <h6 class="font-semibold">LIST FAIR VALUE</h6>
                </div>
                <div class="col-6 text-right">
                    <span class="font-normal text-sm text-red-400">Please reset ( <i class="pi pi-refresh text-sm text-gray-900"></i> ) to add fair value</span>
                </div>
            </div>
            <h6 class="font-semibold text-md" v-show="loadingTable !== null">{{loadingTable}}</h6>
            <DataTable showGridlines :value="list_table" editMode="row" dataKey="id" tableClass="p-datatable-sm" v-show="loadingTable === null">
                <Column>
                    <template #header>
                        <span class="text-xs">No</span>
                    </template>
                    <template #body="{ data }">
                        <span class="text-sm">{{ data.no }}</span>
                    </template>
                </Column>
                <Column field="nilai">
                    <template #header>
                        <div class="field w-full">
                            <label for="firstname2" class="text-sm">{{ status_form_fairValue === 'add_fv' ? 'Tambah' : status_form_fairValue === 'edit_fv' ? 'Edit' : ''}}</label>
                            <InputNumber v-model="form_fairValue.nilai" :minFractionDigits="2" :maxFractionDigits="3" placeholder="Nilai"/>
                        </div>
                    </template>
                    <template #body="{ data }">
                        <span class="text-sm">{{ formatCurrency(Number(data.nilai)) }}</span>
                    </template>
                </Column>
                <Column style="width: 30%; min-width: 8%" headerStyle="text-align:center;" >
                    <template #header>
                        <div class="flex justify-content-center flex-wrap w-full">
                            <Button icon="pi pi-save" severity="primary" class="mr-2" outlined size="small" @click="postTable(status_form_fairValue)"/>
                            <Button icon="pi pi-refresh" severity="secondary" outlined size="small" @click="f_fairValue"/>
                        </div>
                    </template>
                    <template #body="{ data }">
                        <div class="flex justify-content-center flex-wrap" >
                            <Button icon="pi pi-pencil" severity="warning" class="mr-2" outlined @click="fe_fairValue('edit_fv',data)" size="small"/>
                            <Button icon="pi pi-trash" severity="danger" outlined @click="deleteTable('delete_fv',data)" size="small" :disabled="data.disabled"/>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <div class="col-12 md:col-6">
            <div class="grid">
                <div class="col-6">
                    <h6 class="font-semibold">LIST VALUE IN USE</h6>
                </div>
                <div class="col-6 text-right">
                    <span class="font-normal text-sm text-red-400">Please reset ( <i class="pi pi-refresh text-sm text-gray-900"></i> ) to add value in use</span>
                </div>
            </div>
            <h6 class="font-semibold text-md" v-show="loadingTable2 !== null">{{loadingTable2}}</h6>
            <DataTable showGridlines :value="list_table2" editMode="row" dataKey="id" tableClass="p-datatable-sm" v-show="loadingTable2 === null">
                <Column>
                    <template #header>
                        <span class="text-xs">No</span>
                    </template>
                    <template #body="{ data }">
                        <span class="text-sm">{{ data.no }}</span>
                    </template>
                </Column>
                <Column field="nilai">
                    <template #header>
                        <div class="field w-full">
                            <label for="firstname2" class="text-sm">{{ status_form_valueInUse === 'add_viu' ? 'Tambah' : status_form_valueInUse === 'edit_viu' ? 'Edit' : 'Delete'}}</label>
                            <InputNumber v-model="form_valueInUse.nilai" :minFractionDigits="2" :maxFractionDigits="3" placeholder="Nilai"/>
                        </div>
                        <!-- <span class="text-xs">Nilai</span> -->
                    </template>
                    <template #body="{ data }">
                        <span class="text-sm">{{ formatCurrency(Number(data.nilai)) }}</span>
                    </template>
                </Column>
                <Column style="width: 30%; min-width: 8%" headerStyle="text-align:center;" >
                    <template #header>
                        <div class="flex justify-content-center flex-wrap w-full">
                            <Button icon="pi pi-save" severity="primary" class="mr-2" outlined size="small" @click="postTable(status_form_valueInUse)"/>
                            <Button icon="pi pi-refresh" severity="secondary" outlined size="small" @click="f_valueInUse"/>
                        </div>
                    </template>
                    <template #body="{ data }">
                        <div class="flex justify-content-center flex-wrap" >
                            <Button icon="pi pi-pencil" severity="warning" class="mr-2" outlined @click="fe_valueInUse('edit_viu',data)" size="small"/>
                            <Button icon="pi pi-trash" severity="danger" outlined @click="deleteTable('delete_viu', data)" size="small" :disabled="data.disabled"/>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>