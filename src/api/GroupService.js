import http from './http-auth'

export default new class GroupService{
    // Group
    getGroup(){
        return http.get('group');
    }
    getGroupID(id){
        return http.get(`group/get/${id}`);
    }

    addGroup(data){
        return http.post(`group/add`, data);
    }
    updateGroup(id,data){
        return http.post(`group/update/${id}`, data);
    }

    // Sub Group
    getSubGroup(){
        return http.get('sub-group');
    }
    getSubGroupID(id){
        return http.get(`sub-group/get/${id}`);
    }
    getSubGroupByGroupID(id){
        return http.get(`sub-group/group/${id}`);
    }
}