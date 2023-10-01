import React, { useEffect, useState } from 'react';
import { STOCK_GET_ALL } from '../Api/api';
import { CUSTOMER_GET_ALL } from '../Api/customerApi';

export function Allstackdata() {
    const [data, setData] = useState([]);
    useEffect(() => {
        STOCK_GET_ALL()
            .then((response) => {
                const getdata = response.data;
                const combinedData = getdata.reduce((accumulator, currentBack) => {
                    currentBack.product.forEach((product) => {
                        accumulator.push(product);
                    });
                    return accumulator;
                }, []);

                setData(combinedData); // Set the combined data in the state
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return data;
}

export function Allcustomerdata() {
    const [data, setData] = useState([]);

    useEffect(() => {
        CUSTOMER_GET_ALL()
            .then((response) => {
                const getdata = response.data;
                const combinedData = getdata.reduce((accumulator, currentBack) => {
                    currentBack.customer.forEach((customer) => {
                        accumulator.push(customer);
                    });
                    return accumulator;
                }, []);

                setData(combinedData); // Set the combined data in the state
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return data;
}

