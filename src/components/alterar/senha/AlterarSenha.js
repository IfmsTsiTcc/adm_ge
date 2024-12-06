import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Apis from '../../../Apis';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import styles from './AlterarSenha.module.css';
import { AiOutlineUser } from 'react-icons/ai';
import Loading from '../../Loading';
const AlterarSenha = (props) => {
    const [usuario, setUsuario] = useState('');
    const [loading, setloading] = useState(false);
    const redirect = useNavigate();
    const handleUsuario = (e) => {
        setUsuario(e.target.value);
    }
    const handleLogin = (e) => {
        e.preventDefault();
        if (usuario === '') {
            alertaErro("Preencha todos os campos")
        }
        if (usuario !== '') {
            setloading(true);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ "email": usuario })
            };
            console.log(requestOptions);

            fetch(Apis.urlAlterarSenha, requestOptions)
                .then((response) => {
                    return response.json();
                })
                .then((result) => {
                    setloading(false);
                    if (result.retorno[0].sucesso) {
                        alertaSucesso(result.retorno[0].mensagem)
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
            <Loading />
        )
    }
    else {
        return (
            <div className={styles.container}>
                <form className={styles.form}>
                    <div className={styles.cabecalho}>
                        <MdOutlineAdminPanelSettings className={styles.icone_cabecalho} />
                        <h3 className={styles.titulo}>ALTERAÇÃO DE SENHA</h3>
                    </div>
                    <div className={styles.label_float}>
                        <input onChange={handleUsuario} value={usuario} type="text" placeholder=" " />
                        <label>email</label>
                        <AiOutlineUser className={styles.icone} />
                    </div>
                    <button onClick={handleLogin} className={styles.botao}>SOLICITAR</button>
                </form>
            </div>
        );
    }
};
export default AlterarSenha;
