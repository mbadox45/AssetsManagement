import http from './http-auth'

export default new class JournalService{
    // Pengakuan
    getPengakuan(){
        return http.get(`journal/asset-recognition`);
    }

    // Depresiasi
    getDepresiasi(){
        return http.get(`journal/asset-depreciation`);
    }

    // Koreksi
    getFairValue(data){
        return http.post(`journal/asset-correction-fair-value`, data);
    }
    getValueInUse(data){
        return http.post(`journal/asset-correction-value-in-use`, data);
    }
}