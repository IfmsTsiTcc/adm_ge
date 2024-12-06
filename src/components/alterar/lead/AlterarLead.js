import React, { useEffect, useState } from 'react';
import styles from '../../estilos/forms/Forms.module.css';
import Apis from '../../../Apis';
import Estados from '../../../estado';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../Loading';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
export default function AlterarLead() {
    const [formValues, setFormValues] = useState([]);
    const [loading, setLoading] = useState(false);

    const parametro = useParams();
    // hook para redirecionar
    const redirect = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("id", parametro.id);
        const data = Object.fromEntries(formData);
        setLoading(true);
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify(data)
        };
        const url = "https://gesuportelogico.com.br/admin/api/leads/update";
        fetch(url, requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                console.log(result);
                setLoading(false);

                if (result.sucesso) {
                    alertaSucesso(result.mensagem);
                    redirect('/listar-leads');
                } else {
                    alertaErro(result.mensagem);
                }
            })
            .catch((erro) => {
                console.log(erro)
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                setLoading(false);
                redirect('/')
            })
    }

    useEffect(() => {
        setLoading(true);
        // listar cliente
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
        };
        fetch(`https://gesuportelogico.com.br/admin/api/leads/read_one/${parametro.id}`, requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                console.log(result);
                if (result.sucesso) {
                    setFormValues({
                        razao_social: result?.registros?.razao_social, nome_fantasia: result?.registros?.nome_fantasia, cnpj: result?.registros?.cnpj,
                        atividade_principal: result?.registros?.atividade_principal, bairro: result?.registros?.bairro, uf: result?.registros?.uf, municipio: result?.registros?.municipio,
                        contato: result?.registros?.contato, situacao: result?.registros?.situacao
                    });
                } else {
                    alertaErro(result.mensagem);
                }
                setLoading(false)
            })
            .catch((erro) => {
                console.log(erro.result)
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                redirect('/')
            })
    }, [])
    if (loading) {
        return (
            <div style={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loading texto="Alterando lead, aguarde"/>
            </div>
        )
    }
    else {
        return (
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* id do cliente */}
                    <input type="hidden" name="id" value={parametro.id} />
                    <h5 className={styles.titulo}>Alteração de Lead</h5>
                    <div className={styles.card_input}>
                        <h5>informações</h5>
                        <div className={styles.container_form}>
                            <label className={styles.label}>
                                <span>CNPJ - CPF</span>
                                <input type="text" onChange={handleInputChange} value={formValues.cnpj || ""} name='cnpj' id="cnpj" placeholder='CNPJ ou CPF' />
                            </label>

                            <label className={styles.label}>
                                <span>ATIVIDADE PRINCIPAL</span>
                                <input type="text" onChange={handleInputChange} value={formValues.atividade_principal || ""} name='atividade_principal' id="atividade_principal" placeholder='Atividade Principal' />
                            </label>

                            <label className={styles.label}>
                                <span>NOME</span>
                                <input type="text" id="razao_social" onChange={handleInputChange} value={formValues.razao_social || ""} name='razao_social' placeholder='Nome' />
                            </label>

                            <label className={styles.label}>
                                <span>APELIDO</span>
                                <input type="text" id="nome_fantasia" onChange={handleInputChange} value={formValues.nome_fantasia || ""} name='nome_fantasia' placeholder='Nome fantasia' />
                            </label>
                        </div>
                    </div>

                    <div className={styles.card_input}>
                        <h5>endereço</h5>
                        <div className={styles.container_form}>
                            <label className={styles.label}>
                                <span>BAIRRO</span>
                                <input type="text" onChange={handleInputChange} value={formValues.bairro || ''} name='bairro' id="bairro" placeholder='Bairro' />
                            </label>

                            <label className={styles.label}>
                                <span>UF</span>
                                <select onChange={handleInputChange} value={formValues.uf || ""} name='uf' id="uf">
                                    {Estados.estados.map((estado, index) => (
                                        <option value={estado.uf} key={index}>{estado.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className={styles.label}>
                                <span>CIDADE</span>
                                <select onChange={handleInputChange} value={formValues.municipio?.toLowerCase() || ""} name='municipio' id="municipio">
                                    {Estados.cidades.map((municipio, index) => (
                                        formValues.uf !== "" && municipio.name_uf === formValues.uf &&
                                        <option value={municipio.name?.toLowerCase()} key={index} style={{textTransform: 'capitalize'}}>{municipio.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className={styles.card_input}>
                        <h5>contato</h5>
                        <div className={styles.container_form}>
                            <label className={styles.label}>
                                <span>CONTATO</span>
                                <input type="number" onChange={handleInputChange} value={formValues.contato || ""} name='contato' id="contato" placeholder='Telefone principal' />
                            </label>

                            <label className={styles.label}>
                                <span>SITUAÇÃO</span>
                                <select onChange={handleInputChange} value={formValues.situacao || ""} name='situacao' id="situacao">
                                    <option value="0">Lead Frio</option>
                                    <option value="1">Lead Quente</option>
                                    <option value="2">Lead com Proposta</option>
                                    <option value="3">Lead Visitado</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className={styles.container_button}>
                        <button onClick={() => redirect('/listar-leads')} className={styles.cancelar}>Cancelar</button>
                        <button type='submit' className={styles.submit}>Salvar</button>
                    </div>
                </form>
            </div>
        );
    }
}