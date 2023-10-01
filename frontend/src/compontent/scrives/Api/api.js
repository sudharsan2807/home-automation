import axios, { Axios } from "axios"

const base_url = "http://localhost:5000/bussiness";

export const PASS_GET = () => {
    return axios.get(`${base_url}/pass/all`)
}

export const MESS_SEND = (data) => {
    return axios.get(`https://api.telegram.org/bot6515036773:AAHv1M1ejZDezzJwZ07yNPjt9dg80qxthsE/sendMessage?chat_id=@IOT_WED_ENTERY&text=${data}`)
}

export const STOCK_GET_ALL = () => {
    return axios.get(`${base_url}/stock/all`)
}

export const STOCK_GET = (id) => {
    return axios.get(`${base_url}/stock/get/${id}`)
}

export const STOCK_SEARCH = (value) => {
    return axios.get(`${base_url}/stock/search?search=${value}`)
}

export const STOCK_GET_CODE = (code) => {
    return axios.get(`${base_url}/stock/getcode/${code}`)
}
export const STOCK_POST = (data) => {
    let info = {
        bill: data.bill,
        product: data.product
    }

    return axios.post(`${base_url}/stock/post`, info)
}

export const STOCK_ADD = (data, id) => {
    let info = {
        product: data.product
    }
    return axios.post(`http://localhost:5000/bussiness/stock/post/add/${id}`, info)
}
export const STOCK_PUT = (id, data) => {
    return axios.put(`${base_url}/stock/upd/${id}`, data)
}
export const STOCK_GET_BILL = (bill) => {
    return axios.get(`http://localhost:5000/bussiness/stock/getbill/${bill}`);
}

export const STOCK_LATEST_BILL = (bill) => {
    return axios.get(`http://localhost:5000/bussiness/stock/getlatest/${bill}`);
}

export const STOCK_DEL = (id) => {
    return axios.delete(`http://localhost:5000/bussiness/stock/delete/${id}`);
}

export const STOCK_BILL_DEL = (id) => {
    return axios.delete(`http://localhost:5000/bussiness/stock/deletebill/${id}`);
}
