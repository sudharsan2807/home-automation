import React, { Fragment, useEffect, useState } from 'react';
import { STOCK_ADD, STOCK_GET, STOCK_GET_BILL, STOCK_POST, STOCK_PUT } from '../../scrives/Api/api';
import { GET_STORAGE } from '../../scrives/storge';
import { useNavigate, useParams } from 'react-router-dom';
import { Allstackdata } from '../../scrives/data/alldata';

export default function Stockform(props) {
    const { id } = useParams();
    const { type } = useParams();
    const navigate = useNavigate();
    const [send, Setsend] = useState({
        bill: 0,
        product: []
    });
    const [input, Setinput] = useState({
        bill: 0,
        code: "",
        date: "",
        name: "",
        seller: "",
        pieces: 0,
        pure: 0,
        weight: 0,
        gram: 0,
        balance: 0
    });

    const [customerror, Setcustomerror] = useState("");
    const initialstate = {
        bill: { require: false },
        code: { require: false },
        date: { require: false },
        name: { require: false },
        seller: { require: false },
        pieces: { require: false },
        pure: { require: false },
        weight: { require: false },
        gram: { require: false },
        customerror: { require: false }
    }
    const [error, Seterror] = useState(initialstate)

    function coderandow() {
        if (input.name && input.date) {
            const numericDate = input.date.replace(/\D/g, '');
            let first = numericDate.slice(0, 4);
            let second = input.name.slice(0, 2);
            return first + second;
        }
    }

    const inputhandler = (event, name) => {
        Setinput({ ...input, [name]: event.target.value });
    };

    const codedata = Allstackdata();
    const code = codedata.map((dat) => dat.code);

    function checkcode(revcode) {
        const exists = code.some((dat) => dat === revcode);
        return exists
    }

    useEffect(() => {
        if (type === "edite" && id) {
            STOCK_GET(id).then((Response) => {
                Setinput(Response.data)
            }).catch((err) => {
                console.log(err);
            })
        } else {
            STOCK_GET_BILL(GET_STORAGE()).then((Response) => {
                console.log("Geted", Response.data[0].product);
                const data = Response.data[0].product;
                const value = data.map((dat, index) => index);
                const maxvalue = Math.max.apply(null, value)
                Setinput({
                    ...input,
                    date: Response.data[0].product[maxvalue].date,
                    seller: Response.data[0].product[maxvalue].seller,
                    pure: Response.data[0].product[maxvalue].pure
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
    }, [input.name, input.date]);

    useEffect(() => {
        const calculatedGram = input.pieces * input.weight;
        Setinput({ ...input, gram: calculatedGram, balance: calculatedGram });
        console.log(input.balance);
    }, [input.weight, input.pieces]);

    useEffect(() => {
        Setsend({ ...send, bill: input.bill, product: [input] })
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

        if (input.seller === "") {
            error.seller.require = true
            hasError = true;
        } else if (input.seller !== "") {
            error.seller.require = false
        }

        if (input.pieces === 0) {
            error.pieces.require = true;
            hasError = true;
        } else if (input.pieces !== 0) {
            error.pieces.require = false
        }

        if (input.pure === 0) {
            error.pure.require = true
            hasError = true;
        } else if (input.pure !== 0) {
            error.pure.require = false
        }

        if (input.gram === 0) {
            error.gram.require = true
            hasError = true;
        } else if (input.gram !== 0) {
            error.gram.require = false
        }

        if (input.weight === 0) {
            error.weight.require = true;
            hasError = true;
        } else if (input.weight !== 0) {
            error.weight.require = false
        }

        if (input.pure > 100) {
            Setcustomerror("Pure must be percentage value")
            hasError = true;
        } else {
            Setcustomerror('');
        }

        if (type === "add") {
            if (checkcode(input.code)) {
                Setcustomerror("code is alearey exist");
                hasError = true;
                error.customerror.require = true;
            } else {
                Setcustomerror('');
                error.customerror.require = false;
            }
        }
        if (!(error.bill && error.code && error.date && error.gram && error.name && error.seller && error.pieces && error.pure && error.customerror)) {
            hasError = false;
        }

        Seterror(error)
        if (!hasError) {
            if (id && type === "add") {
                STOCK_ADD(send, id).then((response) => {
                    console.log(response);
                    navigate(-2)
                }).catch((err) => {
                    console.log(err);
                })
            }
            if (id && type === "edite") {
                STOCK_PUT(id, input).then((response) => {
                    navigate(-2)
                }).catch((err) => {
                    console.log(err);
                })
            }
            if (!id && type === "add") {
                STOCK_POST(send)
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
            <form onSubmit={submitHandler}>
                <div className="inputbox" id="input">
                    <input type="text" value={input.bill} onChange={(e) => inputhandler(e, "bill")} />
                    <span>Enter Bill</span>
                </div>

                <div className="inputbox" id="input1">
                    <input type="text" value={input.code} onChange={(e) => inputhandler(e, "code")} />
                    <span>Enter Code</span>
                </div>
                <div className="inputbox" id="input2">
                    <input type="text" value={input.date} onChange={(e) => inputhandler(e, "date")} />
                    <span>Enter Date</span>

                </div>
                <div className="inputbox" id="input3">
                    <input type="text" value={input.name} onChange={(e) => inputhandler(e, "name")} />
                    <span>Item Name</span>

                </div>
                <div className="inputbox" id="input4">
                    <input type="text" value={input.seller} onChange={(e) => inputhandler(e, "seller")} />
                    <span>Enter Seller Name</span>

                </div>
                <div className="inputbox" id="inpu5">
                    <input type="text" value={input.pieces} onChange={(e) => inputhandler(e, "pieces")} />
                    <span>Enter No.of pieces</span>

                </div>
                <div className="inputbox" id="input6">
                    <input type="text" value={input.pure} onChange={(e) => inputhandler(e, "pure")} />
                    <span>Enter Pure Percentage </span>

                </div>
                <div className="inputbox" id="input7">
                    <input type="text" value={input.weight} onChange={(e) => inputhandler(e, "weight")} />
                    <span>Enter Per pieces weight</span>

                </div>
                <div className="inputbox" id="input8">
                    <input type="text" value={input.gram} onChange={(e) => inputhandler(e, "gram")} />
                    <span>Enter to gram</span>

                </div>
                {type === "edite" ?
                    <div className="inputbox" id="input8">
                        <input type="text" value={input.balance} onChange={(e) => inputhandler(e, "balance")} />
                        <span>Enter to balance</span>
                    </div>
                    : null}
                <span className='error-register'>{error.bill.require ? "Please enter bill"
                    : error.code.require ? "Please enter code"
                        : error.date.require ? "Please enter date"
                            : error.name.require ? "Please enter name"
                                : error.seller.require ? "Please enter seller name"
                                    : error.pieces.require ? "Please enter no.of pieces"
                                        : error.pure.require ? "Please enter pure value"
                                            : error.weight.require ? "Please enter weight"
                                                : error.gram.require ? "Please enter gram"
                                                    : customerror !== "" ? customerror
                                                        : null}</span>
                <div className="finalsubmit">
                    <button>Submit</button>
                </div>
            </form>
        </Fragment>
    );
}
