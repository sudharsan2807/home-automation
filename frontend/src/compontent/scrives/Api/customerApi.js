import axios, { Axios } from "axios"

const base_url = "https://jewelry-balance.onrender.com";

export const CUSTOMER_GET_ALL = () => {
    return axios.get(`${base_url}/customer/all`)
}

export const CUSTOMER_GET_LATEST = () => {
    return axios.get(`${base_url}/customer/latest`)
}

export const CUSTOMER_GET = (id) => {
    return axios.get(`${base_url}/customer/get/${id}`)
}

export const CUSTOMER_POST = (data) => {
    let info = {
        bill: data.bill,
        customer: data.customer
    }

    return axios.post(`${base_url}/customer/post`, info)
}

export const CUSTOMER_ADD = (data, id) => {
    let info = {
        customer: data.customer
    }
    return axios.post(`${base_url}/customer/post/add/${id}`, info)
}
export const CUSTOMER_PUT = (id, data) => {
    return axios.put(`${base_url}/customer/upd/${id}`, data)
}
export const CUSTOMER_GET_BILL = (bill) => {
    return axios.get(`${base_url}/customer/getbill/${bill}`);
}

export const CUSTOMER_GET_CODE = (code) => {
    return axios.get(`${base_url}/customer/getcode/${code}`);
}

export const CUSTOMER_SEARCH = (value) => {
    return axios.get(`${base_url}/customer/search?search=${value}`)
}
export const CUSTOMER_LATEST_BILL = (bill) => {
    return axios.get(`${base_url}/customer/getlatest/${bill}`);
}

export const CUSTOMER_DEL = (id) => {
    return axios.delete(`${base_url}/customer/delete/${id}`);
}

export const CUSTOMER_BILL_DEL = (id) => {
    return axios.delete(`${base_url}/customer/deletebill/${id}`);
}
