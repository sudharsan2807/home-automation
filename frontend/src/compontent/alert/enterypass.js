import React, { Fragment, useEffect, useState } from 'react'
import { MESS_SEND, PASS_GET } from '../scrives/Api/api';
import { useNavigate } from 'react-router-dom';
import Auth from '../scrives/auth';
import { ID_GET, ID_STORAGE } from '../scrives/storge';

export default function Enterypass(props) {
    const [input, Setinput] = useState();
    const [data, Setdata] = useState([]);
    const [error, Seterror] = useState();
    const navigate = useNavigate();
    const inputhandler = (event) => {
        Setinput(event.target.value)
    }

    useEffect(() => {
        PASS_GET().then((response) => {
            Setdata(response.data);
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    const submitHandler = () => {
        const matchingData = data.find((item) => item.password === input);
        if (matchingData) {
            const matchedId = matchingData._id;
            ID_STORAGE(matchedId); // Send the matched ID wherever you need it.
            if (Auth()) {
                return navigate('home')
            }
        } else {
            Seterror("Incorrect password");
        }
        if (matchingData) {
            MESS_SEND("Entery to bussiness jewelry page")
        }
    }


    return (
        <Fragment>
            <div className="blurbackground"></div>
            <div className="enterypass">
                <i className="fa-solid fa-x" onClick={props.close}></i>
                <span>Please enter the password</span>
                <div className="inputbox">
                    <input type="text" onChange={inputhandler} />
                    <span>Enter Password</span>
                </div>
                <span className='error-register'>{error}</span>
                <button onClick={submitHandler}>Submit</button>
            </div>
        </Fragment>
    )
}
