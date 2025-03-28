import { utilService } from "../services/util.service.js"
import { BugLabelsPicker } from "./BugLabelsPicker.jsx"


const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilterBy }) {


    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const filterDebounce = useRef(utilService.debounce(onSetFilterBy, 500))

    useEffect(() => {
        filterDebounce.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            [field]: value,
            pageIdx: filterBy.pageIdx >= 0 ? 0 : undefined,
        }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    function onSaveLabels(labelsPicked) {
        setFilterByToEdit(prev => ({ ...prev, labels: labelsPicked }))
    }

    const { txt, minSeverity, labels } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Text : </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity : </label>
                <input value={minSeverity || ''} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                <div className="labels-title">Labels : </div>
                <BugLabelsPicker labels={labels} onSaveLabels={onSaveLabels} />
            </form>
        </section >
    )
}

