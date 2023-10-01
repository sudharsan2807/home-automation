import React, { useEffect, useState } from 'react';
import { STOCK_GET, STOCK_GET_ALL, STOCK_GET_BILL } from '../Api/api';
import { CUSTOMER_GET_ALL, CUSTOMER_GET_LATEST } from '../Api/customerApi';
import { SUPPLIER_GET_ALL } from '../Api/supplierApi';

export function Totalvalue(getbill, typename) {
    const [data, setData] = useState([]);

    if (getbill === "N") {
        STOCK_GET_ALL().then((response) => {
            const getdata = response.data;
            const combinedData = getdata.reduce((accumulator, currentBack) => {
                currentBack.product.forEach((product) => {
                    accumulator.push(product);
                });
                return accumulator;
            }, []);
            const calculateTotalPieces = (element) => {
                return combinedData.reduce((acc, dat) => acc + dat[element], 0);
            };
            setData(calculateTotalPieces(typename));
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    } else {
        STOCK_GET_BILL(getbill).then((response) => {
            const getdata = response.data[0].product;
            const calculateTotalPieces = (element) => {
                return getdata.reduce((acc, dat) => acc + dat[element], 0);
            };
            setData(calculateTotalPieces(typename));
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    }

    return data;
}

export function Puretotalvalue(getbill) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (getbill === "N") {
            STOCK_GET_ALL().then((response) => {
                const getdata = response.data;
                const combinedData = getdata.reduce((accumulator, currentBack) => {
                    currentBack.product.forEach((product) => {
                        accumulator.push(product);
                    });
                    return accumulator;
                }, []);
                const calculatepuretotal = () => {
                    const pureTotal = combinedData.reduce((acc, dat) => acc + (dat.pure * dat.gram) / 100, 0);
                    return Number(pureTotal.toFixed(2));
                };
                setData(calculatepuretotal);
            }).catch((error) => {
                console.error('Error fetching data:', error);
            });
        } else {
            STOCK_GET_BILL(getbill).then((response) => {
                const getdata = response.data[0].product;
                const calculatepuretotal = () => {
                    const pureTotal = getdata.reduce((acc, dat) => acc + (dat.pure * dat.gram) / 100, 0);
                    return Number(pureTotal.toFixed(2));
                };
                setData(calculatepuretotal);
            }).catch((error) => {
                console.error('Error fetching data:', error);
            });
        }
    }, [getbill])
    return data;
}

export function Customertotal(element) {
    const [Data, Setdata] = useState([]);
    CUSTOMER_GET_ALL().then((response) => {
        const uniqueData = response.data.map((item) => {
            const uniqueProducts = item.customer.reduce((accumulator, currentValue) => {
                if (!accumulator.some((prod) => prod.code === currentValue.code)) {
                    accumulator.push(currentValue);
                }
                return accumulator;
            }, []);
            const updatedProducts = uniqueProducts.map((customer) => {
                const uniqueData = [...new Set(customer.data)]; // Filter unique items in "data" array
                return { ...customer, data: uniqueData };
            });

            // Return a new object with the updated "customer" array
            return { ...item, customer: updatedProducts };
        });
        const getdata = uniqueData;
        const combinedData = getdata.reduce((accumulator, currentBack) => {
            currentBack.customer.forEach((customer) => {
                accumulator.push(customer);
            });
            return accumulator;
        }, []);
        const calculateTotalPieces = (element) => {
            return combinedData.reduce((acc, dat) => acc + dat[element], 0);
        };
        Setdata(calculateTotalPieces(element));
    }).catch((error) => {
        console.error('Error fetching data:', error);
    });
    return Data
}


export function CustomerMaxBill(element) {
    const [data, Setdata] = useState([]);
    const [totalPieces, setTotalPieces] = useState(0);
    useEffect(() => {
        CUSTOMER_GET_LATEST().then((response) => {
            Setdata(response.data.customer);
        }).catch((err) => {
            console.log(err);
        });
    }, [])
    const calculateTotalPieces = (element) => {
        return data.reduce((acc, dat) => acc + dat.collected, 0);
    };
    return calculateTotalPieces();
}

export function Suppliertotal(element) {
    const [Data, Setdata] = useState([]);
    SUPPLIER_GET_ALL().then((response) => {
        const calculateTotalPieces = (element) => {
            return response.data.reduce((acc, dat) => acc + dat[element], 0);
        };
        Setdata(calculateTotalPieces(element));
    }).catch((error) => {
        console.error('Error fetching data:', error);
    });
    return Data
}