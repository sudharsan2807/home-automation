import React, { Fragment, useEffect, useState } from 'react';
import { SUPPLIER_DEL, SUPPLIER_FULL_DEL, SUPPLIER_GET_ALL } from './scrives/Api/supplierApi';
import { useNavigate } from 'react-router-dom';
import { CustomerMaxBill, Customertotal } from './scrives/data/totalshock';

export default function Viewpanelsupplier() {
    const [data, Setdata] = useState([]);
    const [expandedTables, setExpandedTables] = useState([]);
    const [idToDelete, setIdToDelete] = useState(false);
    const [table, Settable] = useState();
    const [deletepage, setDeletepage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        SUPPLIER_GET_ALL().then((response) => {
            Setdata(response.data);
            setExpandedTables(Array(response.data.length).fill(false));
        });

    }, []);

    const directhanlder = (id) => {
        navigate(`add/${id}`);
    }

    const viewhandler = (index) => {
        const updatedExpandedTables = [...expandedTables];
        updatedExpandedTables[index] = !updatedExpandedTables[index];
        setExpandedTables(updatedExpandedTables);
    }

    const editehandler = (id) => {
        navigate(`edit/${id}`)
    }
    const deletehandler = (id, type) => {
        setDeletepage(true);
        setIdToDelete(id);
        Settable(type);
    }

    const billdelete = () => {
        if (table === "lower") {
            SUPPLIER_DEL(idToDelete).then((response) => {
                setDeletepage(false);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            SUPPLIER_FULL_DEL(idToDelete).then((res) => {
                console.log(res);
                setDeletepage(false);
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    const calculateTotal = (compound) => {
        return data.reduce((acc, dat) => acc + dat[compound], 0);
    };

    const collecitontotal = () => {
        return CustomerMaxBill() - calculateTotal("balance")
    }

    return (
        <Fragment>
            <div className='suppliertable'>
                <span>Amount having: {collecitontotal()}</span>
                <table>
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Name</th>
                            <th>Balance</th>
                            <th style={{ minWidth: "1rem" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((dat, index) => (
                            <Fragment key={index}>
                                <tr>
                                    <td onClick={() => viewhandler(index)}>
                                        {index + 1} {expandedTables[index] ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
                                    </td>
                                    <td onClick={() => directhanlder(dat._id)}>{dat.name}</td>
                                    <td>{dat.balance}</td>
                                    <td id='actioncol' style={{ minWidth: 0 }}>
                                        <i className="fa-solid fa-trash" onClick={() => deletehandler(dat._id, "upper")}></i>
                                    </td>
                                </tr>
                                {expandedTables[index] && (
                                    <Fragment>
                                        <tr style={{ fontSize: "15px", padding: "0" }}>
                                            <th style={{ padding: "5px" }}>Bill</th>
                                            <th style={{ padding: "5px" }}>Payback</th>
                                            <th style={{ padding: "5px" }}>Balance</th>
                                            <th style={{ minWidth: 0 }}></th>
                                        </tr>
                                        {dat.supplier.map((d, ind) => (
                                            <Fragment key={ind}>
                                                <tr>
                                                    <td style={{ padding: "5px" }}>{d.bill}</td>
                                                    <td style={{ padding: "5px" }}>{d.payback}</td>
                                                    <td style={{ padding: "5px" }}>{d.balance}</td>
                                                    <td id='actioncol' >
                                                        <i className="fa-solid fa-pen" onClick={() => editehandler(d._id)}></i>
                                                        <i className="fa-solid fa-trash" onClick={() => deletehandler(d._id, "lower")}></i>
                                                    </td>
                                                </tr>
                                            </Fragment>
                                        ))}
                                    </Fragment>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2">Total</td>
                            <td>{calculateTotal('balance')}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
                {deletepage && (
                    <Fragment>
                        <div className='deletepop'>
                            <i className="fa-solid fa-xmark" onClick={deletehandler}></i>
                            <span>Are you Sure!</span>
                            <button onClick={billdelete}>Delete</button>
                        </div>
                    </Fragment>
                )}
            </div>
        </Fragment>
    );
}
