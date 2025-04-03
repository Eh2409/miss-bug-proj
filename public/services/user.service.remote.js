import { storageService } from "./async-storage.service.js";


export const userService = {
    query,
    getById,
    getByUsername,
    add,
    remove,
    getEmptyCredentials
}

const BASE_URL = '/api/user/'

function query() {
    return axios.get(BASE_URL).then(res => res.data)
}

function getById(userId) {
    return axios.get(BASE_URL + userId).then(res => res.data)
}

function getByUsername(username) {
    return axios.get(BASE_URL).then(res => res.data)
        .then(users => users.find(user => user.username === username))
}

function add(user) {
    const { username, password, fullname } = user
    if (!username || !password || !fullname) return Promise.reject('Missing required fields')

    return getByUsername(username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('Username taken')

            return storageService.post(USER_KEY, user)
                .then(user => {
                    delete user.password
                    return user
                })
        })
}

function remove(userId) {
    return axios.delete(BASE_URL + userId).then(res => res.data)
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: '',
    }
}

