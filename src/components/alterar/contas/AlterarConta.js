import React, { useState } from 'react';
import styles from '../../estilos/forms/Forms.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../Loading';
import axios from 'axios';
import Apis from '../../../Apis';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import { useEffect } from 'react';

export default function AlterarConta() {
    const [openConta, setOpenConta] = useState(0);
    const [loading, setLoading] = useState(false);
    const redirect = useNavigate();
    const [formValues, setFormValues] = useState({});
    const parametro = useParams();
    const inputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value })
    }

    useEffect(() => {
        setLoading(true);
        const requestOptions = {
            headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem('token') }
        }
        axios.post(Apis.urlListarOneCaixa, { "id": parametro.id }, requestOptions)
            .then((response) => {
                if (response.data.registros[0].conta_caixa_id > 0) {
                    setOpenConta('1');
                }
                setFormValues(
                    {
                        descricao: response.data.registros[0].descricao,
                        codigo_banco: response.data.registros[0].codigo_banco,
                        codigo_agencia: response.data.registros[0].codigo_agencia,
                        numero_conta: response.data.registros[0].numero_conta,
                        bol_permite_desconto: response.data.registros[0].bol_permite_desconto,
                        bol_perc_valor: response.data.registros[0].bol_perc_valor,
                        bol_perc_desconto: response.data.registros[0].bol_perc_desconto,
                        bol_dias_desconto: response.data.registros[0].bol_dias_desconto,
                        bol_perc_juros_mes: response.data.registros[0].bol_perc_juros_mes,
                        bol_perc_multa: response.data.registros[0].bol_perc_multa,
                        wallet_id: response.data.registros[0].wallet_id,
                        valor_transferencia: response.data.registros[0].valor_transferencia,
                        perc_transferencia: response.data.registros[0].perc_transferencia
                    }
                )
                setLoading(false);
            })
            .catch((erro) => {
                console.log(erro);
                setLoading(false);
            })
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        console.log(data);

        setLoading(true);
        const requestOptions = {
            headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem('token') }
        }
        axios.put(Apis.urlAlterarCaixa, data, requestOptions)
            .then((response) => {
                if (response.data.retorno[0].sucesso) {
                    alertaSucesso(response.data.retorno[0].mensagem);
                    redirect('/listar-contas')
                }
                setLoading(false);
            })
            .catch((erro) => {
                alertaErro(erro.response.data.retorno[0].mensagem)
                console.log(erro);
                console.log(erro.response);
                setLoading(false);
            })
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
                    <h5 className={styles.titulo}>Cadastro de conta</h5>
                    <div className={styles.card_input}>
                        <h5>informações</h5>
                        <input type="text" onChange={inputChange} value={parametro.id} name='id' required />
                        <div className={styles.container_form}>
                            <label className={styles.label}>
                                <span>Descrição</span>
                                <input type="text" onChange={inputChange} value={formValues?.descricao || ''} name='descricao' id="descricao" placeholder='Descrição da conta' required />
                            </label>

                            <label className={styles.label}>
                                <span>É conta bancária?</span>
                                <select value={openConta} onChange={(e) => setOpenConta(e.target.value)} required>
                                    <option value={0}>Não</option>
                                    <option value={1}>Sim</option>
                                </select>
                            </label>
                        </div>
                        {openConta == 1 &&
                            <div className={styles.container_form}>
                                <label className={styles.label}>
                                    <span>Código do banco</span>
                                    <input type="number" onChange={inputChange} value={formValues?.codigo_banco || ''} name='codigo_banco' id="codigo_banco" placeholder='Código do banco' required />
                                </label>
                                <label className={styles.label}>
                                    <span>Código da agência</span>
                                    <input type="number" onChange={inputChange} value={formValues?.codigo_agencia || ''} name='codigo_agencia' id="codigo_agencia" placeholder='Código da agência' required />
                                </label>
                                <label className={styles.label}>
                                    <span>Nº conta</span>
                                    <input type="number" onChange={inputChange} value={formValues?.numero_conta || ''} name='numero_conta' id="numero_conta" placeholder='Número da conta' required />
                                </label>
                            </div>
                        }
                    </div>
                    {openConta == 1 &&
                        <>
                            <div className={styles.card_input}>
                                <h5>boleto</h5>
                                <div className={styles.container_form}>
                                    <label className={styles.label}>
                                        <span>Permitir desconto?</span>
                                        <select onChange={inputChange} value={formValues?.bol_permite_desconto || ''} name='bol_permite_desconto' required>
                                            <option value={0}>Não</option>
                                            <option value={1}>Sim</option>
                                        </select>
                                    </label>
                                    {formValues?.bol_permite_desconto == 1 &&
                                        <>
                                            <label className={styles.label}>
                                                <span>Tipo de desconto</span>
                                                <select onChange={inputChange} value={formValues?.bol_perc_valor || ''} name='bol_perc_valor' required>
                                                    <option value={0}>Por porcentagem</option>
                                                    <option value={1}>Por valor</option>
                                                </select>
                                            </label>
                                            <label className={styles.label}>
                                                <span>Informe {formValues?.bol_perc_valor == 0 ? 'a porcentagem' : 'o valor'} de desconto</span>
                                                <input type="number" onChange={inputChange} value={formValues?.bol_perc_desconto || ''} name='bol_perc_desconto' id="bol_perc_desconto" placeholder={formValues?.bol_perc_valor == 0 ? 'Porcentagem de desconto' : 'Valor de desconto'} required />
                                            </label>
                                        </>

                                    }
                                </div>
                                <div className={styles.container_form}>
                                    <label className={styles.label}>
                                        <span>Dias para desconto</span>
                                        <input type="number" onChange={inputChange} value={formValues?.bol_dias_desconto || ''} name='bol_dias_desconto' id="bol_dias_desconto" placeholder="Informe os dias para aplicar o desconto" required />
                                    </label>
                                    <label className={styles.label}>
                                        <span>Juros</span>
                                        <input type="number" onChange={inputChange} value={formValues?.bol_perc_juros_mes || ''} name='bol_perc_juros_mes' id="bol_perc_juros_mes" placeholder="Informe o valor dos juros" required />
                                    </label>
                                    <label className={styles.label}>
                                        <span>Multa</span>
                                        <input type="number" onChange={inputChange} value={formValues?.bol_perc_multa || ''} name='bol_perc_multa' id="bol_perc_multa" placeholder="Informe o valor da multa" required />
                                    </label>
                                </div>
                            </div>
                            <div className={styles.card_input}>
                                <h5>Asaas</h5>
                                <div className={styles.container_form}>
                                    <label className={styles.label}>
                                        <span>ID Wallet</span>
                                        <input type="text" onChange={inputChange} value={formValues?.wallet_id || ''} name='wallet_id' id="wallet_id" placeholder="Informe o valor dos juros" />
                                    </label>
                                    <label className={styles.label}>
                                        <span>Valor de transferência</span>
                                        <input type="number" onChange={inputChange} value={formValues?.valor_transferencia || ''} name='valor_transferencia' id="valor_transferencia" placeholder="Informe o valor da multa" />
                                    </label>
                                    <label className={styles.label}>
                                        <span>% de transferência</span>
                                        <input type="number" onChange={inputChange} value={formValues?.perc_transferencia || ''} name='perc_transferencia' id="perc_transferencia" placeholder="Informe o valor da multa" />
                                    </label>
                                </div>
                            </div>
                        </>
                    }
                    <div className={styles.container_button}>
                        <button onClick={() => redirect('/listar-contas')} className={styles.cancelar}>Cancelar</button>
                        <button type='submit' className={styles.submit}>Salvar</button>
                    </div>
                </form>
            </div>
        );
    }
}
