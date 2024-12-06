import React, { useState } from 'react';
import styles from '../../estilos/forms/Forms.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { alertaSucesso, alertaErro } from '../../alertas/Alertas';
import Apis from '../../../Apis';
export default function AlterarNatureza() {
    const parametro = useParams();
    const [formValues, setFormValues] = useState({ id: parametro.id, descricao: parametro.descricao, RD: parametro.RD, conta: parametro.conta });
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
        const url = Apis.urlAlterarNatureza;
        fetch(url, requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                console.log(result);
                if (result.retorno[0].sucesso) {
                    alertaSucesso(result.retorno[0].mensagem);
                    redirect('/listar-natureza');
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
                {/* id do natureza */}
                <input type='hidden' name='id' value={parametro.id} />
                <h5 className={styles.titulo}>Alteração de Natureza</h5>
                <div className={styles.card_input}>
                    <h5>informações</h5>
                    <div className={styles.container_form}>
                        <label className={styles.label}>
                            <span>Descrição</span>
                            <input name='descricao' type="text" onChange={inputChange} value={formValues.descricao || ''} placeholder='Descrição a natureza' />
                        </label>

                        <label className={styles.label}>
                            <span>TIPO</span>
                            <select name='RD' id="RD" onChange={inputChange} value={formValues.RD || ''}>
                                <option value='0'>Receita</option>
                                <option value='1'>Despesa</option>
                            </select>
                        </label>

                        <label className={styles.label}>
                            <span>Versão</span>
                            <input name='conta' type="text" onChange={inputChange} value={formValues.conta || ''} placeholder='Conta' />
                        </label>
                    </div>
                </div>

                <div className={styles.container_button}>
                    <button onClick={() => redirect('/listar-natureza')} className={styles.cancelar}>Cancelar</button>
                    <button type='submit' className={styles.submit}>Salvar</button>
                </div>
            </form>
        </div>
    );
}