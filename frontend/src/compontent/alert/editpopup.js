import React, { Fragment } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { STOCK_DEL } from '../scrives/Api/api';
import Viewpanel from '../viewpanel';
import { CUSTOMER_DEL } from '../scrives/Api/customerApi';

export default function Editepopup() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { name } = useParams();
    const { type } = useParams();

    const closebtn = () => {
        navigate(-1)
    }
    const edithandler = () => {
        navigate('adminpanel')
    }

    const delhandler = () => {
        if (name === "stock") {
            STOCK_DEL(id).then(() => {
                console.log("Edited");
                navigate(-1)
            }).catch((err) => {
                console.log(err);
            })
        }
        if (name === "customer") {
            CUSTOMER_DEL(id).then(() => {
                navigate(-1)
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    return (
        <Fragment>
            <Viewpanel />
            <div className="blurbackground"></div>
            <div className='editpopup'>
                <i className="fa-solid fa-xmark" id='close' onClick={closebtn}></i>
                <span>Click it</span>
                <div className='editbtn' onClick={edithandler}>
                    <span></span>
                    <button>Edite</button>
                    <i className="fa-solid fa-user-pen"></i>
                </div>
                <div className='delbtn' onClick={delhandler}>
                    <span></span>
                    <button>Delete</button>
                    <i className="fa-solid fa-trash"></i>
                </div>
            </div>
        </Fragment>
    )
}
