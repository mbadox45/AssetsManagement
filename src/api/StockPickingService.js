import http from './http-odoo-auth'

export default new class StockPickingService{

    // MIS
    getMis(){
        return http.get('mis/index');
    }
    getMisID(id){
        return http.get(`mis/get/${id}`);
    }
}