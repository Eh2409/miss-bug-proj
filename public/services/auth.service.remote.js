
export const authService = {
    login,
    signup,
    logout,
    getLoggedinUser,
}

const KEY_LOGGEDIN_USER = 'loggedinUser'
const BASE_URL = '/api/auth/'

function login({ username, password }) {
    return axios.post(BASE_URL + 'login', { username, password }).then(res => res.data)
        .then(_setLoggedinUser)
}

function signup({ username, password, fullname }) {
    return axios.post(BASE_URL + 'signup', { username, password, fullname }).then(res => res.data)
        .then(_setLoggedinUser)
        .catch(err => Promise.reject(err))
}

function logout() {
    return axios.post(BASE_URL + 'logout')
        .then(() => sessionStorage.removeItem(KEY_LOGGEDIN_USER))
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(KEY_LOGGEDIN_USER)
    )
}


function _setLoggedinUser(user) {
    const { _id, username, fullname, isAdmin } = user

    const userToSave = {
        _id,
        username,
        fullname,
        isAdmin,
    }

    sessionStorage.setItem(KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}