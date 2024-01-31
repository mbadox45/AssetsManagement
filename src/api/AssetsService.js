import http from './http-auth'
import http_multipart from './http-multipart'

export default new class AssetsService{
    // Fixed Assets
    addAssets(data){
        return http_multipart.post(`fixed-asset/add`, data);
    }
    updateAssets(id_asset,data){
        return http_multipart.post(`fixed-asset/update/${id_asset}`, data);
    }
    getAssets(data){
        return http.post(`fixed-asset`, data);
    }
    getAssetsByID(id_asset, data){
        return http.post(`fixed-asset/get/${id_asset}`, data);
    }
    toggleActive(id_asset){
        return http.get(`fixed-asset/active/${id_asset}`);
    }

    // Fair Value Asset
    getFairValue(id_asset){
        return http.get(`fair-value/asset/${id_asset}`);
    }
    addFairValue(id_asset, data){
        return http.post(`fair-value/add/${id_asset}`, data);
    }
    updateFairValue(id_asset, id, data){
        return http.post(`fair-value/update/${id_asset}/${id}`, data);
    }
    deleteFairValue(id_asset, id){
        return http.delete(`fair-value/delete/${id_asset}/${id}`);
    }

    // Value In Use Asset
    getValueInUse(id_asset){
        return http.get(`value-in-use/asset/${id_asset}`);
    }
    addValueInUse(id_asset, data){
        return http.post(`value-in-use/add/${id_asset}`, data);
    }
    updateValueInUse(id_asset, id, data){
        return http.post(`value-in-use/update/${id_asset}/${id}`, data);
    }
    deleteValueInUse(id_asset, id){
        return http.delete(`value-in-use/delete/${id_asset}/${id}`);
    }

    // Asset by Dept
    getDeptFixedAsset(){
        return http.get(`dept-fixed-asset`);
    }
    getDeptFixedAssetByID(id_asset){
        return http.get(`dept-fixed-asset/get/${id_asset}`);
    }
    // Update + Create BAST
    updateDeptFixedAsset(id_asset,data){
        return http.post(`dept-fixed-asset/update/${id_asset}`, data);
    }
}