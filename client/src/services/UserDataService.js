import {mainAxios as http} from "../http-common";
import {objectToQueryString} from "../helper/api"

class UserDataService {
    getAll (pagination) {
        return http.get(`/users?${objectToQueryString(pagination)}`);
    }

    getList () {
        return http.get(`/users/all`);
    }

    get (id) {
        return http.get(`/users/${id}`);
    }

    create (data) {
        return http.post("/users", data);
    }

    update (id, data) {
        return http.put(`/users/${id}`, data);
    }

    delete (id) {
        return http.delete(`/users/${id}`);
    }

    deleteAll () {
        return http.delete(`/users`);
    }
}

export default new UserDataService();