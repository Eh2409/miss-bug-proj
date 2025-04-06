export function BugPreview({ bug }) {
    return <article className="bug-preview">
        <div className="title">
            <span>{bug.title}</span>

            {bug.labels.length > 0 &&

                bug.labels.map(label => <button key={label} className="bug-label">{label}</button>)

            }
        </div>
        <div className="severity">
            <span>Severity:</span>
            <span className={`severity-num${bug.severity}`}>{bug.severity}</span>
        </div>
    </article>
}