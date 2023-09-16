<script setup>
    import { onMounted, ref, defineProps } from 'vue';
    import { month, formFairValue } from '@/api/DataVariable';

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

    const loadData = async() => {
        if (status === 'calculate') {
            list_table.value = datas;
        } else if (status === 'value') {
            // Data Fair Value
            loadingTable.value = 'Loading ...';
            const fairValue = await AssetsService.getFairValue(datas.id);
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

            // Data Value In Use
            loadingTable2.value = 'Loading ...';
            const valueInUse = await AssetsService.getValueInUse(datas.id);
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
                    id_asset: dataFV[i].id_fixed_asset,
                    nilai: dataVIU[i].nilai,
                    disabled: dis_trash,
                }
            }
            list_table2.value = list2;
        } else {
            list_table.value = []
        }
    }

    loadData();

    // Format Curency
    const formatCurrency = (value) => {
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };
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
            <h6 class="font-semibold">LIST FAIR VALUE</h6>
            <h6 class="font-semibold text-md" v-show="loadingTable !== null">{{loadingTable}}</h6>
            <DataTable showGridlines :value="list_table" editMode="row" dataKey="id" tableClass="editable-cells-table" v-show="loadingTable === null">
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
                        <span class="text-xs">Nilai</span>
                    </template>
                    <template #body="{ data }">
                        <InputNumber v-model="nilaiFV.nilai" v-if="statusAssetValue == 'edit_fv' " :minFractionDigits="2" :maxFractionDigits="3" placeholder="0.00" />
                        <span class="text-sm" v-else>{{ formatCurrency(Number(data.nilai)) }}</span>
                    </template>
                </Column>
                <!-- <Column style="width: 30%; min-width: 10%" bodyStyle="text-align:center">
                    <template #body="{ data }">
                        <div v-if="statusAssetValue != 'edit_fv' " class="flex justify-content-center flex-wrap">
                            <Button icon="pi pi-pencil" severity="warning" class="mr-2" outlined @click="postTable('edit_fv',data)" size="small"/>
                            <Button icon="pi pi-trash" severity="danger" outlined @click="postTable('hapus_fv',data)" size="small" :disabled="data.disabled"/>
                        </div>
                        <div v-else class="flex justify-content-center flex-wrap">
                            <Button icon="pi pi-save" severity="success" class="mr-2" outlined @click="postTable('save_fv',data)" size="small"/>
                            <Button icon="pi pi-times" severity="secondary" outlined @click="postTable('back_fv',data)" size="small"/>
                        </div>
                    </template>
                </Column> -->
            </DataTable>
        </div>
        <div class="col-12 md:col-6">
            <h6 class="font-semibold">LIST VALUE IN USE</h6>
            <h6 class="font-semibold text-md" v-show="loadingTable2 !== null">{{loadingTable2}}</h6>
            <DataTable showGridlines :value="list_table2" editMode="row" dataKey="id" tableClass="editable-cells-table" v-show="loadingTable2 === null">
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
                        <span class="text-xs">Nilai</span>
                    </template>
                    <template #body="{ data }">
                        <span class="text-sm">{{ formatCurrency(data.nilai) }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" />
                    </template>
                </Column>
                <!-- <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column> -->
            </DataTable>
        </div>
    </div>
</template>