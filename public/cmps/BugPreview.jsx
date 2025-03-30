export function BugPreview({ bug }) {
    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        <div className="severity">
            <span>Severity:</span>
            <span>{bug.severity}</span>
            <span className={`level severity${bug.severity}`}></span>
        </div>
    </article>
}