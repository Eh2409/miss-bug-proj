const { useState, useEffect } = React
const { useSearchParams, Link } = ReactRouterDOM

import { bugService } from '../services/bug.service.remote.js'
import { authService } from '../services/auth.service.remote.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { BugSort } from '../cmps/BugSort.jsx'



export function BugIndex() {

    const loggedinUser = authService.getLoggedinUser()

    const [bugs, setBugs] = useState(null)
    const [maxPageCount, setMaxPageCountBugs] = useState(null)

    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState({ ...bugService.getFilterFromSearchParams(searchParams) })
    const [sortBy, setSortBy] = useState({ ...bugService.getSortFromSearchParams(searchParams) })


    useEffect(() => {
        setSearchParams({ ...filterBy, ...sortBy })
        loadBugs()
    }, [filterBy, sortBy])

    function loadBugs() {
        bugService.query(filterBy, sortBy)
            .then(res => {
                setBugs(res.bugs)
                setMaxPageCountBugs(res.maxPageCount)
            })
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
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

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onSetPage(diff) {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: +prevFilter.pageIdx + diff }))
    }

    function onSetPageNumber(pageNum) {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: pageNum }))
    }

    function onSetSortBy(editedSortBy) {
        setSortBy(prevF => ({ ...editedSortBy }))
    }

    return <section className="bug-index main-content">

        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <header>
            <h3>Bug List</h3>
            <BugSort sortBy={sortBy} onSetSortBy={onSetSortBy} />
            {loggedinUser && <Link to='/bug/compose'><button>Add Bug</button></Link>}
        </header>

        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
        />

        <div className='pagination-container'>

            <label htmlFor="use-pagination">
                use pagination
                <input type="checkbox" id="use-pagination"
                    checked={filterBy.pageIdx !== undefined ? true : false}
                    onChange={(event) => {
                        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: (event.target.checked) ? 0 : undefined }))
                    }} />
            </label>

            {filterBy.pageIdx !== undefined &&
                <div className='pagination-btns'>
                    <button disabled={filterBy.pageIdx <= 0} onClick={() => onSetPage(-1)}>Prev page</button>

                    {maxPageCount >
                        0 && Array.from({ length: maxPageCount })
                            .map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onSetPageNumber(idx)}
                                    className={+filterBy.pageIdx === idx ? "active" : ""}
                                >
                                    {idx + 1}
                                </button>
                            ))}

                    <button disabled={filterBy.pageIdx >= maxPageCount - 1} onClick={() => onSetPage(1)}>Next page</button>
                </div>
            }

        </div>

    </section >
}
