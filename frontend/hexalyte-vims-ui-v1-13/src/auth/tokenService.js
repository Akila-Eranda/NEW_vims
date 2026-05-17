export const getStoredTokens = () => {
    const encoded = localStorage.getItem('user')
    if (!encoded) return null;
    try {
        return JSON.parse(atob(encoded))
    } catch (error) {
        console.log(error)
        return null
    }
}

export const storeTokens = (tokens) => {
    console.log(tokens)
    return localStorage.setItem('user', btoa(JSON.stringify(tokens)))
}

export const replaceTokens = (tokens) => {
    const currentUser = JSON.parse(atob(localStorage.getItem('user')))
    currentUser.tokens = tokens
    localStorage.setItem('user', btoa(JSON.stringify(currentUser)))
}

export const clearTokens = () => {
    localStorage.removeItem('user')
}

export const isTokenExpired = (expires) => {
    // console.log(new Date(expires))
    // console.log(new Date())

    // console.log(new Date(expires).getTime() - new Date().getTime())

    // return new Date(expires).getTime() < Date.now()

    if (new Date(expires).getTime() - new Date().getTime() <= 240000) {
        return true
    } else {
        console.log(`Access token still valid for ${new Date(expires).getTime() - new Date().getTime()}ms`)
        return false
    }

}