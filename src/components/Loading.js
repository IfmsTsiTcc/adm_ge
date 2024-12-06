import React from "react";
import ReactLoading from 'react-loading';

export default function Loading({ texto }) {
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <ReactLoading type='spokes' color='#174c4f' width='60px' />
            <p style={{ color: '#174c4f' }}>{texto ? texto : 'buscando dados, aguarde'}</p>
        </div>
    )
}