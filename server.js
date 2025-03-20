import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

import express from 'express'
const app = express()

import cookieParser from 'cookie-parser'
app.use(cookieParser())

app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bug', (req, res) => {

    console.log(req.query)

    const filterBy = { txt: req.query.txt, minSeverity: +req.query.minSeverity }

    bugService.query()
        .then(bugs => {

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('cannot load bugs', err)
            res.status(500).send('cannot load bugs')
        })
})

app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
        severity: +req.query.severity,
        createdAt: Date.now()
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('cannot save bug', err)
            res.status(500).send('cannot save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    const visitedBugs = req.cookies.visitedBugs || []
    if (visitedBugs.length >= 3) {
        return res.status(401).send('Wait for a bit')
    } else if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
    }
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })
    console.log(`User visited at the following bugs: [${visitedBugs}]`)


    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('cannot load bug', err)
            res.status(500).send('cannot load bug')
        })
})


app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('bug removed'))
        .catch(err => {
            loggerService.error('cannot remove bug', err)
            res.status(500).send('cannot remove bug')
        })
})


const port = 3030
app.listen(port, () => loggerService.info(`Server ready at port http://127.0.01:${port}`))