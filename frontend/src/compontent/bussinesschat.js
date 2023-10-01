import React, { Fragment, Suspense, useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import Home from './home';
import { useNavigate, useParams } from 'react-router-dom';
import { Chatcustomerbalance, Chatstockgram, Chatsupplierbalance, Chatsupplierpayback } from './scrives/chadata';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

export function Bussinesschat() {
    const { chat } = useParams;
    const navigate = useNavigate();
    const [getdata, Setgetdata] = useState([]);
    const [label, Setlabel] = useState([]);
    const [getdatasec, Setgetdatasec] = useState([]);
    const [labelsec, Setlabelsec] = useState([]);
    const [select, Setselect] = useState(0);
    const [select2, Setselect2] = useState(0);
    const [select3, Setselect3] = useState(0);

    useEffect(() => {
        if (chat === "balance") {
            Setselect2("1");
        }
        if (chat === "payload") {
            Setselect2("2");
        }
        if (chat === "stock") {
            Setselect2("3");
        }
        if (chat === "supplier") {
            Setselect2("4");
        }
    }, [])
    const selecthandler2 = (e) => {
        Setselect2(e.target.value)
    }

    const selecthandler = (e) => {
        Setselect(e.target.value)
    }

    const selecthandler3 = (e) => {
        Setselect3(e.target.value)
    }

    useEffect(() => {
        if (!select2 || select2 === "1") {
            Chatcustomerbalance(Setgetdata, Setlabel)
        }
        if (select2 === "2") {
            Chatsupplierpayback(Setgetdata, Setlabel)
        }
        if (select2 === "3") {
            Chatstockgram(Setgetdata, Setlabel)
        }
        if (select2 === "4") {
            Chatsupplierbalance(Setgetdata, Setlabel)
        }
        if (select !== "0") {
            if (select === "1") {
                Chatcustomerbalance(Setgetdatasec, Setlabelsec)
            }
            if (select === "2") {
                Chatsupplierpayback(Setgetdatasec, Setlabelsec)
            }
            if (select === "3") {
                Chatstockgram(Setgetdatasec, Setlabelsec)
            }
            if (select === "4") {
                Chatsupplierbalance(Setgetdatasec, Setlabelsec)
            }
        }
        else {
            Setgetdatasec();
            Setlabel();
        }
    }, [select, select2])


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: select3 === "1" || !select3 ? "Bar Chat" : "Line Chat",
            },
        },
    };

    const labels = label;

    const data = {
        labels,
        datasets: [
            {
                label: select2 === "1" || !select2 ? "balance" : select2 === "2" ? "payback" : select2 === "3" ? "stock" : select2 === "4" ? "Supplier balance" : "",
                data: getdata,
                backgroundColor: select3 === "2" ? 'rgb(138, 43, 226, 0.5)' : 'blueviolet',
                borderColor: select3 === "2" ? 'rgb(138, 43, 226)' : ""
            },
            ...(select !== 0
                ? [
                    {
                        label: select === "1" ? "balance" : select === "2" ? "payback" : select === "3" ? "stock" : select === "4" ? "Supplier balance" : "",
                        data: getdatasec,
                        backgroundColor: select3 === "2" ? 'rgb(255, 0, 102, 0.5)' : '#ff0066',
                        borderColor: select3 === "2" ? 'rgb(255, 0, 102)' : ""
                    }] : [])
        ],
    };

    const closehandler = () => {
        navigate(-1)
    }
    return (
        <Fragment>
            <Home />
            <div className='blurbackground'></div>
            <div className='barchat'>
                <div className='selectchat'>
                    <div className='select1'>
                        <select name='state' id='state1' onChange={selecthandler2}>
                            <option value="1">Balance</option>
                            <option value="2">PayBack</option>
                            <option value="3">Stock</option>
                            <option value="4">Supplier bal</option>
                        </select>
                    </div>
                    <i className="fa-solid fa-link"></i>
                    <div className='select2'>
                        <select name='state' id='state2' onChange={selecthandler}>
                            <option value='0'>none</option>
                            <option value='1'>Balance</option>
                            <option value='2'>PayBack</option>
                            <option value='3'>Stock</option>
                            <option value="4">Supplier bal</option>
                        </select>
                    </div>
                </div>
                <select className='chattype' onChange={selecthandler3}>
                    <option value='1'>Bar Chat</option>
                    <option value='2'>Line Chat</option>
                </select>
                <i class="fa-solid fa-xmark" id='close' onClick={closehandler}></i>
                <div className='chatbox'>
                    {select3 === '1' || !select3 ?
                        <Bar options={options} data={data} /> :
                        <Line options={options} data={data} />
                    }
                </div>
            </div>
        </Fragment>
    )
}
