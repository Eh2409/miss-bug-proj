const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug }) {

    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id} className={`severity${bug.severity}`}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <Link to={`/bug/${bug._id}`}><button>Details</button></Link>
                    <Link to={`/bug/edit/${bug._id}`}><button>Edit</button></Link>
                    <button onClick={() => onRemoveBug(bug._id)}>x</button>
                </section>
            </li>
        ))}
    </ul >
}
