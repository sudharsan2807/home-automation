import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CustomerMaxBill, Customertotal, Suppliertotal, Totalvalue } from './scrives/data/totalshock';
import { Bussinesschat } from './bussinesschat';

export default function Home() {
    const [name, Setname] = useState("");
    const navigate = useNavigate();
    const custormerhandler = () => {
        Setname("customer")
    }

    const stockhandler = () => {
        Setname("stock")
    }

    const supplierhandler = () => {
        Setname("supplier")
    }
    useEffect(() => {
        if (name !== "") {
            return navigate(`/viewpanel/${name}`)
        }

    }, [name, navigate])

    const calculatebalance = (compound) => {
        return Customertotal(compound);
    };

    const stockvalue = (compound) => {
        return Totalvalue("N", compound)
    }

    const paybacktotal = () => {
        return Suppliertotal("balance")
    }

    return (
        <Fragment>
            <div class="backcontain"></div>
            <div class="home">
                <span class="title">jewelry</span>
                <div class="viewpanel">
                    <div class="box">
                        <i class="fa-solid fa-play"></i>
                        <div class="circle" onClick={() => navigate("chat")}><span>{calculatebalance('balance')}</span></div>
                        <div className='Infoword'>
                            <span>Balance</span>
                            <p style={{ fontSize: "0.5rem" }}>(please click number round for barchat)</p>
                        </div>
                    </div>
                    <div class="box">
                        <i class="fa-solid fa-play"></i>
                        <div class="circle" onClick={() => navigate("chat")}><span>{paybacktotal()}</span></div>
                        <div className='Infoword'>
                            <span>PayBack</span>
                            <p style={{ fontSize: "0.5rem" }}>(please click number round for barchat)</p>
                        </div>
                    </div>
                    <div class="box">
                        <i class="fa-solid fa-play"></i>
                        <div class="circle" onClick={() => navigate("chat")}><span>{paybacktotal() - CustomerMaxBill()}</span></div>
                        <div className='Infoword'>
                            <span>Profite</span>
                            <p style={{ fontSize: "0.5rem" }}>(please click number round for barchat)</p>
                        </div>
                    </div>
                    <div class="box">
                        <i class="fa-solid fa-play"></i>
                        <div class="circle" onClick={() => navigate("chat")}><span>{stockvalue('gram') - calculatebalance('purchase')}</span></div>
                        <div className='Infoword'>
                            <span>Stock</span>
                            <p style={{ fontSize: "0.5rem" }}>(please click number round for barchat)</p>
                        </div>
                    </div>
                </div>
                <div class="adminpanel">
                    <div class="box" onClick={custormerhandler}>
                        <i class="fa-solid fa-play" id="close"></i>
                        <div class="overlay"></div>
                        <span>Customer</span>
                        <i class="fa-solid fa-users"></i>
                        <img src="/material/glowing-lines-human-heart-3d-shape-dark-background-generative-ai.jpg" alt="" />
                    </div>
                    <div class="box" onClick={stockhandler}>
                        <i class="fa-solid fa-play" id="close"></i>
                        <div class="overlay"></div>
                        <span>Stock</span>
                        <i class="fa-solid fa-layer-group"></i>
                        <img src="/material/1128.jpg" alt="" />
                    </div>
                    <div class="box" onClick={supplierhandler}>
                        <i class="fa-solid fa-play" id="close"></i>
                        <div class="overlay"></div>
                        <span>Supplier</span>
                        <i class="fa-solid fa-parachute-box"></i>
                        <img src="/material/159Z_2107.w026.n002.628B.p1.628.jpg" alt="" />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
