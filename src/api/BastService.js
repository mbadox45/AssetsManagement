import http from './http-auth'

export default new class BastService{
    getBastByPIC(){
        return http.get('bast-fixed-asset/index-pic');
    }
    getBastByPIC(id){
        return http.get(`bast-fixed-asset/show-pic/${id}`);
    }
    getBastReject(id){
        return http.get(`bast-fixed-asset/reject/${id}`);
    }
    getApproveAccept(){
        return http.get('bast-fixed-asset/accept/1');
    }
    getApproveCheck(){
        return http.get(`bast-fixed-asset/check/1`);
    }
}