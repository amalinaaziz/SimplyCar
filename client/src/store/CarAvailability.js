import CarAvailabilityDataService from "../services/CarAvailabilityDataService"
export default {
    state: {
        availability: [],
        availabilityPagination: {}
    },
    getters: {
        availability: state => {
            return state.availability
        },
        availabilityPagination: state => {
            return state.availabilityPagination
        }
    },
    mutations: {
        SET_AVAILABILITY (state, availability) {
            state.availability = availability
        },
        ADD_AVAILABILITY (state, newAvailability) {
            state.availability.unshift(newAvailability)
        },
        UPDATE_AVAILABILITY (state, updatedAvailability) {
            const index = state.availability.findIndex(availability => availability.id === updatedAvailability.id)
            if (index !== -1) {
                state.availability.splice(index, 1, updatedAvailability)
            }
        },
        DELETE_AVAILABILITY (state, id) {
            state.availability = state.availability.filter((availability) => availability.id !== id)
        },
        SET_AVAILABILITY_PAGINATION (state, pagination) {
            state.availabilityPagination = pagination
        }
    },
    actions: {
         async fetchAvailability ({ commit }, options) {
            await CarAvailabilityDataService.getAll(options)
                .then((response) => {
                    commit('SET_AVAILABILITY', response.data.data)
                    commit('SET_AVAILABILITY_PAGINATION', response.data.pagination)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        async addAvailability ({ commit }, availability) {
            await CarAvailabilityDataService.create(availability)
                .then((response) => {
                    commit('ADD_AVAILABILITY', response.data.data)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        async updateAvailability ({ commit }, updatedAvailability) {
            await CarAvailabilityDataService.update(updatedAvailability.id, updatedAvailability)
                .then(() => {
                    commit('UPDATE_AVAILABILITY', updatedAvailability)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        async deleteAvailability ({ commit }, id) {
            await CarAvailabilityDataService.delete(id)
                .then(() => {
                    commit('DELETE_AVAILABILITY', id)
                })
                .catch((e) => {
                    console.log(e)
                })

        }
    }
}