
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
    const { txt, minSeverity } = filterBy
    const queryParams = `?txt=${txt}&minSeverity=${minSeverity}`

    return axios.get(BASE_URL + queryParams).then(res => res.data)
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
    return { txt: '', minSeverity: '' }
}

function getFilterFromSearchParams(searchParams) {

    const defaultFilterBy = { ...getDefaultFilter() }
    const filterBy = {}

    for (const field in defaultFilterBy) {
        filterBy[field] = searchParams.get(`${field}`) || defaultFilterBy[field]
    }

    return filterBy
}