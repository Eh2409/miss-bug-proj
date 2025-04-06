import fs from 'fs'
import { utilService } from './util.service.js'
import { bugService } from './bug.service.js'


export const userService = {
    query,
    getById,
    getByUsername,
    add,
    remove,
}

const users = utilService.readJsonFile('data/user.json')

function query() {
    const userToReturn = users.map(user => {
        return ({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            isAdmin: user.isAdmin,
        })
    })
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
    var user = users.find(user => user.username === username)
    return Promise.resolve(user)
}

function add(user) {
    const { username, fullname, password } = user

    if (!username || !fullname || !password) {
        return Promise.reject('Incomplete credentials')
    }

    return getByUsername(username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('Username taken')

            user._id = utilService.makeId()
            user.isAdmin = false
            users.unshift(user)

            return _saveUsersToFile()
                .then(() => {
                    user = { ...user }
                    delete user.password
                    return user
                })
        })
}

function remove(userId, loggedinUser) {
    const userIdx = users.findIndex(user => user._id === userId)
    if (userIdx === -1) return Promise.reject('cannot remove user - ' + userId)

    if (!loggedinUser.isAdmin) {
        return Promise.reject('Not Admin')
    }

    return _isUserHaveBug(userId)
        .then(isUserHaveBug => {
            if (isUserHaveBug) return Promise.reject('cannot remove user that own bug')

            users.splice(userIdx, 1)
            return _saveUsersToFile()
        })
}

function _isUserHaveBug(userId) {
    return bugService.query()
        .then(data => data.bugs.some(bug => bug.creator._id === userId))
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