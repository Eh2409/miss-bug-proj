export function BugPreview({ bug }) {
    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        <div className="severity">
            <span>Severity:</span>
            <span className={`severity-num${bug.severity}`}>{bug.severity}</span>
        </div>
    </article>
}