import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Editepopup from '../../alert/editpopup';
import { ADD_STORAGE, GET_STORAGE } from '../../scrives/storge';
import { STOCK_BILL_DEL, STOCK_GET_ALL, STOCK_GET_BILL, STOCK_SEARCH } from '../../scrives/Api/api';
import { CUSTOMER_BILL_DEL, CUSTOMER_GET_ALL, CUSTOMER_GET_BILL, CUSTOMER_SEARCH } from '../../scrives/Api/customerApi';
import Viewpanelsupplier from '../../viewpanelsupplier';
import Supplierform from '../changeform/supplierform';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export default function Viewdata() {
    const { name } = useParams();
    const { type } = useParams();
    const navigate = useNavigate();
    const [alldata, Setalldata] = useState([]);
    const [Deletepopup, Setdeletepopup] = useState();
    const [data, setData] = useState([]);
    const [id, Setid] = useState();
    const [total, Settotal] = useState({
        pieces: 0,
        gram: 0,
        pure: 0,
        balance: 0,
        purchase: 0,
        pure: 0,
        collected: 0,
        cbalance: 0
    })
    const edithander = (id) => {
        if (name === "stock") {
            navigate(`/viewpanel/stock/edite/${id}`)
        }
        if (name === "customer") {
            navigate(`/viewpanel/customer/edite/${id}`)
        }
    }

    const addhandler = () => {
        navigate('adminpanel');
        if (data.length !== 0) {
            navigate(`${id}/adminpanel`)
        }
    }

    const deletehandler = () => {
        Setdeletepopup(!Deletepopup);
    }
    const calculateTotalPieces = (element) => {
        if (name === "stock") {
            return data.reduce((acc, dat) => acc + dat[element], 0);
        }
        if (name === "customer") {
            return data.reduce((acc, dat) => acc + dat[element], 0);
        }
    };

    const calculatepuretotal = () => {
        const pureTotal = data.reduce((acc, dat) => acc + (dat.pure * dat.gram) / 100, 0);
        return Number(pureTotal.toFixed(2));
    };

    const selecthanlder = (event) => {
        ADD_STORAGE(event.target.value)
    }
    useEffect(() => {
        if (name === "stock") {
            if (type === "add") {
                STOCK_GET_BILL(GET_STORAGE()).then((response) => {
                    console.log(response);
                    setData(response.data[0].product);
                    Setid(response.data[0]._id)
                }).catch((err) => {
                    console.log(err);
                })
            }
            STOCK_GET_ALL().then((resposne) => {
                Setalldata(resposne.data)
            }).catch((err) => {
                console.log(err);
            })
        }
        if (name === "customer") {
            if (type === "add") {
                CUSTOMER_GET_BILL(GET_STORAGE()).then((response) => {
                    console.log(response);
                    setData(response.data[0].customer);
                    Setid(response.data[0]._id)
                }).catch((err) => {
                    console.log(err);
                })
            }
            CUSTOMER_GET_ALL().then((resposne) => {
                Setalldata(resposne.data)
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [])

    useEffect(() => {
        if (name === "stock") {
            Settotal({
                ...total,
                pieces: calculateTotalPieces('pieces'),
                gram: calculateTotalPieces('gram'),
                balance: calculateTotalPieces('balance'),
                pure: calculatepuretotal()
            })
        }
        if (name === "customer") {
            Settotal({
                ...total,
                purchase: calculateTotalPieces('purchase'),
                collected: calculateTotalPieces('collected'),
                cbalance: calculateTotalPieces('balance'),
                pure: calculateTotalPieces('pure')
            })
        }
    }, [data])

    const billdelete = () => {
        if (name === "stock") {
            STOCK_BILL_DEL(id).then((response) => {
                console.log(response);
                deletehandler();
            }).catch((err) => {
                console.log(err);
            })
        }
        if (name === "customer") {
            CUSTOMER_BILL_DEL(id).then((response) => {
                console.log(response);
                deletehandler();
            }).catch((err) => {
                console.log(err);
            })
        }
    }
    const backhandler = () => {
        window.history.back();
    }

    const pdfdownload = () => {
        const doc = new jsPDF({ orientation: "portrait" })

        if (name === "customer") {
            doc.autoTable({
                html: '#datatable'
            })
        }
        if (name === "stock") {
            doc.autoTable({
                html: '#tablestock'
            })
        }
        doc.save(`data_${name}_${GET_STORAGE()}.pdf`)
    }

    return (
        <Fragment>
            {name === "customer" || "stock" ?
                <Fragment>
                    {type === "add" ?
                        <Fragment>
                            <div className='backarrow' onClick={backhandler}><i class="fa-solid fa-arrow-left"></i></div>
                            <div className="backcontain"></div>
                            <div className="balancesheet">
                                <span>{name} Balance</span>
                                <div className="adminpanel" style={{ width: "100%" }}>
                                    <button onClick={addhandler}>Add +</button>
                                    <button id='delete' onClick={deletehandler}>Delete <i class="fa-solid fa-trash"></i></button>
                                    <button id="download" onClick={pdfdownload}>Download</button>
                                    <select onChange={selecthanlder}>
                                        <option>bill {GET_STORAGE()}</option>
                                        {alldata.map((dat, index) => (
                                            <option value={dat.bill} key={index}>bill {dat.bill}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                                <div className="classNametable">
                                    {name === "customer" ?
                                        <table id="datatable">
                                            <thead>
                                                <tr>
                                                    <th>S.no</th>
                                                    <th>Code</th>
                                                    <th>Date</th>
                                                    <th>Name</th>
                                                    <th>City</th>
                                                    <th>Purchase</th>
                                                    <th>Pure</th>
                                                    <th>Collected</th>
                                                    <th>Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((dat, index) => (
                                                    <tr onClick={() => edithander(dat._id)} key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{dat.code}</td>
                                                        <td>{dat.date}</td>
                                                        <td>{dat.name}</td>
                                                        <td>{dat.city}</td>
                                                        <td>{dat.purchase}</td>
                                                        <td>{dat.pure}</td>
                                                        <td>{dat.collected}</td>
                                                        <td>{dat.balance}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="5">Total</td>
                                                    <td>{total.purchase}</td>
                                                    <td>{total.pure}</td>
                                                    <td>{total.collected}</td>
                                                    <td>{total.cbalance}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                        : name === "stock" ? <table id='tableshock'>
                                            <thead>
                                                <tr>
                                                    <th>S.no</th>
                                                    <th>Code</th>
                                                    <th>Date</th>
                                                    <th>Item Name</th>
                                                    <th>Seller Name</th>
                                                    <th>Piece</th>
                                                    <th>Pure</th>
                                                    <th>Piece Weight</th>
                                                    <th>Gram</th>
                                                    <th>Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((dat, index) => (
                                                    <tr onClick={() => edithander(dat._id)} key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{dat.code}</td>
                                                        <td>{dat.date}</td>
                                                        <td>{dat.name}</td>
                                                        <td>{dat.seller}</td>
                                                        <td>{dat.pieces}</td>
                                                        <td>{dat.pure}%</td>
                                                        <td>{dat.weight}</td>
                                                        <td>{dat.gram}</td>
                                                        <td>{dat.balance}</td>
                                                    </tr>))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="5">Total</td>
                                                    <td>{total.pieces}</td>
                                                    <td>{total.pure}</td>
                                                    <td></td>
                                                    <td>{total.gram}</td>
                                                    <td>{total.balance}</td>
                                                </tr>
                                            </tfoot>
                                        </table> : name === "supplier"}
                                </div>
                            </div>
                        </Fragment> : type === "edite" ? <Editepopup /> : null}
                    {name === "supplier" ? <Supplierform /> : null}
                    {
                        Deletepopup ? <Fragment>
                            <div className="blurbackground"></div>
                            <div className='deletepop'>
                                <i class="fa-solid fa-xmark" onClick={deletehandler}></i>
                                <span>Are you Sure!</span>
                                <button onClick={billdelete}>Delete</button>
                            </div>
                        </Fragment> : null
                    }
                </Fragment>
                : null}
        </Fragment>
    )
}
