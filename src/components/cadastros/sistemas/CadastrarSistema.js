import React, { useState } from 'react';
import styles from '../../estilos/forms/Forms.module.css';
import Apis from '../../../Apis';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';

export default function CadastrarSistema() {
    // hook para redirecionar
    const [loading, setLoading] = useState(false);
    const redirect = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        if (data.descricao != '' && data.versao != '') {
            setLoading(true);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
                body: JSON.stringify(data)
            };
            const url = Apis.urlCadProduto;
            fetch(url, requestOptions)
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    console.log(result)
                    if (result.retorno[0].sucesso) {
                        setLoading(false)
                        alertaSucesso(result.retorno[0].mensagem);
                        redirect('/listar-sistemas')
                    } else {
                        setLoading(false)
                        alertaErro(result.retorno[0].mensagem);
                    }
                })
                .catch((erro) => {
                    alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                    redirect('/')
                    console.log(erro)
                })
        } else {
            alertaErro("Todos os campos devem ser preenchidos!");
        }
    }
    if (loading) {
        return (
            <div style={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loading />
            </div>
        )
    } else {
        return (
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h5 className={styles.titulo}>Cadastro de sistema</h5>
                    <div className={styles.card_input}>
                        <h5>informações</h5>
                        <div className={styles.container_form}>
                            <label className={styles.label}>
                                <span>DESCRIÇÃO</span>
                                <input type="text" name='descricao' id="descricao" placeholder='Descrição do sistema' />
                            </label>

                            <label className={styles.label}>
                                <span>VERSÃO</span>
                                <input type="text" name='versao' id="versao" placeholder='Versão do sistema' />
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
}
