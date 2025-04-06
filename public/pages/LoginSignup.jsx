import { authService } from "../services/auth.service.remote.js"
import { userService } from "../services/user.service.remote.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect, useRef } = React

const { useNavigate } = ReactRouterDOM

export function LoginSignup({ setLoggedinUser }) {

    const navigate = useNavigate()

    const [isSignup, setIsSignup] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())


    function handleChange({ target }) {
        var { name, value } = target

        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
        isSignup ? signin(credentials) : login(credentials)
    }

    function login(credentials) {
        authService.login(credentials)
            .then(user => {
                setLoggedinUser(user)
                showSuccessMsg('Logged in successfully')
                navigate('/bug')
            })
            .catch(err => {
                console.log(err)
                showErrorMsg(`Couldn't login...`)
            })
    }


    function signin(credentials) {
        authService.signup(credentials)
            .then(user => {
                setLoggedinUser(user)
                showSuccessMsg('Signed in successfully')
                navigate('/bug')
            })
            .catch(err => {
                console.log(err)
                showErrorMsg(`Couldn't signup...`)
            })
    }

    const { username, password, fullname } = credentials

    return (
        <section className="login-signup main-content">


            <header>
                <h2>
                    {isSignup ? 'Signup' : 'Login'}
                </h2>

            </header>



            <form onSubmit={onSubmit}>
                <label htmlFor="username">username: </label>
                <input type="text" id="username" name="username" value={username} onChange={handleChange} required />
                {isSignup &&
                    <React.Fragment>
                        <label htmlFor="fullname">fullname: </label>
                        <input type="text" id="fullname" name="fullname" value={fullname} onChange={handleChange} required />
                    </React.Fragment>
                }
                <label htmlFor="password">password: </label>
                <input type="text" id="password" name="password" value={password} onChange={handleChange} required />

                <div className="form-btn">
                    <button>{isSignup ? 'Signup' : 'Login'}</button>
                    <a href="#" onClick={() => { setIsSignup(!isSignup) }}>
                        {isSignup ? 'Have you registered yet? Create an account'
                            : 'New to the site? Create an account now'}
                    </a>
                </div>
            </form >



        </section >
    )
}