import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Backarrow() {
    const navigate = useNavigate();
    const backhandler = () => {
        navigate(-1)
    }

    return (
        <div className='backarrow' onClick={backhandler}><i class="fa-solid fa-arrow-left"></i></div>
    )
}
