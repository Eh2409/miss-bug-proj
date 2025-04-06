import Cryptr from "cryptr"
import { userService } from "./user.service.js"

const crypter = new Cryptr(process.env.SECRET1 || 'secret-bug-1020')

export const authService = {
    checkLogin,
    getLogginToken,
    validateToken,
}

function checkLogin({ username, password }) {
    return userService.getByUsername(username)
        .then(user => {
            if (user && user.password === password) {
                user = { ...user }
                delete user.password
                return Promise.resolve(user)
            }
            return Promise.reject('Invalid login')
        })
}


function getLogginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = crypter.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    if (!token) return null

    const str = crypter.decrypt(token)
    const user = JSON.parse(str)
    return user
}

