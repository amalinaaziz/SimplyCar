import {mainAxios as http} from "../http-common";
import {objectToQueryString} from "../helper/api"
class CarDataService {
    getAll (pagination) {
        return http.get(`/vehicles?${objectToQueryString(pagination)}`);
    }

    get (id) {
        return http.get(`/vehicles/${id}`);
    }

    getList () {
        return http.get(`/vehicles/all`);
    }

    getFeatured () {
        return http.get(`/vehicles/featured`);
    }

    create (data) {
        return http.post("/vehicles", data);
    }

    update (id, data) {
        return http.put(`/vehicles/${id}`, data);
    }

    delete (id) {
        return http.delete(`/vehicles/${id}`);
    }

    deleteAll () {
        return http.delete(`/vehicles`);
    }
}

export default new CarDataService();