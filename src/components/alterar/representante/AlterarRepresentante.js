import React, { useEffect, useState } from 'react';
import styles from '../../estilos/forms/Forms.module.css';
import Estados from '../../../estado';
import Apis from '../../../Apis';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../Loading';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
export default function AlterarRepresentante() {
    const [loading, setLoading] = useState(false);
    const redirect = useNavigate();
    const parametro = useParams();
    useEffect(() => {
        setLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify({ 'id': parametro.id })
        };
        fetch(Apis.urlListarOnRepresentante, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.retorno[0].sucesso) {
                    setFormValues({ id: parametro.id, nome: result.registros[0].nome, apelido: result.registros[0].apelido, cnpj_cpf: result.registros[0].cnpj_cpf, ie_rg: result.registros[0].ie_rg, logradouro: result.registros[0].logradouro, numero: result.registros[0].numero, bairro: result.registros[0].bairro, complemento: result.registros[0].complemento, uf: result.registros[0].uf, cidade: result.registros[0].cidade, cep: result.registros[0].cep, telefone1: result.registros[0].telefone1, telefone2: result.registros[0].telefone2, email: result.registros[0].email, status: result.registros[0].status })
                } else {
                    alertaErro(result.retorno[0].mensagem);
                }
                setLoading(false)
            })
            .catch((erro) => {
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                redirect('/')
                console.log(erro)
            })
    }, [])

    const [formValues, setFormValues] = useState({});
    const handleInputChange = (e) => {
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
        const url = Apis.urlAlterarRepresentante;
        fetch(url, requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                if (result.retorno[0].sucesso) {
                    alertaSucesso(result.retorno[0].mensagem);
                    redirect('/listar-representantes');
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
                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* id do representante */}
                    <input type="hidden" value={parametro.id} name="id" />
                    <h5 className={styles.titulo}>Alteração de representante</h5>
                    <div className={styles.card_input}>
                        <h5>informações</h5>
                        <div className={styles.container_form}>
                            <label className={styles.label}>
                                <span>CNPJ - CPF</span>
                                <input type="text" onChange={handleInputChange} value={formValues.cnpj_cpf || ""} name='cnpj_cpf' id="cnpj_cpf" placeholder='CNPJ ou CPF do representante' />
                            </label>

                            <label className={styles.label}>
                                <span>IE - RG</span>
                                <input type="text" onChange={handleInputChange} value={formValues.ie_rg || ""} name='ie_rg' id="ie_rg" placeholder='IE ou RG' />
                            </label>

                            <label className={styles.label}>
                                <span>NOME</span>
                                <input type="text" id="nome" onChange={handleInputChange} value={formValues.nome || ""} name='nome' placeholder='Nome do representante' />
                            </label>

                            <label className={styles.label}>
                                <span>APELIDO</span>
                                <input type="text" id="apelido" onChange={handleInputChange} value={formValues.apelido || ""} name='apelido' placeholder='Nome fantasia' />
                            </label>
                        </div>
                    </div>

                    <div className={styles.card_input}>
                        <h5>endereço</h5>
                        <div className={styles.container_form}>
                            <label className={styles.label}>
                                <span>CEP</span>
                                <input type="number" onChange={handleInputChange} value={formValues.cep || ''} name='cep' id="cep" placeholder='CEP' />
                            </label>

                            <label className={styles.label}>
                                <span>RUA</span>
                                <input type="text" onChange={handleInputChange} value={formValues.logradouro || ''} name='logradouro' id="logradouro" placeholder='Rua' />
                            </label>

                            <label className={styles.label}>
                                <span>BAIRRO</span>
                                <input type="text" onChange={handleInputChange} value={formValues.bairro || ''} name='bairro' id="bairro" placeholder='Bairro' />
                            </label>

                            <label className={styles.label}>
                                <span>NÚMERO</span>
                                <input type="number" onChange={handleInputChange} value={formValues.numero || ""} name='numero' id="numero" placeholder='Número' />
                            </label>

                            <label className={styles.label} style={{ minWidth: '100%' }}>
                                <span>COMPLEMENTO</span>
                                <input type="text" onChange={handleInputChange} value={formValues.complemento || ''} name='complemento' id="complemento" placeholder='Complemento' />
                            </label>

                            <label className={styles.label}>
                                <span>UF</span>
                                <select onChange={handleInputChange} value={formValues.uf || ""} name='uf' id="uf">
                                    <option>UF</option>
                                    {Estados.estados.map((estado, index) => (
                                        <option value={estado.uf} key={index}>{estado.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className={styles.label}>
                                <span>CIDADE</span>
                                <select onChange={handleInputChange} value={formValues.cidade || ""} name='cidade' id="cidade">
                                    <option>Cidade</option>
                                    {Estados.cidades.map((cidade, index) => (
                                        formValues.uf !== "" && cidade.name_uf === formValues.uf &&
                                        <option value={cidade.name} key={index}>{cidade.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className={styles.card_input}>
                        <h5>contato</h5>
                        <div className={styles.container_form}>
                            <label className={styles.label}>
                                <span>TELEFONE 1</span>
                                <input type="text" onChange={handleInputChange} value={formValues.telefone1 || ""} name='telefone1' id="telefone1" placeholder='Telefone principal' />
                            </label>

                            <label className={styles.label}>
                                <span>TELEFONE 2</span>
                                <input type="text" onChange={handleInputChange} value={formValues.telefone2 || ""} name='telefone2' id="telefone2" placeholder='Telefone 2' />
                            </label>

                            <label className={styles.label}>
                                <span>EMAIL</span>
                                <input type="email" onChange={handleInputChange} value={formValues.email || ""} name='email' id="email" placeholder='Email do representante' />
                            </label>
                        </div>
                    </div>
                    <div className={styles.container_button}>
                        <button onClick={() => redirect('/listar-representantes')} className={styles.cancelar}>Cancelar</button>
                        <button type='submit' className={styles.submit}>Salvar</button>
                    </div>
                </form>
            </div>
        );
    }
}