import React, { Fragment, useEffect, useState } from 'react'
import { CUSTOMER_ADD, CUSTOMER_GET, CUSTOMER_GET_BILL, CUSTOMER_GET_CODE, CUSTOMER_POST, CUSTOMER_PUT } from '../../scrives/Api/customerApi';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_STORAGE } from '../../scrives/storge';
import { Allcustomerdata, Allstackdata } from '../../scrives/data/alldata';
import { Customerpurchase } from './customerpurchase';

export default function Customerform() {
    const { id } = useParams();
    const { type } = useParams();
    const navigate = useNavigate();
    const [checkcod, Setcheckcod] = useState(true);
    const [send, Setsend] = useState({
        bill: 0,
        customer: []
    });
    const [input, Setinput] = useState({
        bill: 0,
        code: "",
        date: "",
        name: "",
        city: "",
        purchase: 0,
        collected: 0,
        pure: 0,
        balance: 0
    });

    const [customerror, Setcustomerror] = useState("");
    const initialstate = {
        bill: { require: false },
        code: { require: false },
        date: { require: false },
        name: { require: false },
        city: { require: false },
        purchase: { require: false },
        collected: { require: false },
        pure: { require: false },
        balance: { require: false },
        customerror: { require: false }
    }
    const [error, Seterror] = useState(initialstate)

    const updateBalance = (newBalance) => {
        Setinput({ ...input, balance: newBalance });
    };

    const getdetail = () => {
        CUSTOMER_GET_CODE(input.code).then((response) => {
            Setcheckcod(false);
            Setinput({
                ...input,
                name: response.data.name,
                city: response.data.city,
                balance: response.data.balance
            })
            Setcustomerror("");
        }).catch(() => {
            Setcheckcod(true);
            Setcustomerror("Invalid code")
        })
    }

    function coderandow() {
        if (input.name && input.date) {
            let second = input.name.slice(0, 2);
            let first = input.city.slice(0, 2);
            return "00" + first + second;
        }
    }

    const inputhandler = (event, name) => {
        Setinput({ ...input, [name]: event.target.value });
    };

    const codedata = Allcustomerdata();

    function checkcode(revcode) {
        const exists = codedata.some((dat) => dat.code === revcode);
        return exists
    }

    useEffect(() => {
        if (type === "edite" && id) {
            CUSTOMER_GET(id).then((Response) => {
                Setinput(Response.data)
            }).catch((err) => {
                console.log(err);
            })
        } else {
            CUSTOMER_GET_BILL(GET_STORAGE()).then((Response) => {
                console.log("Geted", Response.data[0].customer);
                const data = Response.data[0].customer;
                const value = data.map((dat, index) => index);
                const maxvalue = Math.max.apply(null, value)
                Setinput({
                    ...input,
                    date: Response.data[0].customer[maxvalue].date,
                    city: Response.data[0].customer[maxvalue].city,
                })
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [])

    useEffect(() => {
        if (type === "add") {
            Setinput({ ...input, bill: GET_STORAGE() });
        }
    }, [input.code])

    useEffect(() => {
        Setinput({ ...input, code: coderandow() });
    }, [input.name, input.city]);

    useEffect(() => {
        Setsend({ ...send, bill: input.bill, customer: [input] })
    }, [input])

    const submitHandler = (e) => {
        e.preventDefault();
        let hasError = false;
        let error = initialstate;
        // Check for errors in each input field and set the corresponding error state
        if (input.bill === 0) {
            error.bill.require = true
            hasError = true;
        } else if (input.bill !== 0) {
            error.bill.require = false
        }

        if (input.code === "") {
            error.code.require = true
            hasError = true;
        } else {
            error.code.require = false
        }

        if (!input.date) {
            error.date.require = true
            hasError = true;
        } else if (input.date !== "") {
            error.date.require = false
        }

        if (input.name === "") {
            error.name.require = true;
            hasError = true;
        } else if (input.name !== "") {
            error.name.require = false
        }

        if (input.city === "") {
            error.city.require = true
            hasError = true;
        } else if (input.city !== "") {
            error.city.require = false
        }

        if (input.purchase === 0) {
            error.purchase.require = true;
            hasError = true;
        } else if (input.purchase !== 0) {
            error.purchase.require = false
        }

        if (input.pure === 0) {
            error.pure.require = true
            hasError = true;
        } else if (input.pure !== 0) {
            error.pure.require = false
        }

        if (input.collected === 0) {
            error.collected.require = true
            hasError = true;
        } else if (input.collected !== 0) {
            error.collected.require = false
        }

        if (input.balance === 0) {
            error.balance.require = true;
            hasError = true;
        } else if (input.balance !== 0) {
            error.balance.require = false
        }

        if (type === "add") {
            if (checkcod) {
                if (checkcode(input.code)) {
                    Setcustomerror("code is alearey exist");
                    hasError = true;
                    error.customerror.require = true;
                } else {
                    Setcustomerror('');
                    error.customerror.require = false;
                }
            }
        }
        if (!(error.bill && error.code && error.date && error.balance && error.name && error.city && error.purchase && error.collected && error.pure && error.customerror)) {
            hasError = false;
        }

        Seterror(error)
        if (!hasError) {
            if (id && type === "add") {
                CUSTOMER_ADD(send, id).then((response) => {
                    console.log(response);
                    navigate(-2)
                }).catch((err) => {
                    console.log(err);
                })
            }
            if (id && type === "edite") {
                CUSTOMER_PUT(id, input).then((response) => {
                    navigate(-2)
                }).catch((err) => {
                    console.log(err);
                })
            }
            if (!id && type === "add") {
                CUSTOMER_POST(send)
                    .then((response) => {
                        console.log(response);
                        navigate(-1)
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    };
    return (
        <Fragment>
            <form onSubmit={submitHandler} autoComplete='off'>
                <div className="inputbox" id="input">
                    <input type="text" value={input.bill} onChange={(e) => inputhandler(e, "bill")} />
                    <span>Enter Bill</span>
                </div>
                <div className="inputbox" id="input1">
                    <input type="text" value={input.code} onChange={(e) => inputhandler(e, "code")} name='code' />
                    <span>Enter Code</span>
                    <button onClick={getdetail} id='getdetail'>Get</button>
                </div>
                <div className="inputbox" id="input2">
                    <input type="text" value={input.date} onChange={(e) => inputhandler(e, "date")} name='date' />
                    <span>Enter Date</span>

                </div>
                <div className="inputbox" id="input3">
                    <input type="text" value={input.name} onChange={(e) => inputhandler(e, "name")} name='name' />
                    <span>Enter Name</span>

                </div>
                <div className="inputbox" id="input4">
                    <input type="text" value={input.city} onChange={(e) => inputhandler(e, "city")} name='city' />
                    <span>Enter City</span>

                </div>
                <div className="inputbox" id="inpu5">
                    <input type="text" value={input.purchase} onChange={(e) => inputhandler(e, "purchase")} name='purchase' />
                    <span>Enter Purchase</span>

                </div>
                <div className="inputbox" id="input6">
                    <input type="text" value={input.pure} onChange={(e) => inputhandler(e, "pure")} name='pure' />
                    <span>Enter Pure</span>

                </div>
                <div className="inputbox" id="input7">
                    <input type="text" value={input.collected} onChange={(e) => inputhandler(e, "collected")} name='collected' />
                    <span>Enter Collected</span>

                </div>
                <div className="inputbox" id="input8">
                    <input type="text" value={input.balance} onChange={(e) => inputhandler(e, "balance")} name='balance' />
                    <span>Enter Balance</span>

                </div>
                <hr />
                {/* <div className='productentery'>
                    <span className='title2'>Selling Product Details</span>
                    <Customerpurchase balance={updateBalance} />
                </div> */}
                <span className='error-register'>{error.bill.require ? "Please enter bill"
                    : customerror !== "" ? customerror
                        : error.code.require ? "Please enter code"
                            : error.date.require ? "Please enter date"
                                : error.name.require ? "Please enter name"
                                    : error.collected.require ? "Please enter collected"
                                        : error.pure.require ? "Please enter pure value"
                                            : error.purchase.require ? "Please enter purchase"
                                                : error.balance.require ? "Please enter balance"
                                                    : null}</span>
                <div className="finalsubmit">
                    <button>Submit</button>
                </div>
            </form>
        </Fragment>
    )
}
