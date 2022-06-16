import CarDataService from "../services/CarDataService"
export default {
    state: {
        cars: [],
        carList: [],
        carPagination: {}
    },
    getters: {
        cars: state => {
            return state.cars
        },
        carList: state => {
            return state.carList
        },
        carPagination: state => {
            return state.carPagination
        }
    },
    mutations: {
        SET_CARS (state, cars) {
            state.cars = cars
        },
        SET_CARS_LIST (state, cars) {
            state.carList = cars.map(car => { return {...car, ...(car.id ? { _id: car.id } : {_id: car._id })}})
        },
        ADD_CAR (state, newCar) {
            state.cars.unshift(newCar)
        },
        UPDATE_CAR (state, updatedCar) {
            const index = state.cars.findIndex(car => car.id === updatedCar.id)
            if (index !== -1) {
                state.cars.splice(index, 1, updatedCar)
            }
        },
        DELETE_CAR (state, id) {
            state.cars = state.cars.filter((car) => car.id !== id)
        },
        SET_CAR_PAGINATION (state, pagination) {
            state.carPagination = pagination
        }
    },
    actions: {
        async fetchCars ({ commit }, options) {
            await CarDataService.getAll(options)
                .then((response) => {
                    commit('SET_CARS', response.data.data)
                    commit('SET_CAR_PAGINATION', response.data.pagination)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        async listCars ({ commit }, options) {
            await CarDataService.getList(options)
                .then((response) => {
                    commit('SET_CARS_LIST', response.data.data)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        async addCar ({ commit }, car) {
            await CarDataService.create(car)
                .then((response) => {
                    commit('ADD_CAR', response.data.data)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        async updateCar ({ commit }, updatedCar) {
            await CarDataService.update(updatedCar.id, updatedCar)
                .then(() => {
                    commit('UPDATE_CAR', updatedCar)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        async deleteCar ({ commit }, id) {
            await CarDataService.delete(id)
                .then(() => {
                    commit('DELETE_CAR', id)
                })
                .catch((e) => {
                    console.log(e)
                })

        }
    }
}