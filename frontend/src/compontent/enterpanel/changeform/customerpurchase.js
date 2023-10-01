import React, { useEffect, useState } from 'react';
import { STOCK_GET_CODE } from '../../scrives/Api/api';

export function Customerpurchase(props) {
    const [data, Setdata] = useState([]);
    const [getdata, Setgetdata] = useState([]);
    const [input, setInput] = useState({
        code: "",
        name: "",
        pure: 0,
        piece: 0,
        gram: 0
    });

    const [calculationval, Setcalculationval] = useState({
        calpure: 0,
        calweight: 0
    });

    const inputHandler = (e, name, index) => {
        const { value } = e.target;
        const updatedProducts = [...data];
        updatedProducts[index][name] = value;
        Setdata(updatedProducts);
    }

    const calculateTotalPieces = (compound) => {
        return data.reduce((acc, dat) => acc + dat[compound], 0);
    };

    useEffect(() => {
        if (input.code !== "") {
            STOCK_GET_CODE(input.code).then((response) => {
                setInput({
                    ...input,
                    name: response.data.name,
                })
                Setgetdata([...getdata, response.data])
                Setcalculationval({
                    ...calculationval,
                    calpure: response.data.pure,
                    calweight: response.data.weight
                })
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [input.code])

    useEffect(() => {
        if (input.pure !== "" && input.piece !== "") {
            const gramvalue = input.piece * calculationval.calweight;
            const purevalue = (input.pure * gramvalue) / 100;
            setInput({ ...input, gram: purevalue })
        }
    }, [input.pure, input.piece])

    const addHandler = () => {
        Setdata([...data, input]);
    }

    const deleteHandler = (index) => {
        const updatedRows = [...data];
        updatedRows.splice(index, 1);
        Setdata(updatedRows);
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Pure %</th>
                        <th>Piece</th>
                        <th>Gram</th>
                        <th>
                            <button onClick={addHandler} style={{ backgroundColor: "transparent", border: 0 }}>Add +</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((dat, index) => (
                        <tr key={index}>
                            <td><input onChange={(e) => inputHandler(e, "code", index)} value={dat.code} /></td>
                            <td><input onChange={(e) => inputHandler(e, "name", index)} value={dat.name} /></td>
                            <td><input onChange={(e) => inputHandler(e, "pure", index)} value={dat.pure} /></td>
                            <td><input onChange={(e) => inputHandler(e, "piece", index)} value={dat.piece} /></td>
                            <td><input onChange={(e) => inputHandler(e, "gram", index)} value={dat.gram} /></td>
                            <td><button onClick={deleteHandler}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="2">Total</td>
                        <td>150</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
