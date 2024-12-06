import React, { useEffect, useState } from 'react';
import styles from '../../estilos/forms/Forms.module.css';
import Apis from '../../../Apis';
import Estados from '../../../estado';
import { useNavigate } from 'react-router-dom';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import Loading from '../../Loading';
export default function Clientes() {
    const [representantes, setRepresentantes] = useState([]);
    const [validCpfCnpj, setValidCpfCnpj] = useState('');
    const [formValues, setFormValues] = useState([]);
    const [DadosReceita, setDadosReceita] = useState([]);
    const [loading, setLoading] = useState(false);
    // hook para redirecionar
    const redirect = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value.split('.').join('').split('/').join('').split('-').join('') })
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
        if (formValues.cnpj_cpf?.length == 14) {
            setLoading(true)
            fetch(`https://publica.cnpj.ws/cnpj/${formValues.cnpj_cpf}`)
                .then(response => response.json())
                .then((result) => {
                    if (result && result.status !== 400 && result.status !== 429) {
                        console.log(result);
                        setDadosReceita(result);
                        setLoading(false)
                    } else {
                        setLoading(false)
                        alertaErro(`ATENÇÃO ERRO ${result.status} - ${result.detalhes}`)
                    }
                })
                .catch((erro) => {
                    console.log(erro);
                    setLoading(false);
                })
        }
    }, [formValues.cnpj_cpf]); //executa a função sempre q a variavel cnpjCpf mudar

    useEffect(() => {
        if (cep === 8 && cep > 7) {
            fetch(`https://viacep.com.br/ws/${formValues.cep}/json/`)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result)
                    setFormValues({ 'uf': result.uf, 'logradouro': result.logradouro, 'bairro': result.bairro, 'cidade': result.localidade, 'cep': formValues.cep, 'complemento': result.complemento })
                })
                .catch((erro) => {
                    alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                    redirect('/')
                    console.log(erro)
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

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify(data)
        };
        const url = Apis.urlCadCliente;
        if (!validCpfCnpj) {
            return alertaErro("CNPJ ou CPF inválido, tente novamente!")
        }
        if (data.nome !== "" && data.cnpj_cpf !== "" && data.uf !== "" && data.cidade !== "") {
            fetch(url, requestOptions)
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    if (result.retorno[0].sucesso) {
                        alertaSucesso(result.retorno[0].mensagem);
                        redirect('/listar-clientes');
                    } else {
                        alertaErro(result.retorno[0].mensagem);
                    }
                })
                .catch((erro) => {
                    alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                    redirect('/')
                    console.log(erro)
                })
        } else {
            alertaErro("Todos os campos devem ser preenchidos!")
        }
    }

    // listar representantes
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify()
        };
        fetch(Apis.urlListarRepresentantes, requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                if (result.retorno[0].sucesso) {
                    setRepresentantes(result.registros)
                } else {
                    alertaErro(result.retorno[0].mensagem);
                }
            })
            .catch((erro) => {
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                redirect('/')
                console.log(erro)
            })
    }, [])
    if (loading) {
        return (
            <div style={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loading />
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h5 className={styles.titulo}>Cadastro de cliente</h5>
                <div className={styles.card_input}>
                    <h5>informações</h5>
                    <div className={styles.container_form}>
                        <label className={styles.label}>
                            <span>CNPJ - CPF</span>
                            <input type="text" onChange={handleInputChange} value={formValues.cnpj_cpf} minLength={11} name='cnpj_cpf' id="cnpj_cpf" placeholder='CNPJ ou CPF do representante' />
                        </label>

                        <label className={styles.label}>
                            <span>IE - RG</span>
                            <input type="text" onChange={handleInputChange} name='ie_rg' id="ie_rg" placeholder='IE ou RG' />
                        </label>

                        <label className={styles.label}>
                            <span>NOME</span>
                            <input type="text" id="nome" onChange={handleInputChange} defaultValue={DadosReceita?.razao_social} name='nome' placeholder='Nome do representante' />
                        </label>

                        <label className={styles.label}>
                            <span>APELIDO</span>
                            <input type="text" id="apelido" onChange={handleInputChange} defaultValue={DadosReceita.estabelecimento?.nome_fantasia} name='apelido' placeholder='Nome fantasia' />
                        </label>
                    </div>
                </div>

                <div className={styles.card_input}>
                    <h5>endereço</h5>
                    <div className={styles.container_form}>
                        <label className={styles.label}>
                            <span>CEP</span>
                            <input type="text" onChange={handleInputChange} value={formValues?.cep} name='cep' id="cep" placeholder='CEP' />
                        </label>

                        <label className={styles.label}>
                            <span>RUA</span>
                            <input type="text" onChange={handleInputChange} defaultValue={formValues?.logradouro} name='logradouro' id="logradouro" placeholder='Rua' />
                        </label>

                        <label className={styles.label}>
                            <span>BAIRRO</span>
                            <input type="text" onChange={handleInputChange} defaultValue={formValues?.bairro} name='bairro' id="bairro" placeholder='Bairro' />
                        </label>

                        <label className={styles.label}>
                            <span>NÚMERO</span>
                            <input type="text" onChange={handleInputChange} defaultValue={formValues?.numero} name='numero' id="numero" placeholder='Número' />
                        </label>

                        <label className={styles.label} style={{ minWidth: '100%' }}>
                            <span>COMPLEMENTO</span>
                            <input type="text" onChange={handleInputChange} defaultValue={formValues?.complemento} name='complemento' id="complemento" placeholder='Complemento' />
                        </label>

                        <label className={styles.label}>
                            <span>UF</span>
                            <select onChange={handleInputChange} value={formValues.uf || ""} name='uf' id="uf">
                                <option value="">UF</option>
                                {Estados.estados.map((estado, index) => (
                                    <option value={estado.uf} key={index}>{estado.name}</option>
                                ))}
                            </select>
                        </label>

                        <label className={styles.label}>
                            <span>CIDADE</span>
                            <select onChange={handleInputChange} value={formValues.cidade || ""} name='cidade' id="cidade">
                                <option value="">Cidade</option>
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
                            <input type="number" onChange={handleInputChange} defaultValue={DadosReceita?.estabelecimento?.telefone1} name='telefone1' id="telefone1" placeholder='Telefone principal' />
                        </label>

                        <label className={styles.label}>
                            <span>TELEFONE 2</span>
                            <input type="number" onChange={handleInputChange} defaultValue={DadosReceita?.estabelecimento?.telefone2} name='telefone2' id="telefone2" placeholder='Telefone 2' />
                        </label>

                        <label className={styles.label}>
                            <span>EMAIL</span>
                            <input type="email" onChange={handleInputChange} defaultValue={DadosReceita?.estabelecimento?.email} name='email' id="email" placeholder='Email do representante' />
                        </label>

                        <label className={styles.label}>
                            <span>REPRESENTANTE</span>
                            <select onChange={handleInputChange} value={formValues.representante_id || ""} name='representante_id' id="representante_id">
                                <option>Representante</option>
                                {
                                    representantes.map((representante, index) => (
                                        <option value={representante.representantes_id} key={index}>{representante.nome}</option>
                                    ))
                                }
                            </select>
                        </label>
                    </div>
                </div>
                <div className={styles.container_button}>
                    <button onClick={() => redirect('/listar-clientes')} className={styles.cancelar}>Cancelar</button>
                    <button type='submit' className={styles.submit}>Salvar</button>
                </div>
            </form>
        </div>
    );
}