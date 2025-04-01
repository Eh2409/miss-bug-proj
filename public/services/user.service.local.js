import { storageService } from "./async-storage.service.js";

export const userService = {
    query,
    getById,
    getByUsername,
    add,
    getEmptyCredentials
}

const USER_KEY = 'user_key'
_createUsers()

function query() {
    return storageService.query(USER_KEY)
}

function getById(userId) {
    return storageService.get(USER_KEY, userId)
}

function getByUsername(username) {
    return storageService.query(USER_KEY)
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

function getEmptyCredentials() {
    return {
        userName: '',
        password: '',
        fullname: '',
    }
}


function _createUsers() {
    let users = utilService.loadFromStorage(USER_KEY)
    if (users && users.length > 0) return

    users = [
        {
            userName: 'muki',
            password: '344366743',
            fullname: 'muki maka',
            _id: "a11"
        },
        {
            userName: 'puki',
            password: 'cv345',
            fullname: 'puki nuki',
            _id: "a12"
        },
        {
            userName: 'shuki',
            password: '2345f',
            fullname: 'shuki shaka',
            _id: "a13"
        },
    ]
    utilService.saveToStorage(USER_KEY, users)
}