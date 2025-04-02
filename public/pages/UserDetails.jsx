import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.remote.js"
import { userService } from "../services/user.service.local.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"



const { useState, useEffect, useRef } = React
const { useParams } = ReactRouterDOM

export function UserDetails() {

    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)

    const { userId } = useParams()

    console.log('userId:', userId)
    console.log('user:', user)

    useEffect(() => {
        if (userId) {
            loadUser(userId)
        }
    }, [])

    useEffect(() => {
        if (user) {
            loadBugs()
        }
    }, [user])

    function loadUser(userId) {
        userService.getById(userId)
            .then(user => {
                console.log('user:', user)
                setUser(user)
            })
            .catch(err => showErrorMsg(`Cannot load user`, err))
    }

    function loadBugs() {
        bugService.query()
            .then(data => {
                const userBugs = data.bugs.filter(bug => bug.creator.username === user.username)
                setBugs(userBugs)
            })
            .catch(err => showErrorMsg(`Cannot load bugs`, err))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }



    return (
        <section className="user-details main-content">
            <header>
                <h2>{user ? user.fullname : 'loading...'}</h2>
                <hr />
            </header>


            {bugs &&
                <div>
                    <h3>Bugs you created</h3>
                    <BugList
                        bugs={bugs}
                        onRemoveBug={onRemoveBug}
                    />
                </div>
            }
        </section>
    )
}