import { authService } from "../services/auth.service.remote.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { NavLink, Link, useNavigate } = ReactRouterDOM
const { useState, useEffect, useRef } = React

export function AppHeader({ loggedinUser, setLoggedinUser }) {

    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    function onCloseNav() {
        if (isMenuOpen) {
            setIsMenuOpen(false)
        }
    }

    function onLogout() {
        authService.logout()
            .then(() => {
                console.log('ok');
                setLoggedinUser(null)
                navigate('/auth')
            })
            .catch(err => {
                console.log(err)
                showErrorMsg(`Couldn't logout...`)
            })
    }

    return <header className="app-header main-content single-row">
        <div className="header-content">
            <Link to="/" onClick={onCloseNav}>
                <div className="main-logo">
                    <img src="/assets/img/bug.png" className="bug-img-logo" />
                    <span>Miss Bug</span>
                </div>
            </Link>

            <nav className={isMenuOpen ? 'active' : ''}>
                <div>
                    <NavLink to="/" onClick={onCloseNav}>Home</NavLink>
                    <NavLink to="/bug" onClick={onCloseNav}>Bugs</NavLink>
                    <NavLink to="/about" onClick={onCloseNav}>About</NavLink>
                    {loggedinUser && loggedinUser.isAdmin && <NavLink to="/user" onClick={onCloseNav}>Users</NavLink>}
                </div>
            </nav>

            <div className='login'>
                {loggedinUser
                    ? <React.Fragment>
                        <NavLink to={`/user/${loggedinUser._id}`}>{loggedinUser.fullname}</NavLink>
                        <button onClick={onLogout}>logout</button>
                    </React.Fragment>
                    : <NavLink to="/auth" onClick={onCloseNav}><button>Login</button></NavLink>
                }
            </div>

            <button className="menu-btn" onClick={() => (setIsMenuOpen(!isMenuOpen))}>
                {isMenuOpen ?
                    <img src="/assets/img/x.png" />
                    :
                    <img src="/assets/img/bars.png" />
                }
            </button>

        </div>

    </header>
}