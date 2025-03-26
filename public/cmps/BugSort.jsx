const { useState, useEffect, useRef } = React

export function BugSort({ sortBy, onSetSortBy }) {

    const [editSortBy, setEditSortBy] = useState({ ...sortBy })

    useEffect(() => {
        onSetSortBy(editSortBy)
    }, [editSortBy])


    function handleChange({ target }) {
        var { name, value, checked } = target

        if (name === 'sortDir') value = checked ? 1 : -1

        setEditSortBy(prev => ({ ...prev, [name]: value }))
    }

    return (
        <section className="sort-by-container">
            <label htmlFor="sortType">
                <span>Sort By: </span>
                <select name="sortType" id="sortType" value={editSortBy.sortType || ''} onChange={handleChange}>
                    <option value="createAt">Create at</option>
                    <option value="title">Title</option>
                    <option value="severity">severity</option>
                </select>
            </label>
            {editSortBy.sortType !== "title" &&
                <label htmlFor="sortDir">
                    <span>ascending: </span>
                    <input type="checkbox" id="sortDir" name="sortDir"
                        checked={+editSortBy.sortDir === 1 ? true : false}
                        onChange={handleChange} />
                </label>
            }
        </section>
    )
}