import { BugLabelsPicker } from "../cmps/BugLabelsPicker.jsx"
import { bugService } from "../services/bug.service.remote.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, useParams } = ReactRouterDOM

export function BugCompose() {

    const [bug, setBug] = useState({ ...bugService.getEmpyBug() })
    const [bugEditLabels, setBugEditLabels] = useState(null)
    console.log('bug-after-save:', bug)

    const navigate = useNavigate()
    const { bugId } = useParams()

    useEffect(() => {
        if (bugId) {
            setBugToEdit(bugId)
        }
    }, [bugId])

    function setBugToEdit(bugId) {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
                setBugEditLabels([...bug.labels])
            })
            .catch(err => {
                showErrorMsg(`Cannot load bug`, err)
                navigate('/bug')
            })
    }

    function handleChange({ target }) {
        var { name, value } = target
        if (name === 'severity') value = +value

        setBug(prev => ({ ...prev, [name]: value }))
    }

    function onSaveLabels(labelsPicked) {
        setBug(prev => ({ ...prev, labels: labelsPicked }))
    }

    function onSaveBug(ev) {
        ev.preventDefault()
        console.log('bug-save:', bug)
        bugService.save(bug)
            .then(() => {
                showSuccessMsg(bug._id ? 'Bug updated' : 'Bug added')
            })
            .catch(err => showErrorMsg(bug._id ? `Cannot update bug` : `Cannot add bug`, err))
            .finally(() => navigate('/bug'))
    }

    const { title, description, severity } = bug
    console.log('bug.labels:', bug.labels)

    return (
        <section className="compose-bug main-content">

            <header>
                <h2>{bugId ? "Edit Bug" : "Add Bug"}</h2>
                <button type="button" onClick={() => { navigate('/bug') }}>Back to List</button>
            </header>

            <form onSubmit={onSaveBug}>
                <label htmlFor="title">Title :</label>
                <input type="text" id="title" name="title" value={title} onChange={handleChange} placeholder="Enter bug title" required />
                <label htmlFor="description">Description :</label>
                <textarea type="text" id="description" name="description" value={description} onChange={handleChange} placeholder="Enter bug description" required />
                <label htmlFor="severity">Severity :</label>
                <input type="number" id="severity" name="severity" value={severity || ''} min={1} max={5} onChange={handleChange} placeholder="Enter bug severity" required />
                <div>Labels :</div>
                <BugLabelsPicker labels={bug.labels} onSaveLabels={onSaveLabels} bugEditLabels={bugEditLabels} />
                <button className="save-btn">Save</button>
            </form>
        </section>
    )
}