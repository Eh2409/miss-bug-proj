// const Router = ReactRouterDOM.HashRouter
const Router = ReactRouterDOM.BrowserRouter
const { Route, Routes } = ReactRouterDOM

import { UserMsg } from './cmps/UserMsg.jsx'
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { BugCompose } from './pages/BugCompose.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { authService } from './services/auth.service.remote.js'
import { UserDetails } from './pages/UserDetails.jsx'
import { UserIndex } from './pages/UserIndex.jsx'

const { useState, useEffect, useRef } = React

export function App() {

    const [loggedinUser, setLoggedinUser] = useState(authService.getLoggedinUser())

    return <Router>
        <div className="app-wrapper">
            <UserMsg />
            <AppHeader loggedinUser={loggedinUser} setLoggedinUser={setLoggedinUser} />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/bug" element={<BugIndex />} />
                    <Route path="/bug/compose" element={<BugCompose />} />
                    <Route path="/bug/edit/:bugId" element={<BugCompose />} />
                    <Route path="/bug/:bugId" element={<BugDetails />} />
                    <Route path="/about" element={<AboutUs />} />

                    <Route path="/users" element={<UserIndex />} />

                    <Route path="/auth" element={<LoginSignup setLoggedinUser={setLoggedinUser} />} />
                    <Route path="/user/:userId" element={<UserDetails />} />
                </Routes>

            </main>
            <AppFooter />
        </div>
    </Router>
}
