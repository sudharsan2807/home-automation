import React from 'react'
import { CUSTOMER_GET_ALL } from './Api/customerApi';
import { STOCK_GET_ALL } from './Api/api';
import { SUPPLIER_GET_ALL } from './Api/supplierApi';

export function Chatcustomerbalance(Setgetdata, Setlabel) {
    CUSTOMER_GET_ALL().then((res) => {
        const data = res.data;
        Setlabel(data.map((dat) => "bill " + dat.bill))
        const sumOfBalances = data.map((item) => {
            const customerBalances = item.customer.map((customerItem) => customerItem.balance);
            const totalBalance = customerBalances.reduce((acc, balance) => acc + balance, 0);
            return totalBalance;
        });
        return Setgetdata(sumOfBalances)
    });
}

export function Chatstockgram(Setgetdata, Setlabel) {
    STOCK_GET_ALL().then((res) => {
        const data = res.data;
        Setlabel(data.map((dat) => "bill " + dat.bill))
        const sumOfbalance = data.map((item) => {
            const productbalance = item.product.map((dat) => dat.gram);
            const totalBalance = productbalance.reduce((acc, balance) => acc + balance, 0);
            return totalBalance
        })
        Setgetdata(sumOfbalance);
    })
}

export function Chatsupplierpayback(Setgetdata, Setlabel) {
    SUPPLIER_GET_ALL().then((res) => {
        const data = res.data.map((dat) => dat.supplier);
        const allArrays = [];
        data.forEach((dat) => {
            for (let i = 0; i < dat.length; i++) {
                if (!allArrays[i]) allArrays[i] = [];

                if (dat[i] && dat[i].payback !== undefined) {
                    allArrays[i].push(dat[i].payback);
                }
            }
        });
        Setlabel(allArrays.map((dat, index) => "bill " + index + 1))
        const sumofpayback = allArrays.map((dat, index) => {
            const totalsupplierValue = dat.reduce((call, payback) => call + payback, 0)
            return totalsupplierValue
        })
        return Setgetdata(sumofpayback);
    })
}

export function Chatsupplierbalance(Setgetdata, Setlabel) {
    SUPPLIER_GET_ALL().then((res) => {
        const data = res.data.map((dat) => dat.supplier);
        const allArrays = [];
        data.forEach((dat) => {
            for (let i = 0; i < dat.length; i++) {
                if (!allArrays[i]) allArrays[i] = [];

                if (dat[i] && dat[i].balance !== undefined) {
                    allArrays[i].push(dat[i].balance);
                }
            }
        });
        console.log(allArrays);
        Setlabel(allArrays.map((dat, index) => "bill " + index + 1))
        const sumofpayback = allArrays.map((dat, index) => {
            const totalsupplierValue = dat.reduce((call, balance) => call + balance, 0)
            return totalsupplierValue
        })
        Setgetdata(sumofpayback);
    })
}