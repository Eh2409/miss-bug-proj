import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

import path from 'path'
import express from 'express'

const app = express()

app.use(express.static('public'))

import cookieParser from 'cookie-parser'
app.use(cookieParser())

app.use(express.json())

// app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bug', (req, res) => {

    console.log('serever ', req.query);

    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        labels: req.query.labels || '',
        pageIdx: (req.query.pageIdx !== undefined) ? +req.query.pageIdx : undefined,
    }

    const sortBy = {
        sortType: req.query.sortType || '',
        sortDir: req.query.sortDir || 0,
    }

    bugService.query(filterBy, sortBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('cannot load bugs', err)
            res.status(500).send('cannot load bugs')
        })
})

app.post('/api/bug', (req, res) => {
    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('cannot add bug', err)
            res.status(500).send('cannot add bug')
        })
})

app.put('/api/bug/:bugId', (req, res) => {
    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('cannot update bug', err)
            res.status(500).send('cannot update bug')
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


app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('bug removed'))
        .catch(err => {
            loggerService.error('cannot remove bug', err)
            res.status(500).send('cannot remove bug')
        })
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const port = 3030
app.listen(port, () => loggerService.info(`Server ready at port http://127.0.01:${port}`))