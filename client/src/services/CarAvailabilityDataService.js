import {mainAxios as http} from "../http-common";
import {objectToQueryString} from "../helper/api"

class CarAvailabilityDataService {
    getAll (pagination) {
        return http.get(`/vehicle-availabilities?${objectToQueryString(pagination)}`);
    }

    get (id) {
        return http.get(`/vehicle-availabilities/${id}`);
    }

    create (data) {
        return http.post("/vehicle-availabilities", data);
    }

    update (id, data) {
        return http.put(`/vehicle-availabilities/${id}`, data);
    }

    delete (id) {
        return http.delete(`/vehicle-availabilities/${id}`);
    }

    deleteAll () {
        return http.delete(`/vehicle-availabilities`);
    }
}

export default new CarAvailabilityDataService();