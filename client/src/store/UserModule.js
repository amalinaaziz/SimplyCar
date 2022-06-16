import UserDataService from "../services/UserDataService"

export default {
    state: {
        users: [],
        userList: [],
        userPagination: {}
    },
    getters: {
        users: state => {
            return state.users
        },
        userList: state => {
            return state.userList
        },
        userPagination: state => {
            return state.userPagination
        }
    },
    mutations: {
        SET_USERS (state, users) {
            state.users = users
        },
        SET_USERS_LIST (state, users) {
            state.userList = users
        },
        ADD_USERS (state, newUser) {
            console.log('ADD_USERS => newUser', newUser, state.users)
            state.users.unshift(newUser)
        },
        UPDATE_USERS (state, updatedUser) {
            const index = state.users.findIndex(user => user.id === updatedUser.id)
            if (index !== -1) {
                state.users.splice(index, 1, updatedUser)
            }
        },
        DELETE_USERS (state, id) {
            state.users = state.users.filter((user) => user.id !== id)
        },
        SET_USER_PAGINATION (state, pagination) {
            state.userPagination = pagination
        }
    },
    actions: {
        async fetchUsers ({ commit }, options) {
            await UserDataService.getAll(options)
                .then((response) => {
                    commit('SET_USERS', response.data.data)
                    commit('SET_USER_PAGINATION', response.data.pagination)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        async listUsers ({ commit }, options) {
            await UserDataService.getList(options)
                .then((response) => {
                    commit('SET_USERS_LIST', response.data.data)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        async addUser ({ commit }, user) {
            await UserDataService.create(user)
                .then((response) => {
                    commit('ADD_USERS', response.data.data)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        async updateUser ({ commit }, updatedUser) {
            await UserDataService.update(updatedUser.id, updatedUser)
                .then(() => {
                    commit('UPDATE_USERS', updatedUser)
                })
                .catch((e) => {
                    console.log(e)
                })
        },
        async deleteUser ({ commit }, id) {
            await UserDataService.delete(id)
                .then(() => {
                    commit('DELETE_USERS', id)
                })
                .catch((e) => {
                    console.log(e)
                })

        }
    }
}