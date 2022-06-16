import axios from "axios";

const mainAxios = axios.create({
    baseURL: 'http://localhost:8080/api/'
});
    
export {
  mainAxios
};