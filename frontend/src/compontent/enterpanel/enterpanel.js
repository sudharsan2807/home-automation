import React, { Fragment, useState } from 'react'
import Viewpanel from '../viewpanel'
import { useParams } from 'react-router-dom'
import Stockform from './changeform/stockform';
import Customerform from './changeform/customerform';
import Viewdata from './viewcontent/viewdata';

export default function Enterpanel() {
    const { type } = useParams();
    const { name } = useParams();
    const { id } = useParams();
    const [box, Setbox] = useState(false);
    const close = () => {
        if (id) {
            window.history.go(-2)
        } else {
            window.history.go(-1)
        }
    }
    return (
        <Fragment>
            {type === "add" || "edite" ?
                <Fragment>
                    <Viewdata />
                    <div class="adminboxed" id={box ? 'none' : ''}>
                        <i class="fa-solid fa-x" onClick={close}></i>
                        <span class="titlebox">{type} {name}</span>
                        {name === "customer" ?
                            <Customerform close={close} /> :
                            name === "stock" ?
                                <Stockform close={close} /> : null}
                    </div>
                    <div class="blurbackground" id={box ? 'none' : ''}></div>
                </Fragment>
                : null
            }
        </Fragment>
    )
}
