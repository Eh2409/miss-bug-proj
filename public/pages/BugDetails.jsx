const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM


import { bugService } from '../services/bug.service.remote.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    console.log(bug);

    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => setBug(bug))
            .catch(err => showErrorMsg(`Cannot load bug`, err))
    }, [])


    return <div className="bug-details main-content">
        <h3>Bug Details</h3>
        {!bug && <p className="loading">Loading....</p>}
        {
            bug &&
            <div className='bug-info'>
                <h4>{bug.title}</h4>
                {bug.labels.length > 0 &&
                    <div>
                        <span className='labels-title'>labels:</span>

                        {bug.labels.map(label => <button key={label} className="bug-label">{label}</button>)}
                    </div>

                }
                <div className="severity">
                    <span>Severity:</span>
                    <span className={`severity-num${bug.severity}`}>{bug.severity}</span>
                </div>
                <p>Description: <span>{bug.description}</span></p>
            </div>
        }
        <hr />
        <Link to="/bug"><button>Back to List</button></Link>
    </div>

}