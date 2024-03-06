import http_odoo from './http-odoo-auth'
import http from './http-auth'

export default new class SupplierService{

    // From Odoo DB
    getSupplierFromOdoo(){
        return http_odoo.get('supplier/index');
    }
    getSupplierIDFromOdoo(id){
        return http_odoo.get(`supplier/get/${id}`);
    }

    // From Local
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