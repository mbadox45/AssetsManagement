import http from './http-auth'

export default new class SupplierService{
    getSupplier(){
        return http.get('supplier');
    }
    getSupplierID(id){
        return http.get(`supplier/get/${id}`);
    }

    addSupplier(data){
        return http.post(`supplier/add`, data);
    }
    updateSupplier(id,data){
        return http.post(`supplier/update/${id}`, data);
    }
}