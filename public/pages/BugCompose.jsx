import { BugLabelsPicker } from "../cmps/BugLabelsPicker.jsx"
import { bugService } from "../services/bug.service.remote.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"



const { useState, useEffect, useRef } = React
const { useNavigate } = ReactRouterDOM

export function BugCompose(props) {

    const [bug, setBug] = useState({ ...bugService.getEmpyBug() })

    const navigate = useNavigate()

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
        bugService.save(bug)
            .then(() => {
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
            .finally(() => navigate('/bug'))
    }

    const { title, description, severity, labels } = bug


    return (
        <section className="compose-bug main-content">

            <header>
                <h2>Add Bug</h2>
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
                <BugLabelsPicker labels={labels} onSaveLabels={onSaveLabels} />
                <button className="save-btn">Save</button>
            </form>
        </section>
    )
}