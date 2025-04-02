import { userService } from "./user.service.local.js"

export const authService = {
    login,
    signup,
    logout,
    getLoggedinUser,
}

const KEY_LOGGEDIN_USER = 'loggedinUser'

function login({ username, password }) {
    console.log(username, password);
    return userService.getByUsername(username)
        .then(user => {
            if (user && user.password === password) return _setLoggedinUser(user)
            return Promise.reject('Invalid login')
        })
}

function signup(user) {
    return userService.add(user)
        .then(_setLoggedinUser)
        .catch(err => Promise.reject(err))
}

function logout() {
    sessionStorage.removeItem(KEY_LOGGEDIN_USER)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(KEY_LOGGEDIN_USER)
    )
}


function _setLoggedinUser(user) {
    console.log(user);

    const userToSave = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        isAdmin: user.isAdmin
    }

    console.log('user to save', userToSave);

    sessionStorage.setItem(KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}