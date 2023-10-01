import axios, { Axios } from "axios"

const base_url = "https://jewelry-balance.onrender.com";

export const SUPPLIER_GET_ALL = () => {
    return axios.get(`${base_url}/supplier/all`)
}

export const SUPPLIER_GET = (id) => {
    return axios.get(`${base_url}/supplier/get/${id}`)
}

export const SUPPLIER_GET_MAIN = (id) => {
    return axios.get(`${base_url}/supplier/getmain/${id}`)
}

export const SUPPLIER_POST = (data) => {
    let info = {
        name: data.name,
        balance: data.balance,
        supplier: data.supplier
    }

    return axios.post(`${base_url}/supplier/post`, info)
}

export const SUPPLIER_ADD = (data, id) => {
    let info = {
        supplier: data.supplier
    }
    return axios.post(`${base_url}/supplier/post/add/${id}`, info)
}

export const SUPPLIER_PUT = (id, data) => {
    return axios.put(`${base_url}/supplier/upd/${id}`, data)
}

export const SUPPLIER_MAIN_PUT = (id, data) => {
    let info = {
        balance: data.balance
    }
    return axios.put(`${base_url}/supplier/${id}`, info)

}

export const SUPPLIER_GET_BILL = (bill) => {
    return axios.get(`${base_url}/supplier/getbill/${bill}`);
}

export const SUPPLIER_GET_CODE = (code) => {
    return axios.get(`${base_url}/supplier/getcode/${code}`);
}

export const SUPPLIER_SEARCH = (value) => {
    return axios.get(`${base_url}/supplier/search?search=${value}`)
}
export const SUPPLIER_LATEST_BILL = (bill) => {
    return axios.get(`${base_url}/supplier/getlatest/${bill}`);
}

export const SUPPLIER_DEL = (id) => {
    return axios.delete(`${base_url}/supplier/delete/${id}`);
}

export const SUPPLIER_FULL_DEL = (id) => {
    return axios.delete(`${base_url}/supplier/deletebill/${id}`);
}
