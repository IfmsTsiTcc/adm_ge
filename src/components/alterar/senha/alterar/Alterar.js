import React, { useState } from 'react';
import styles from './Alterar.module.css';
import Apis from '../../../../Apis';
import { useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import { alertaErro, alertaSucesso } from '../../../alertas/Alertas';
import { AiFillEyeInvisible, AiFillEye, AiFillFileMarkdown } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

export default function Alterar() {
    const [showPassword, setShowPassword] = useState(false);
    const [formValues, setFormValues] = useState([]);
    const [open, setOpen] = useState(false);
    const parametro = useParams();
    // hook para redirecionar
    const redirect = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value })
    }
    const handleSubmit = (e) => {
        setOpen(true);
        e.preventDefault();
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
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"email": data.email, "senha": data.senha, "chave": parametro.id})
            }
            fetch(Apis.urlAlterarSenhaEmail, requestOptions)
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    if (result.retorno[0].sucesso) {
                        alertaSucesso(result.retorno[0].mensagem);
                        redirect('/');
                    } else {
                        alertaErro(result.retorno[0].mensagem);
                    }
                })
                .catch((erro) => {
                    alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                    redirect('/')
                    console.log(erro)
                })
        }
    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.cabecalho}>
                    <MdOutlineAdminPanelSettings className={styles.icone_cabecalho} />
                    <h3 className={styles.titulo}>ALTERAÇÃO DE SENHA</h3>
                </div>

                <div className={styles.label_float}>
                    <input onChange={handleInputChange} name='email' id="email" type="text" placeholder=" " />
                    <label>Email</label>
                    <AiFillFileMarkdown className={styles.icone} />
                </div>

                <div className={styles.mult_input}>
                    <div className={styles.label_float}>
                        <input onChange={handleInputChange} name='senha' id="Senha" type={showPassword ? "text" : "password"} placeholder=" " />
                        <label>senha</label>
                        {showPassword ?
                            <AiFillEye className={styles.icone} onClick={() => setShowPassword(!showPassword)} />
                            :
                            <AiFillEyeInvisible className={styles.icone} onClick={() => setShowPassword(!showPassword)} />
                        }
                    </div>

                    <div className={styles.label_float}>
                        <input onChange={handleInputChange} name='confirmar_senha' id="confirmar_senha" type={showPassword ? "text" : "password"} placeholder=" " />
                        <label>confirmar senha</label>
                        {showPassword ?
                            <AiFillEye className={styles.icone} onClick={() => setShowPassword(!showPassword)} />
                            :
                            <AiFillEyeInvisible className={styles.icone} onClick={() => setShowPassword(!showPassword)} />
                        }
                    </div>
                </div>
                <button type='submit' className={styles.botao}>SALVAR</button>
            </form>
        </div>
    );
}