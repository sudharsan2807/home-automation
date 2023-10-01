import React from "react"

export function GET_STORAGE() {
    return localStorage.getItem('billno')
}

export function ADD_STORAGE(data) {
    return localStorage.setItem('billno', data)
}

export function ID_STORAGE(data) {
    return localStorage.setItem('Id', data)
}

export function ID_GET() {
    return localStorage.getItem('Id')
}