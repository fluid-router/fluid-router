/**
 * copy from https://github.com/ReactTraining/history
 */
export function addLeadingSlash(path: string) {
    return path.charAt(0) === '/' ? path : '/' + path
}

export function stripLeadingSlash(path: string) {
    return path.charAt(0) === '/' ? path.substr(1) : path
}

export function hasBasename(path: string, prefix: string) {
    return (
        path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 &&
        '/?#'.indexOf(path.charAt(prefix.length)) !== -1
    )
}

export function stripBasename(path: string, prefix: string) {
    return hasBasename(path, prefix) ? path.substr(prefix.length) : path
}

export function stripTrailingSlash(path: string) {
    return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path
}

export function parsePath(path: string) {
    let pathname = path || '/'
    let search = ''
    let hash = ''

    const hashIndex = pathname.indexOf('#')
    if (hashIndex !== -1) {
        hash = pathname.substr(hashIndex)
        pathname = pathname.substr(0, hashIndex)
    }

    const searchIndex = pathname.indexOf('?')
    if (searchIndex !== -1) {
        search = pathname.substr(searchIndex)
        pathname = pathname.substr(0, searchIndex)
    }

    return {
        pathname,
        search: search === '?' ? '' : search,
        hash: hash === '#' ? '' : hash
    }
}

export function createPath(location: { pathname?: string; search?: string; hash?: string }) {
    const { pathname, search, hash } = location

    let path = pathname || '/'

    if (search && search !== '?') path += search.charAt(0) === '?' ? search : `?${search}`

    if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : `#${hash}`

    return path
}
