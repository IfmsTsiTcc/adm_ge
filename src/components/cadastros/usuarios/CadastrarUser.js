import React, { useState } from 'react';
import styles from '../../estilos/forms/Forms.module.css';
import Apis from '../../../Apis';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { alertaSucesso } from '../../alertas/Alertas';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import axios from 'axios';

export default function CadastrarUser() {
    const alertaErro = (texto) => {
        swal({
            title: "Atenção",
            text: texto,
            icon: "error",
            dangerMode: true,
            className: 'alertas-cad-empresa'
        })
    }
    const [formValues, setFormValues] = useState([]);
    // hook para redirecionar
    const redirect = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const handleUser = async () => {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            if (data.senha !== data.confirmar_senha) {
                alertaErro("Os campos senha e confirmar senha devem ser iguais")
            }
            if (data.senha === "" || data.confirmar_senha === "") {
                alertaErro("Os campos senha e confirmar senha devem ser preenchidos")
            }
            if (data.senha !== "" && data.confirmar_senha !== "" && data.senha === data.confirmar_senha) {
                const requestOptions = {
                    headers: { 'Content-Type': 'application/json' },
                }
                const body = JSON.stringify(data)
                await axios.post(Apis.urlCadUser, body, requestOptions)
                    .then((response) => {
                        console.log(response.status);
                        if (response.status <= 201 && response.data.retorno[0].sucesso) {
                            redirect('/listar-user');
                            return alertaSucesso(response.data.retorno[0].mensagem);
                        }
                        alertaErro(`Erro - ${response.data.retorno[0].mensagem}`);
                    })
                    .catch((erro) => {
                        console.log(erro.response);
                        if (erro.response.status > 201) {
                            alertaErro(`Erro ${erro.response.status} - ${erro.response.data.retorno[0].mensagem}`);
                        }
                    })
            }
        }
        handleUser();
    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h5 className={styles.titulo}>Cadastro de Usuário</h5>
                <div className={styles.card_input}>
                    <h5>informações</h5>
                    <div className={styles.container_form}>
                        <label className={styles.label} style={{ width: '100%' }}>
                            <span>USUÁRIO</span>
                            <input type="text" onChange={handleInputChange} name='nome' id="nome" placeholder='Usuário' />
                        </label>

                        <label className={styles.label}>
                            <span>EMAIL</span>
                            <input type="email" onChange={handleInputChange} name='email' id="email" placeholder='Email' />
                        </label>

                        <label className={styles.label}>
                            <span>CPF OU CNPJ</span>
                            <input type="text" onChange={handleInputChange} name='cpf' id="cpf" placeholder='CPF ou CNPJ' />
                        </label>

                        <label className={styles.label}>
                            <span>SENHA</span>
                            <input type="password" onChange={handleInputChange} name='senha' id="Senha" placeholder='Senha' />
                        </label>

                        <label className={styles.label}>
                            <span>CONFIRMAR SENHA</span>
                            <input type="password" onChange={handleInputChange} name='confirmar_senha' id="confirmar_senha" placeholder='Confirmar senha' />
                        </label>
                    </div>
                </div>

                <div className={styles.container_button}>
                    <button onClick={() => redirect('/listar-user')} className={styles.cancelar}>Cancelar</button>
                    <button type='submit' className={styles.submit}>Salvar</button>
                </div>
            </form>
        </div>
    );
}
