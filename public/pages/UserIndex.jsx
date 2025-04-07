import { UserList } from "../cmps/UserList.jsx"
import { authService } from "../services/auth.service.remote.js"
import { userService } from "../services/user.service.remote.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const { useState, useEffect, useRef } = React
const { useNavigate } = ReactRouterDOM

export function UserIndex() {
    const loggedinUser = authService.getLoggedinUser()
    const [users, setUsers] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        if (!loggedinUser) {
            navigate('/auth')
            showErrorMsg(`You don't have permission to view this page. Please log in to continue.`)
        }
    }, [])

    function loadUsers() {
        userService.query()
            .then(users => {
                users = users.filter(user => !user.isAdmin)
                setUsers(users)
            })
            .catch(err => showErrorMsg(`Couldn't load users - ${err}`))
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                setUsers(prev => prev.filter(user => user._id !== userId))
                showSuccessMsg('User removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove User`, err))
    }


    return (
        <section className="user-index main-content">

            <header>
                <h2>users</h2>
                <hr />
            </header>

            {users && <UserList users={users} onRemoveUser={onRemoveUser} loggedinUser={loggedinUser} />}
        </section>
    )
}