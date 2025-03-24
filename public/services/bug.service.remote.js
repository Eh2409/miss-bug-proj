
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
    console.log('bug:', bug)
    const { title, description, severity, createdAt } = bug
    const url = BASE_URL + 'save'
    var queryParmas = `?title=${title}&description=${description}&severity=${severity}&createdAt=${createdAt}`
    if (bug._id) queryParmas += `&_id=${bug._id}`
    return axios.get(url + queryParmas).then(res => res.data)
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