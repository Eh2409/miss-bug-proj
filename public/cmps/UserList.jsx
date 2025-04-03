

export function UserList({ users, onRemoveUser }) {
    return (
        <ul className="user-list">
            {users.map(user => {
                return <li key={user._id}>
                    <span>{user.username}</span>
                    <button onClick={() => { onRemoveUser(user._id) }}>Remove User</button>
                </li>
            })}
        </ul>
    )
}