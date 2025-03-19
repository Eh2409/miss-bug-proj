import { bugService } from './services/bugService.js'
import express from 'express'
const app = express()

app.get('/', (req, res) => res.send('Hello there'))

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
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
            res.status(500).send('cannot save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            res.status(500).send('cannot find bug')
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('bug removed'))
        .catch(err => {
            res.status(500).send('cannot remove bug')
        })
})


const port = 3030
app.listen(port, () => console.log(`Server ready at port http://127.0.01:${port}`))