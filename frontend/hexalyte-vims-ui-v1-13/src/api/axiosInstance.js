import axios from "axios";

import { getStoredTokens, isTokenExpired, replaceTokens, clearTokens } from "auth/tokenService";

const BASE_URL = "https://api.vims.hexalyte.com/v1/";

export const createAxiosInstance = () => {

    const instance = axios.create({
        baseURL: BASE_URL
    })

    let isRefreshing = false;
    let requestQueue = [];

    const processQueue = (error, newToken = null) => {
        requestQueue.forEach((prom) => {
            if (error) prom.reject(error)
            else prom.resolve(newToken)
        })
        requestQueue = [];
    }

    instance.interceptors.request.use(
        async (config) => {
            const tokens = getStoredTokens();
            if (!tokens) return config

            const isExpired = isTokenExpired(tokens.tokens.access.expires)
            console.log(isExpired)

            if (isExpired) {
                if (!isRefreshing) {
                    isRefreshing = true

                    try {

                        // const response = await axios.post(`${BASE_URL}auth/refresh-tokens`, {}, {headers: `Bearer ${tokens.tokens.refresh.token}`})
                        const response = await axios.post(`${BASE_URL}auth/refresh-tokens`, {}, { headers: { Authorization: `Bearer ${tokens.tokens.refresh.token}` } })
                        const newTokens = response.data.tokens

                        replaceTokens(newTokens)

                        config.headers.Authorization = `Bearer ${newTokens.access.token}`

                        processQueue(null, newTokens.access.token)

                    } catch (error) {
                        console.log(error)
                        clearTokens()
                        processQueue(error, null)
                        throw error
                    } finally {
                        isRefreshing = false
                    }

                } else {

                    return new Promise((resolve, reject) => {
                        requestQueue.push({
                            resolve: (token) => {
                                config.headers.Authorization = `Bearer ${token}`
                                resolve(config)
                            },
                            reject: (err) => reject(err)
                        })
                    })

                }
            } else {
                config.headers.Authorization = `Bearer ${tokens.tokens.access.token}`
                // console.log(tokens.tokens.access.token)
                console.log(config)
            }

            return config

        },

        (error) => Promise.reject(error)

    )

    return instance

}