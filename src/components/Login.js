import { Box, Button, Container, Link, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import Apis from '../Apis';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { alertaErro } from './alertas/Alertas';
import styles from './Login.module.css';
import { AiOutlineUser } from 'react-icons/ai';
import Loading from './Loading';
const Login = (props) => {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setloading] = useState(false);
    const redirect = useNavigate();
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    const handleUsuario = (e) => {
        setUsuario(e.target.value);
    }
    const handleSenha = (e) => {
        setSenha(e.target.value);
    }
    const handleLogin = (e) => {
        e.preventDefault();
        if (senha === '') {
            alertaErro("Preencha todos os campos")
        }
        if (usuario === '') {
            alertaErro("Preencha todos os campos")
        }
        if (senha !== '' && usuario !== '') {
            setloading(true);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "usuario": usuario, "senha": senha })
            };
            fetch(Apis.urlLogin, requestOptions)
                .then((response) => {
                    return response.json();
                })
                .then((result) => {
                    setloading(false);
                    if (result.retorno[0].sucesso) {
                        localStorage.setItem('token', result.registros[0].token);
                        localStorage.setItem('nome', result.registros[0].nome);
                        localStorage.setItem('usuario_id', result.registros[0].id);
                        handleNavigate('/home')
                        // props.setToken('token', result.registros[0].token)
                    }
                    else {
                        alertaErro(result.retorno[0].mensagem)
                    }
                })
                .catch((erro) => {
                    setloading(false);
                    alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                    redirect('/')
                })
        }
    }
    const handleNavigate = (url) => {
        redirect(`${url}`);
    }
    if (loading) {
        return (
            <div style={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loading />
            </div>
        )
    }
    else {
        return (
            <div className={styles.container}>
                <form className={styles.form}>
                    <div className={styles.cabecalho}>
                        <MdOutlineAdminPanelSettings className={styles.icone_cabecalho} />
                        <h3 className={styles.titulo}>GE ADMIN</h3>
                    </div>
                    <div className={styles.label_float}>
                        <input onChange={handleUsuario} value={usuario} type="text" placeholder=" " />
                        <label>email</label>
                        <AiOutlineUser className={styles.icone} />
                    </div>

                    <div className={styles.label_float}>
                        <input onChange={handleSenha} value={senha} type={showPassword ? "text" : "password"} placeholder=" " />
                        <label>senha</label>
                        {showPassword ?
                            <AiFillEye className={styles.icone} onClick={handleClickShowPassword} />
                            :
                            <AiFillEyeInvisible className={styles.icone} onClick={handleClickShowPassword} />
                        }
                    </div>
                    <button onClick={handleLogin} className={styles.botao}>ENTRAR</button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                        <a className={styles.link} onClick={() => handleNavigate('/esqueceu-senha')}>Esqueceu a senha</a>
                        <a className={styles.link} onClick={() => handleNavigate('/registrar')}>Criar uma conta </a>
                    </div>
                </form>
            </div>
        );
    }
};
export default Login;
