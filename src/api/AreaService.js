import http from './http-auth'

export default new class AreaService{

    // Area
    getArea(){
        return http.get('area');
    }
    getAreaID(id){
        return http.get(`area/get/${id}`);
    }

    addArea(data){
        return http.post(`area/add`, data);
    }
    updateArea(id,data){
        return http.post(`area/update/${id}`, data);
    }

    // Location
    getLocation(){
        return http.get('location');
    }
    getLocationID(id){
        return http.get(`location/get/${id}`);
    }
    getLocationByAreaID(id){
        return http.get(`location/area/${id}`);
    }
}