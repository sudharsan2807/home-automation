import React, { Fragment, useEffect, useState } from 'react';
import { Customertotal } from '../../scrives/data/totalshock';
import Viewpanel from '../../viewpanel';
import { SUPPLIER_ADD, SUPPLIER_GET, SUPPLIER_GET_ALL, SUPPLIER_GET_MAIN, SUPPLIER_MAIN_PUT, SUPPLIER_PUT } from '../../scrives/Api/supplierApi';
import { useParams } from 'react-router-dom';

export default function Supplierform() {
    const { id } = useParams();
    const { type } = useParams();
    const [billval, Setbill] = useState(1);
    const billno = billval;
    const [input, Setinput] = useState({
        name: "",
        supplier: {
            payback: 0,
            balance: 0,
            bill: billno
        }
    });
    useEffect(() => {
        Setinput({ ...input, supplier: { ...input.supplier, bill: billval } });
    }, [input.supplier.payback]);

    useEffect(() => {
        if (type === "add") {
            SUPPLIER_GET_MAIN(id).then((response) => {
                Setinput({ ...input, name: response.data.name });
            });
        }
        if (type === "edit") {
            SUPPLIER_GET(id).then((response) => {
                const { payback, bill, balance } = response.data;
                Setinput({ ...input, name: response.data.name, supplier: { ...input.supplier, payback, bill, balance } });
            });
        } else {
            SUPPLIER_GET_ALL().then((response) => {
                const combinedProductData = response.data.reduce((accumulator, currentBill) => {
                    currentBill.supplier.forEach((supplier) => {
                        accumulator.push(supplier);
                    });
                    return accumulator;
                }, []);
                const billArray = combinedProductData.map((dat, index) => dat.bill);
                const maxbill = Math.max(...billArray);
                if (maxbill > 0) {
                    const insertbill = maxbill + 1;
                    console.log("insertbill", insertbill);
                    Setbill(insertbill);
                }
            });

            SUPPLIER_GET_MAIN(id).then((response) => {
                Setinput({ ...input, name: response.data.name });
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [input.supplier.payback]);
    const inputhandler = (e, name) => {
        Setinput({ ...input, supplier: { ...input.supplier, [name]: e.target.value } });
    }

    const Submithandler = () => {
        if (type === "edit") {
            SUPPLIER_MAIN_PUT(id, input.supplier).then(() => {
                window.history.back(-2);
            }).catch((err) => {
                console.log(err);
            })
            SUPPLIER_PUT(id, input.supplier).then(() => {
            })
        } else {
            SUPPLIER_ADD(input, id).then((response) => {
                window.history.back(-2);
            }).catch((err) => {
                console.log(err);
            });
            SUPPLIER_MAIN_PUT(id, input.supplier).then(() => {
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    const closehandler = () => {
        window.history.back(-2);
    }

    return (
        <Fragment>
            <Viewpanel />
            <div className='blurbackground'></div>
            <div className='box-container'>
                <i className="fa-solid fa-xmark" onClick={closehandler}></i>
                <div className='billinfo'>
                    <span>Bill : {input.supplier.bill}</span>
                    <input></input>
                </div>
                {type !== "edit" ?
                    <div className="inputbox" >
                        <input type="text" value={input.name} />
                    </div> : null
                }
                <div className="inputbox" >
                    <input type="text" onChange={(e) => inputhandler(e, "payback")} value={input.supplier.payback} />
                    <span>payback</span>
                </div>
                <div className="inputbox" >
                    <input type="text" value={input.supplier.balance} onChange={(e) => inputhandler(e, "balance")} />
                    <span>balance</span>
                </div>
                <button onClick={Submithandler}>Submit</button>
            </div>
        </Fragment>
    );
}
