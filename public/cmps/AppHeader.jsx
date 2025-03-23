const { NavLink, Link } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function AppHeader() {

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    function onCloseNav() {
        if (isMenuOpen) {
            setIsMenuOpen(false)
        }
    }

    return <header className="app-header main-content single-row">
        <Link to="/" onClick={onCloseNav}>
            <div className="main-logo">
                <img src="assets/img/bug.png" className="bug-img-logo" />
                <span>Miss Bug</span>
            </div>
        </Link>

        <button className="menu-btn" onClick={() => (setIsMenuOpen(!isMenuOpen))}>
            {isMenuOpen ?
                <img src="assets/img/x.png" />
                :
                <img src="assets/img/bars.png" />
            }
        </button>

        <nav className={isMenuOpen ? 'active' : ''}>
            <div>
                <NavLink to="/" onClick={onCloseNav}>Home</NavLink>
                <NavLink to="/bug" onClick={onCloseNav}>Bugs</NavLink>
                <NavLink to="/about" onClick={onCloseNav}>About</NavLink>
            </div>
        </nav>


    </header>
}