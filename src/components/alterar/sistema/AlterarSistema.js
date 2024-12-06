import React, { useState } from 'react';
import styles from '../../estilos/forms/Forms.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { alertaSucesso, alertaErro } from '../../alertas/Alertas';
import Apis from '../../../Apis';
export default function AlterarSistema() {
    const parametro = useParams();
    const [formValues, setFormValues] = useState({ id: parametro.id, descricao: parametro.nome, versao: parametro.versao });
    const redirect = useNavigate();
    const inputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify(data)
        };
        const url = Apis.urlAlterarProduto;
        fetch(url, requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                console.log(result);
                if (result.retorno[0].sucesso) {
                    alertaSucesso(result.retorno[0].mensagem);
                    redirect('/listar-sistemas');
                } else {
                    alertaErro(result.retorno[0].mensagem);
                }
            })
            .catch((erro) => {
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                // redirect('/')
                console.log(erro)
            })

    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* id do sistema */}
                <input type='hidden' name='id' value={parametro.id} />
                <h5 className={styles.titulo}>Alteração de sistema</h5>
                <div className={styles.card_input}>
                    <h5>informações</h5>
                    <div className={styles.container_form}>
                        <label className={styles.label}>
                            <span>Descrição</span>
                            <input name='descricao' type="text" onChange={inputChange} value={formValues.descricao || ''} placeholder='Descrição do sistema' />
                        </label>

                        <label className={styles.label}>
                            <span>Versão</span>
                            <input name='versao' type="text" onChange={inputChange} value={formValues.versao || ''} placeholder='Versão do sistema' />
                        </label>
                    </div>
                </div>

                <div className={styles.container_button}>
                    <button onClick={() => redirect('/listar-sistemas')} className={styles.cancelar}>Cancelar</button>
                    <button type='submit' className={styles.submit}>Salvar</button>
                </div>
            </form>
        </div>
    );
}