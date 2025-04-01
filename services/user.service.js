import fs from 'fs'
import { utilService } from './util.service.js'


export const userService = {
    query,
    getById,
    getByUsername,
    add,
    remove,
}

const users = utilService.readJsonFile('data/user.json')

function query() {
    const userToReturn = users.map(user => ({ _id: user._id, fullname: user.fullname }))
    return Promise.resolve(userToReturn)
}

function getById(userId) {
    var user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('cannot find user - ' + bugId)
    user = { ...user }
    delete user.password
    return Promise.resolve(user)
}

function getByUsername(username) {
    const user = users.find(user => user.username === username)
    return Promise.resolve(user)
}

function add(user) {
    return getByUsername(username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('Username taken')

            user._id = utilService.makeId()
            users.unshift(user)
            return _saveUsersToFile()
                .then(() => {
                    user = { ...user }
                    delete user.password
                    return user
                })
        })
}

function remove(userId) {
    users = users.find(user => user._id !== userId)
    return _saveUsersToFile()
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 4)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}