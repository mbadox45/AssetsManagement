import http from './http-auth2'

export default new class UserService{
    getUsers(){
        return http.get('user');
    }
    getUsersID(id){
        return http.get(`user/get/${id}`);
    }
    activeUser(id){
        return http.get(`user/active/${id}`);
    }
    resetPasswordUser(id){
        return http.get(`reset-password/${id}`);
    }

    // Departement
    getDept(){
        return http.get(`department`);
    }
}