import axios from "axios";
import { URL_API_Portal } from "./env";

const http = axios.create({
    baseURL: URL_API_Portal,
})

class VerifyService{
    getUser(id,headers){
        return http.get(`user/get/${id}`, headers);
    }
    getAksesApp(app_id,headers){
        return http.get(`akses/app/get/${app_id}`, headers);
    }
}

export default new VerifyService;