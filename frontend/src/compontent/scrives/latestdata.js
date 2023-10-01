import React, { useEffect, useState } from 'react';
import { GET_STORAGE } from './storge';
import { STOCK_GET_ALL, STOCK_GET_BILL } from './Api/api';

export default function Latestdata() {
    const [data, setData] = useState();

    useEffect(() => {
        if (GET_STORAGE()) {
            STOCK_GET_BILL(GET_STORAGE())
                .then((response) => {
                    setData(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            STOCK_GET_ALL()
                .then((response) => {
                    setData(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    console.log(data);
    return <>{/* Render your component with data here */}</>;
}
