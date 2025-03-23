const { Link } = ReactRouterDOM

export function Home() {
    return <section className="home-page main-content">
        <div className="content-container">
            <div className="home-content">
                <h2>View and organize your Bugs</h2>
                <Link to="/bug"><button>View Bugs</button></Link>
            </div>
            <img src="assets/img/bug.png" className="bug-img" />
        </div>
    </section>
}