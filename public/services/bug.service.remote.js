
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getFilterFromSearchParams
}

function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy })
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
    return { txt: '', minSeverity: '', pageIdx: undefined }
}

function getFilterFromSearchParams(searchParams) {

    const defaultFilterBy = { ...getDefaultFilter() }
    const filterBy = {}

    for (const field in defaultFilterBy) {
        if (field === 'pageIdx') {
            const pageIdxRes = searchParams.get(`pageIdx`) || defaultFilterBy[field]
            filterBy.pageIdx = (pageIdxRes !== 'undefined') ? pageIdxRes : defaultFilterBy[field]
        }
        else {
            filterBy[field] = searchParams.get(`${field}`) || defaultFilterBy[field]
        }
    }

    return filterBy
}