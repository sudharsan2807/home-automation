import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Editepopup from './alert/editpopup';
import { STOCK_GET_ALL, STOCK_GET_BILL, STOCK_SEARCH } from './scrives/Api/api';
import { ADD_STORAGE } from './scrives/storge';
import { CUSTOMER_GET_ALL, CUSTOMER_SEARCH } from './scrives/Api/customerApi';
import { Customertotal } from './scrives/data/totalshock';
import Viewpanelsupplier from './viewpanelsupplier';
import jsPDF from "jspdf";
import 'jspdf-autotable';

export default function Viewpanel() {
    const { name } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [popup, Setpopup] = useState(false);
    const [allProductData, setAllProductData] = useState([]);
    const [billmax, Setbillmax] = useState([]);
    const [total, Settotal] = useState({
        pieces: 0,
        gram: 0,
        pure: 0,
        balance: 0,
        purchase: 0,
        pure: 0,
        collected: 0,
        cbalance: 0
    });
    const [option, Setoption] = useState('');

    const edithander = (id) => {
        Setpopup(!popup);
        if (name === "stock") {
            navigate(`/viewpanel/stock/edite/${id}`);
        }
        if (name === "customer") {
            navigate(`/viewpanel/customer/edite/${id}`);
        }
    };

    const selectHandler = (event) => {
        Setoption(event.target.value);
    };

    useEffect(() => {
        if (name === "stock") {
            STOCK_GET_ALL()
                .then((response) => {
                    Setbillmax(response.data)
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (name === "customer") {
            CUSTOMER_GET_ALL()
                .then((response) => {
                    Setbillmax(response.data)
                })
                .catch((err) => {
                    console.log(err);
                });
        }

    }, []);


    const calculatebalance = (compound) => {
        return Customertotal(compound);
    };

    const addHandler = () => {
        if (name === "stock") {
            STOCK_GET_ALL()
                .then((response) => {
                    const data = response.data;
                    const bills = data.map((dat, index) => dat.bill);
                    console.log(bills);
                    if (bills.length !== 0) {
                        const maxbill = Math.max(...bills);
                        ADD_STORAGE(maxbill + 1);
                        navigate('add');
                    } else {
                        ADD_STORAGE(1);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
        if (name === "customer") {
            CUSTOMER_GET_ALL()
                .then((response) => {
                    const data = response.data;
                    const bills = data.map((dat, index) => dat.bill);
                    if (bills.length !== 0) {
                        const maxbill = Math.max(...bills);
                        ADD_STORAGE(maxbill + 1);
                        navigate('add');
                    } else {
                        ADD_STORAGE(1);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    };

    const calculateTotalPieces = (compound) => {
        return allProductData.reduce((acc, dat) => acc + dat[compound], 0);
    };

    const calculatepuretotal = () => {
        const pureTotal = allProductData.reduce((acc, dat) => acc + (dat.pure * dat.gram) / 100, 0);
        return Number(pureTotal.toFixed(2));
    };

    useEffect(() => {
        if (name === "stock") {
            Settotal({
                ...total,
                pieces: calculateTotalPieces('pieces'),
                gram: calculateTotalPieces('gram'),
                pure: calculatepuretotal(),
                balance: calculateTotalPieces('balance')
            });
        }
        if (name === "customer") {
            Settotal({
                ...total,
                purchase: calculateTotalPieces('purchase'),
                collected: calculateTotalPieces('collected'),
                pure: calculateTotalPieces('pure'),
                cbalance: calculateTotalPieces('balance')
            });
        }
    }, [data, popup]);

    useEffect(() => {
        if (name === 'stock') {
            STOCK_GET_ALL()
                .then((res) => {
                    setData(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (name === 'customer') {
            CUSTOMER_GET_ALL()
                .then((response) => {
                    const uniqueData = response.data.map((item) => {
                        // Access the "product" array and filter unique items based on "code"
                        const uniqueProducts = item.customer.reduce((accumulator, currentValue) => {
                            if (!accumulator.some((prod) => prod.code === currentValue.code)) {
                                accumulator.push(currentValue);
                            }
                            return accumulator;
                        }, []);

                        // Modify the "customer" array to filter unique items within the "data" array
                        const updatedProducts = uniqueProducts.map((customer) => {
                            const uniqueData = [...new Set(customer.data)]; // Filter unique items in "data" array
                            return { ...customer, data: uniqueData };
                        });

                        // Return a new object with the updated "customer" array
                        return { ...item, customer: updatedProducts };
                    });

                    setData(uniqueData);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [name, popup, option]);

    useEffect(() => {
        const combinedProductData = data.reduce((accumulator, currentBill) => {
            if (name === "stock") {
                currentBill.product.forEach((product) => {
                    accumulator.push(product);
                });
            }
            if (name === "customer") {
                currentBill.customer.forEach((product) => {
                    accumulator.push(product);
                });
            }
            return accumulator;
        }, []);

        setAllProductData(combinedProductData);
    }, [data, option]);

    const searchhandle = (e) => {
        const searchval = e.target.value;
        if (name === "customer") {
            CUSTOMER_SEARCH(searchval).then((response) => {
                setAllProductData(response.data)
            }).catch((err) => {
                console.log(err);
            })
        }
        if (name === "stock") {
            STOCK_SEARCH(searchval).then((response) => {
                setAllProductData(response.data)
            }).catch((err) => {
                console.log(err);
            })
        }
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
        doc.save(`data_${name}.pdf`)
    }
    return (
        <Fragment>
            {(name === 'customer' || name === 'stock' || name === 'supplier') && (
                <div>
                    <div className='backarrow' onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i></div>
                    <div className="backcontain"></div>
                    <div className="balancesheet">
                        <span>{name} Balance</span>
                        {
                            name !== "supplier" ? (
                                <div className="searchbox">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                    <input type="search" placeholder="type name or code you wanted" onChange={(e) => searchhandle(e)} />
                                </div>
                            ) : null
                        }
                        <div className='panel'>
                            {name === "stock" ? (
                                <div className='infopanel' id='infopanel'>
                                    <span>Balance</span>
                                    <span>Gram | {calculatebalance("purchase") - total.gram}</span>
                                    <span>Pure | {calculatebalance("pure") - total.pure}</span>
                                </div>
                            ) : null}
                            {name === "stock" || name === "customer" ? (
                                <div className="adminpanel" id={name === 'stock' ? 'adminpanel' : null} style={{ width: name === "customer" ? "100 %" : null }}>
                                    <button onClick={addHandler}>Bill +</button>
                                    <button id="download" onClick={pdfdownload}>Download</button>
                                    <select onChange={selectHandler}>
                                        <option value={"all"}>All</option>
                                        {billmax.map((dat, index) => (
                                            <option key={index + 1} value={index + 1}>Bill {dat.bill}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : null}
                        </div>

                        <div className="classNametable">
                            <div className='tablebox'>
                                {name === 'customer' ? (
                                    <table id='datatable'>
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
                                            {allProductData.map((dat, index) => (
                                                <tr onClick={() => edithander(dat._id)} key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{dat.code}</td>
                                                    <td>{dat.date}</td>
                                                    <td>{dat.name}</td>
                                                    <td>{dat.city}</td>
                                                    <td>{dat.purchase}</td>
                                                    <td>{dat.pure}%</td>
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
                                ) : name === 'stock' ? (
                                    <table id='tablestock'>
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
                                            {allProductData.map((dat, index) => (
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
                                                </tr>
                                            ))}
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
                                    </table>
                                )
                                    : name === "supplier" ? (<Viewpanelsupplier />) : null}
                            </div>
                        </div>
                    </div>
                    {popup ? <Editepopup closepanel={edithander} /> : null}
                </div>
            )}
        </Fragment>
    );
}
