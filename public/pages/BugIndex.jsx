const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.remote.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'


export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [maxPageCount, setMaxPageCountBugs] = useState(null)

    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState({ ...bugService.getFilterFromSearchParams(searchParams) })

    useEffect(() => {
        setSearchParams(filterBy)
        loadBugs(filterBy)
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
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

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?', 'Bug ' + Date.now()),
            description: prompt('Bug description?', 'cannot'),
            severity: +prompt('Bug severity?', 3)
        }

        bugService.save(bug)
            .then(savedBug => {
                setBugs([savedBug, ...bugs])
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const bugToSave = { ...bug, severity }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
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


    return <section className="bug-index main-content">

        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <header>
            <h3>Bug List</h3>
            <button onClick={onAddBug}>Add Bug</button>
        </header>

        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
            onEditBug={onEditBug} />

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
