
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getFilterFromSearchParams,
    getDefaultSort,
    getSortFromSearchParams,
}

function query(filterBy, sortBy) {
    return axios.get(BASE_URL, { params: { ...filterBy, ...sortBy } })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + bug._id, bug).then(res => res.data)
            .catch(err => {
                console.log(err)
                throw err
            })
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
            .catch(err => {
                console.log(err)
                throw err
            })
    }
}


function getDefaultFilter() {
    return { txt: '', minSeverity: '', labels: [], pageIdx: undefined }
}

function getDefaultSort() {
    return { sortType: 'createdAt', sortDir: -1 }
}


function getFilterFromSearchParams(searchParams) {

    const defaultFilterBy = { ...getDefaultFilter() }
    const filterBy = {}

    for (const field in defaultFilterBy) {
        if (field === 'pageIdx') {
            const pageIdxRes = searchParams.get(`pageIdx`) || defaultFilterBy[field]
            filterBy.pageIdx = (pageIdxRes !== 'undefined') ? pageIdxRes : defaultFilterBy[field]
        } else if (field === 'labels') {
            filterBy[field] = searchParams.getAll('labels') || defaultFilterBy[field]
        } else {
            filterBy[field] = searchParams.get(`${field}`) || defaultFilterBy[field]
        }
    }

    console.log('filterBy:', filterBy)
    return filterBy
}

function getSortFromSearchParams(searchParams) {

    const defaultSortBy = { ...getDefaultSort() }
    const SortBy = {}

    for (const field in defaultSortBy) {
        SortBy[field] = searchParams.get(`${field}`) || defaultSortBy[field]
    }

    return SortBy
}