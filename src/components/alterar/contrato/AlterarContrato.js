import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import styles from './Contrato.module.css';
import ViewListIcon from '@mui/icons-material/ViewList';
import Apis from '../../../Apis';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Loading from '../../Loading';
import { useNavigate, useParams } from 'react-router-dom';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import ButtonGroup from '@mui/material/ButtonGroup';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import SearchInputModal from '../../useDebounce/SearchInputModal';
import { VpnKeyOff } from '@mui/icons-material';
import axios from 'axios';
import BlockSistema from '../../bloqueio/contrato/BlockSistema';
import AjusteValor from './reajuste/AjusteValor';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
export default function AlterarContrato() {
    const [clientes, setClientes] = useState([]);
    const [altCliente, setAltCliente] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [contrato, setContrato] = useState([]);
    const [loading, setLoading] = useState(true);
    const redirect = useNavigate();
    const parametro = useParams();
    const [pesquisar, setPesquisar] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [verificacao, setVerificacao] = useState('');
    const [verificacaoCliente, setVerificacaoCliente] = useState('primary');
    const [verificacaoSistema, setVerificacaoSistema] = useState('primary');
    const [text, setText] = useState('');
    const [formaPagamento, setFormaPagamento] = useState([]);
    const [naturezas, setNaturezas] = useState([]);
    const [reloadContrato, setReloadContrato] = useState(false);
    const [bancos, setBancos] = useState([]);

    const [openModalSistemas, setOpenModalSistemas] = useState(false);

    const handleModalSistemas = () => {
        setOpenModalSistemas(!openModalSistemas);
    }

    const [qtdSistemaAlt, setQtdSistemaAlt] = useState('');
    const [sistemaAlt, setSistemaAlt] = useState('');
    const handleQtdSistemaAlt = (e) => {
        setQtdSistemaAlt(e.target.value);
    }
    const [idSistema, setIdSistema] = useState('');
    const [descricaoSistema, setDescricaoSistema] = useState('');

    // armazena a lista de sistemas que foram selecionados
    const [sistema, setSistema] = useState([]);

    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const dataAtual = ano + '-' + mes + '-' + dia;
    const [formValues, setFormValues] = useState([]);

    const delProduto = (id) => {
        setSistema(sistema.filter((sistema) => sistema.id !== id))
        setOpen(false);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value })
    }

    useEffect(() => {
        setLoading(true);
        // listar clientes
        const requestOptionsClis = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify('')
        };
        fetch(Apis.urlListarClientes, requestOptionsClis)
            .then(response => response.json())
            .then((result) => {
                setClientes(result.registros);
                setLoading(false);
            })
            .catch((erro) => {
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                redirect('/')
                console.log(erro)
                setLoading(false);
            })

        // listar cliente
        const requestOptionsCli = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify({ 'id': parametro.id })
        };
        fetch(Apis.urlListarOneContrato, requestOptionsCli)
            .then(response => response.json())
            .then((result) => {
                console.log(result.registros);
                setContrato(result.registros);
                setAltCliente(result.registros)
                setIdCliente(result.registros[0].cliente.cliente_id)
                setFormValues({
                    obs: result.registros[0]?.obs, valor: result.registros[0]?.ultimo_reajuste?.valor, prazo: result.registros[0]?.prazo,
                    dia_vencimento: result.registros[0]?.dia_vencimento, data_inicio: result.registros[0]?.data_inicio, data_primeira_mensalidade: result.registros[0]?.data_primeira_mensalidade?.substring(0, 10), gera_mensalidade: result.registros[0]?.gera_mensalidade,
                    forma_pgto_id: result.registros[0]?.forma_pgto_id, natureza_operacao_id: result.registros[0]?.natureza_operacao_id, banco_id: result.registros[0]?.banco_id
                })
                setSistema(result.registros[0].produtos)
            })
            .catch((erro) => {
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                redirect('/')
                console.log(erro)
            })
        // listar sistemas
        const requestOptionsSis = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify('')
        };
        fetch(Apis.urlListarProdutos, requestOptionsSis)
            .then(response => response.json())
            .then((result) => {
                setProdutos(result.registros);
            })
            .catch((erro) => {
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                redirect('/')
                console.log(erro)
            })

        fetch(Apis.urlListarFormasPagamentos, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` } })
            .then(response => response.json())
            .then((result) => {
                if (result.retorno[0].sucesso) {
                    setFormaPagamento(result.registros)
                } else {
                    if (result.retorno[0].mensagem == "Sem autorização!.") {
                        alertaErro(result.retorno[0].mensagem)
                        redirect('/')
                    }
                }
            })
            .catch((erro) => {
                alertaErro("Falha na requisição, forma de pagamento não encontrada, verifique sua conexão e tente novamente!");
                redirect('/')
                console.log(erro)
            })

        fetch(Apis.urlListarNatureza, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` } })
            .then(response => response.json())
            .then((result) => {
                if (result.retorno[0].sucesso) {
                    setNaturezas(result.registros)
                } else {
                    if (result.retorno[0].mensagem == "Sem autorização!.") {
                        alertaErro(result.retorno[0].mensagem)
                        redirect('/')
                    }
                }
            })
            .catch((erro) => {
                alertaErro("Falha na requisição, natureza não encontrada, verifique sua conexão e tente novamente!");
                redirect('/')
                console.log(erro)
            })

        const requestOptionsBancos = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(""),
        };

        fetch(Apis.urlListarBancos, requestOptionsBancos)
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                if (result.retorno[0].sucesso) {
                    setBancos(result.registros);
                } else {
                    alertaErro(result.retorno[0].mensagem);
                }
            })
            .catch((erro) => {
                alertaErro(
                    "Nenhum banco, Tente novamente ou entre em contato com o administrador"
                );
            });

    }, [reloadContrato]);
    // montar array de objetos (produtos)
    const handleAdicionarSistema = (id, nome) => {
        var dadosSistemas = sistema.filter((daods) => daods.id == id);
        if (dadosSistemas?.length == 0) {
            handleModalSistemas();
            setSistema([...sistema, { "id": id, "produto_id": id, "produto": nome, "data_inicio": dataAtual }])
            alertaSucesso(`O produto ${nome} foi inserido ao contrato.`);
        } else {
            alertaErro(`Erro, o produto ${nome} ja foi inserido no contrato.`);
        }
    }

    const handleSubmitContrato = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        if (idCliente === "") {
            setVerificacaoCliente('error')
        }
        if (idCliente !== "") {
            setVerificacaoCliente('primary')
        }
        if (sistema.length === 0) {
            setVerificacaoSistema('error')
        }
        if (sistema.length > 0) {
            setVerificacaoSistema('primary')
        }
        const arrayData = {
            "id": parametro.id, "cliente_id": idCliente, "prazo": data.prazo, "dia_vencimento": data.dia_vencimento, "valor": data.valor, "data_inicio": data.data_inicio, "obs": data.obs, "produtos": sistema,
            "natureza_operacao_id": data.natureza_operacao_id, "data_primeira_mensalidade": data.data_primeira_mensalidade, "gera_mensalidade": data.gera_mensalidade, "forma_pgto_id": data.forma_pgto_id, "banco_id": data.banco_id
        }
        console.log(arrayData);
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify(arrayData)
        };
        setVerificacao(data)
        const url = Apis.urlAlterarContrato;
        if (idCliente !== '' && sistema.length > 0) {
            fetch(url, requestOptions)
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    if (result.retorno[0].sucesso) {
                        alertaSucesso(result.retorno[0].mensagem);
                        redirect('/listar-contratos');
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


    const [open, setOpen] = useState(false);
    const [openQtdSistema, setOpenQtdSistema] = useState(false);
    const handleOpen = (id, descricao) => {
        setOpen(true);
        setIdSistema(id);
        setDescricaoSistema(descricao);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleCloseQtdSistema = (dado) => {
        if (dado) {
            setSistemaAlt(dado);
        }
        setOpenQtdSistema(!openQtdSistema);
    }

    const handleAltQtd = () => {
        var obj = sistema;
        for (var i = 0; i < sistema.length; i++) {
            if (obj[i].id == sistemaAlt.id) {
                obj[i].qt = qtdSistemaAlt;
            }
        }
        setOpenQtdSistema(false)
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
            <>
                <div className={styles.container}>
                    <div style={{ display: "flex", alignItems: "center", borderStyle: 'solid', borderBottomWidth: 1, borderColor: '#174c4f', margin: 10, marginBottom: 10, color: '#174c4f' }}>
                        ALTERAR CONTRATO - {contrato[0]?.numero_contrato}
                    </div>

                    <div className={styles.botoes_topo}>
                        <Button onClick={handleModalSistemas} variant="contained" color={verificacaoSistema}>Selecionar o sistema</Button>
                    </div>

                    <div className={styles.container_dados}>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: 10, minWidth: '50%', flexWrap: 'wrap' }}>
                            {clientes?.map((cliente, index) => (
                                idCliente === cliente?.clientes_id &&
                                <div key={index} style={{ textTransform: "uppercase", textAlign: "left", borderStyle: "solid", borderWidth: "1px", borderColor: '#174c4f', borderRadius: "3px", padding: "15px", background: "#e5e7eb" }}>
                                    <p style={{ flexGrow: 1 }}>{cliente?.cnpj_cpf}</p>
                                    <p style={{ flexGrow: 1, textAlign: 'justify' }}>{cliente?.nome}</p>
                                    <p style={{ flexGrow: 1 }}>{cliente?.logradouro}, {cliente?.numero} - {cliente?.bairro} - {cliente?.cep}</p>
                                    <p style={{ flexGrow: 1 }}>{cliente?.cidade}, {cliente?.uf}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: 10, minWidth: '50%' }}>
                            {sistema.length > 0 &&
                                <table cellspacing="0" rules="none" style={{ flexGrow: 1 }}>
                                    <tr className={styles.topo_tabela}>
                                        <th className={styles.titulo}>NOME</th>
                                        <th className={styles.titulo}>DATA</th>
                                        <th className={styles.titulo}>QT</th>
                                    </tr>
                                    {sistema.map((sistema, index) => (
                                        <tr className={styles.corpo_tabela} key={index} style={{
                                            backgroundColor: sistema.cod_bloqueio == 1 ? '#fd9999' : index % 2 == 0 ? '#e5e7eb' : '#fff'
                                        }}>
                                            {/* <td className={styles.id}>{sistema.id}</td> */}
                                            <td className={styles.titulo}>{sistema.produto}</td>
                                            <td className={styles.titulo}>{sistema?.data_inicio?.split('-').reverse().join('/')}</td>
                                            <td className={styles.titulo} onClick={() => handleCloseQtdSistema(sistema)}>{sistema.qt ? sistema.qt : '0'}</td>
                                            <td className={styles.opcoes}>
                                                <ButtonGroup disableElevation variant="contained">
                                                    <Tooltip title="Bloaquear sistema">
                                                        <Button size="small" style={{ backgroundColor: "rgb(255, 193, 7)", borderColor: "white" }}>
                                                            <BlockSistema id={parametro.id} idSistema={sistema.id} cliente={sistema.produto} />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Excluir sistema">
                                                        <Button size="small" onClick={() => handleOpen(sistema.id, sistema.produto)} style={{ borderColor: "white" }} color="error">
                                                            <DeleteIcon sx={{ fontSize: 20 }} />
                                                        </Button>
                                                    </Tooltip>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </table>
                            }
                        </div>
                    </div>
                    <form className={styles.form} onSubmit={handleSubmitContrato}>
                        <div className={styles.label_float}>
                            <input type="text" placeholder=" " disabled name="valor" onChange={handleInputChange} value={formValues.valor || ''} />
                            <label>valor</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <AjusteValor setReloadContrato={setReloadContrato} reloadContrato={reloadContrato} dados={contrato} />
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <input type="date" placeholder=" " onChange={handleInputChange} name="data_inicio" defaultValue={formValues?.data_inicio} />
                            <label>Data de contrato</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <input type="date" placeholder=" " onChange={handleInputChange} defaultValue={formValues?.data_primeira_mensalidade} name="data_primeira_mensalidade" />
                            <label>Data da 1ª Mensalidade</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <select name='gera_mensalidade' onChange={handleInputChange} defaultValue={formValues?.gera_mensalidade}>
                                <option value='0'>Não</option>
                                <option value='1'>Sim</option>
                            </select>
                            <label>Gerar Mensalidade</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <select name='forma_pgto_id' onChange={handleInputChange} defaultValue={formValues?.forma_pgto_id}>
                                {formaPagamento.map((item, index) => (
                                    <option value={item.id} key={index}>{item.descricao}</option>
                                ))}
                            </select>
                            <label>Forma de pagamento</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <select name='banco_id' onChange={handleInputChange} defaultValue={formValues?.banco_id}>
                                {bancos?.map((item, index) => (
                                    <option value={item.id} key={index}>{item.descricao}</option>
                                ))}
                            </select>
                            <label>Bancos</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <select name='natureza_operacao_id' onChange={handleInputChange} defaultValue={formValues?.natureza_operacao_id}>
                                {naturezas.map((item, index) => (
                                    <option value={item.id} key={index}>{item.descricao}</option>
                                ))}
                            </select>
                            <label>Natureza</label>
                            {/* <DoNotDisturbAltIcon cl assName={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <input type="text" placeholder=" " name="prazo" onChange={handleInputChange} value={formValues.prazo || ''} />
                            <label>Prazo do contrato</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <input type="text" placeholder=" " name="dia_vencimento" onChange={handleInputChange} value={formValues.dia_vencimento || ''} />
                            <label>Dia de vencimento</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <input type="text" disabled placeholder=" " value={altCliente[0]?.chave.toUpperCase()} />
                            <label>Chave</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <input type="text" placeholder=" " name="obs" onChange={handleInputChange} value={formValues.obs || ''} />
                            <label>Observações</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <Button type='submit' variant="contained" color="success">Salvar Contrato</Button>
                    </form>


                    <Modal
                        open={openQtdSistema}
                        onClose={handleCloseQtdSistema}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Quantidade do Sistema
                            </Typography>

                            <TextField className="w-full mt-4" value={qtdSistemaAlt} onChange={handleQtdSistemaAlt} required label="Quantidade do sistema" input />

                            <div className='text-center mt-4'>
                                <ButtonGroup disableElevation variant="contained" className='w-full'>
                                    <Button onClick={handleCloseQtdSistema} color="success" className='w-full'><DoNotDisturbAltIcon style={{ marginRight: "5px" }} />Cancelar</Button>
                                    <Button color="error" className='w-full' onClick={handleAltQtd}><DeleteIcon style={{ marginRight: "5px" }}></DeleteIcon> Confirmar</Button>
                                </ButtonGroup>
                            </div>
                        </Box>
                    </Modal>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Remover Sistema
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Deseja remover o sistema <strong>{descricaoSistema}</strong>?
                            </Typography>
                            <div className='text-center mt-4'>
                                <ButtonGroup disableElevation variant="contained" className='w-full'>
                                    <Button onClick={handleClose} color="success" className='w-full'><DoNotDisturbAltIcon style={{ marginRight: "5px" }} />Cancelar</Button>
                                    <Button color="error" className='w-full' onClick={() => delProduto(idSistema, descricaoSistema)}><DeleteIcon style={{ marginRight: "5px" }}></DeleteIcon> Confirmar</Button>
                                </ButtonGroup>
                            </div>
                        </Box>
                    </Modal>

                    {/* modal sistemas */}
                    <Modal open={openModalSistemas} onClose={handleModalSistemas} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                        <Box sx={{
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            p: 4,
                        }} className={styles.modal_clientes}>
                            <table cellspacing="0" rules="none">
                                <tr className={styles.topo_tabela}>
                                    <th className={styles.titulo}>SISTEMA</th>
                                </tr>
                                {produtos?.map((sistemaApi, index) => (
                                    <tr onClick={() => handleAdicionarSistema(sistemaApi.id, sistemaApi.nome)} className={styles.corpo_tabela} key={index} style={{
                                        backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                                    }}>
                                        {/* <td className={styles.id}>{sistemaApi.id}</td> */}
                                        <td className={styles.titulo}>{sistemaApi.nome}</td>
                                    </tr>
                                ))}
                            </table>
                        </Box>
                    </Modal>
                    {/* fim modal sistemas */}
                </div>
            </>
        );
    }
}