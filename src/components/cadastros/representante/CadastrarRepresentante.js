import React, { useEffect, useState } from 'react';
import styles from '../../estilos/forms/Forms.module.css';
import { useNavigate } from 'react-router-dom';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import Apis from '../../../Apis';
import Estados from '../../../estado';
export default function CadastrarRepresentante() {
    const [formValues, setFormValues] = useState([]);
    const [validCpfCnpj, setValidCpfCnpj] = useState('');
    // hook para redirect
    const redirect = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value })
    }

    var cep = '0';
    if (formValues.cep !== undefined) {
        cep = formValues.cep.length;
    }

    var cnpjCpf = '0';
    if (formValues.cnpj_cpf !== undefined) {
        cnpjCpf = formValues.cnpj_cpf.length;
    }

    useEffect(() => {
        if (cep === 8 && cep > 7) {
            fetch(`https://viacep.com.br/ws/${formValues.cep}/json/`)
                .then((response) => response.json())
                .then((result) => {
                    setFormValues({ 'uf': result.uf, 'logradouro': result.logradouro, 'bairro': result.bairro, 'cidade': result.localidade, 'cep': formValues.cep, 'complemento': result.complemento })
                })
                .catch((erro) => {
                    alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                    redirect('/')
                })
        }

        if (cnpjCpf >= 11 && cnpjCpf <= 18) {
            const resultValid = cpf.isValid(formValues.cnpj_cpf);
            const resultValidCnpj = cnpj.isValid(formValues.cnpj_cpf);
            if (resultValid || resultValidCnpj) {
                setValidCpfCnpj(true)
            }
            if (!resultValid && !resultValidCnpj) {
                setValidCpfCnpj(false)
            }
        }
    }, [cep, cnpjCpf])


    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        if (validCpfCnpj) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
                body: JSON.stringify(data)
            };
            const url = Apis.urlCadRepresentante;
            if (data.nome !== "" && data.cnpj_cpf !== "" && data.uf !== "" && data.cidade !== "" && validCpfCnpj === true) {
                fetch(url, requestOptions)
                    .then((response) => {
                        return response.json()
                    })
                    .then((result) => {
                        if (result.retorno[0].sucesso) {
                            alertaSucesso(result.retorno[0].mensagem);
                            redirect('/listar-representantes')
                        } else {
                            alertaErro(result.retorno[0].mensagem);
                        }
                    })
                    .catch((erro) => {
                        alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                        // redirect('/')
                    })
            } else {
                alertaErro("Todos os campos devem ser preenchidos");
            }
        } else {
            alertaErro("CNPJ CPF inválido");
        }
    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h5 className={styles.titulo}>Cadastro de representante</h5>
                <div className={styles.card_input}>
                    <h5>informações</h5>
                    <div className={styles.container_form}>
                        <label className={styles.label}>
                            <span>CNPJ - CPF</span>
                            <input type="text" onChange={handleInputChange} name='cnpj_cpf' id="cnpj_cpf" placeholder='CNPJ ou CPF do representante' />
                        </label>

                        <label className={styles.label}>
                            <span>IE - RG</span>
                            <input type="text" onChange={handleInputChange} name='ie_rg' id="ie_rg" placeholder='IE ou RG' />
                        </label>

                        <label className={styles.label}>
                            <span>NOME</span>
                            <input type="text" id="nome" onChange={handleInputChange} name='nome' placeholder='Nome do representante' />
                        </label>

                        <label className={styles.label}>
                            <span>APELIDO</span>
                            <input type="text" id="apelido" onChange={handleInputChange} name='apelido' placeholder='Nome fantasia' />
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
                            <input type="number" onChange={handleInputChange} name='numero' id="numero" placeholder='Número' />
                        </label>

                        <label className={styles.label} style={{minWidth: '100%'}}>
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
                            <input type="number" onChange={handleInputChange} name='telefone1' id="telefone1" placeholder='Telefone principal' />
                        </label>

                        <label className={styles.label}>
                            <span>TELEFONE 2</span>
                            <input type="number" onChange={handleInputChange} name='telefone2' id="telefone2" placeholder='Telefone 2' />
                        </label>

                        <label className={styles.label}>
                            <span>EMAIL</span>
                            <input type="email" onChange={handleInputChange} name='email' id="email" placeholder='Email do representante' />
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