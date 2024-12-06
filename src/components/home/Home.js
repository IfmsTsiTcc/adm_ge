import React from 'react';
import Typography from '@mui/material/Typography';
const Home = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '90vh', alignItems: 'center', padding: 20 }}>
        <p style={{textAlign: 'center', color: '#174c4f'}}>Olá <span style={{ fontWeight: 'bold'}}>{localStorage.getItem('nome')}</span>, bem vindo(a) ao painel de gerencimento da GE Sistemas</p>
    </div>
  );
}
export default Home;