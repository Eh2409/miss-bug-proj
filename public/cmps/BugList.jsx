
const { Link } = ReactRouterDOM

import { authService } from '../services/auth.service.remote.js'
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug }) {
    const user = authService.getLoggedinUser()

    function isAllowed(bug) {
        if (!user) return false
        if (user._id === bug.creator._id) return true

        return false
    }

    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <Link to={`/bug/${bug._id}`}><button>Details</button></Link>
                    {isAllowed(bug) && <Link to={`/bug/edit/${bug._id}`}><button>Edit</button></Link>}
                    {isAllowed(bug) && <button onClick={() => onRemoveBug(bug._id)}>X</button>}
                </section>
            </li>
        ))}
    </ul >
}
