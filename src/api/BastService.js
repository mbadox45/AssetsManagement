import http from './http-auth'

export default new class BastService{
    getBastByPIC(){
        return http.get('bast-fixed-asset/index-pic');
    }
    getBastPICByID(id){
        return http.get(`bast-fixed-asset/show-pic/${id}`);
    }
    getBastReject(id){
        return http.get(`bast-fixed-asset/reject/${id}`);
    }
    getApproveAccept(id_bast){
        return http.get(`bast-fixed-asset/accept/${id_bast}`);
    }
    getApproveCheck(id_bast){
        return http.get(`bast-fixed-asset/check/${id_bast}`);
    }
}