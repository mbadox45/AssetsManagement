import http from './http-auth'

export default new class AdjustmentService{
    getAdjustment(){
        return http.get('adjustment');
    }
    getAdjustmentID(id){
        return http.get(`adjustment/get/${id}`);
    }

    addAdjustment(data){
        return http.post(`adjustment/add`, data);
    }
    updateAdjustment(id,data){
        return http.post(`adjustment/update/${id}`, data);
    }
}