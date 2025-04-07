

export function UserList({ users, onRemoveUser, loggedinUser }) {
    return (
        <ul className="user-list">
            {users.map(user => {
                return <li key={user._id}>
                    <div><span>Username:</span> {user.username}</div>
                    <div><span>Fullname:</span> {user.fullname}</div>
                    <div><span>Id:</span> {user._id}</div>
                    {loggedinUser.isAdmin && <button onClick={() => { onRemoveUser(user._id) }}>Remove User</button>}
                </li>
            })}
        </ul>
    )
}