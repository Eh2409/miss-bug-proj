import { utilService } from "./util.service.js"
import fs from 'fs'

export const bugService = {
    query,
    getById,
    remove,
    save
}

const bugs = utilService.readJsonFile('data/bugs.json')

const PAGE_SIZE = 4

function query(filterBy = {}, sortBy = {}) {

    console.log(filterBy, sortBy);

    return Promise.resolve(bugs)
        .then(bugs => {

            if (filterBy.userId) {
                bugs = bugs.filter(bug => bug.creator._id !== filterBy.userId)
            }

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            if (filterBy.labels) {
                bugs = bugs.filter(bug =>
                    bug.labels.some(label => filterBy.labels.includes(label))
                )
            }

            if (sortBy) {
                if (sortBy.sortType === 'title') {
                    bugs = bugs.sort((b1, b2) => b1.title.localeCompare(b2.title))
                } else if (sortBy.sortType === 'severity') {
                    bugs = bugs.sort((b1, b2) => (b1.severity - b2.severity) * sortBy.sortDir)
                } else if (sortBy.sortType === 'createdAt') {
                    bugs = bugs.sort((b1, b2) => (b1.createdAt - b2.createdAt) * sortBy.sortDir)
                }
            }

            const maxPageCount = Math.ceil(bugs.length / PAGE_SIZE)

            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }

            return { bugs, maxPageCount }
        })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('cannot remove bug - ' + bugId)

    if (!loggedinUser.isAdmin && loggedinUser._id !== bugs[bugIdx].creator._id) {
        return Promise.reject('Not your bug')
    }

    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave, loggedinUser) {
    if (bugToSave._id) {

        console.log(loggedinUser)

        if (!loggedinUser.isAdmin && loggedinUser._id !== bugToSave.creator._id) {
            return Promise.reject('Not your bug')
        }

        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[idx] = { ...bugs[idx], ...bugToSave }
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugToSave.creator = loggedinUser
        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}