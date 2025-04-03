import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'


import path from 'path'
import express from 'express'

const app = express()

app.use(express.static('public'))

import cookieParser from 'cookie-parser'
import { authService } from './services/auth.service.js'
app.use(cookieParser())

app.use(express.json())

// app.get('/', (req, res) => res.send('Hello there'))

// bug api

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
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send(`can't add bug`)

    const { title, description, severity, labels } = req.body
    if (!title || severity === undefined) return res.status(400).send('Missing required fields')

    const bugToSave = {
        title,
        description,
        severity: +severity || 1,
        labels: labels || [],
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('cannot add bug', err)
            res.status(500).send('annot add bug')
        })
})

app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send(`can't update bug`)

    const { title, description, severity, labels, _id } = req.body
    if (!_id || !title || severity === undefined) return res.status(400).send('Missing required fields')

    const bugToSave = {
        _id,
        title,
        description,
        severity: +severity,
        labels: labels || [],
    }

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
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send(`can't delete bug`)

    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('bug removed'))
        .catch(err => {
            loggerService.error('cannot remove bug', err)
            res.status(500).send('cannot remove bug')
        })
})

// user api
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('cannot load users', err)
            res.status(500).send('cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('cannot load user', err)
            res.status(500).send('cannot load user')
        })
})

// auth api

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    authService.checkLogin(credentials)
        .then(user => {
            const loginToken = authService.getLogginToken(user)
            res.cookie('loginToken', loginToken)
            console.log(user);
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Invalid credentials', err)
            res.status(400).send('Invalid credentials')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body

    userService.add(credentials)
        .then(user => {
            if (user) {
                const loginToken = authService.getLogginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot singup')
            }
        })
        .catch(err => {
            loggerService.error('Username taken', err)
            res.status(400).send('Username taken')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out')
})


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const port = 3030
app.listen(port, () => loggerService.info(`Server ready at port http://127.0.01:${port}`))