import React, { useEffect, useState } from 'react';
import styles from './Contrato.module.css';
import Apis from '../../../Apis';
import Button from '@mui/material/Button';
import Loading from '../../Loading';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import SearchInputModal from '../../useDebounce/SearchInputModal';

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
export default function Contrato() {
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const redirect = useNavigate();
    const [openModalClientes, setOpenModalClientes] = useState(false);
    const [openModalSistemas, setOpenModalSistemas] = useState(false);
    const [idCliente, setIdCliente] = useState('');
    const [verificacao, setVerificacao] = useState('');
    const [verificacaoCliente, setVerificacaoCliente] = useState('primary');
    const [verificacaoSistema, setVerificacaoSistema] = useState('primary');
    const [idSistema, setIdSistema] = useState('');
    const [descricaoSistema, setDescricaoSistema] = useState('');
    const [text, setText] = useState('');
    const [naturezas, setNaturezas] = useState([]);
    const [formaPagamento, setFormaPagamento] = useState([]);
    const [bancos, setBancos] = useState([]);

    const handleModalClientes = () => {
        setOpenModalClientes(!openModalClientes);
    }

    const handleModalSistemas = () => {
        setOpenModalSistemas(!openModalSistemas);
    }

    // armazena a lista de sistemas vindo da api (todos os sistemas serão carregados)
    // const [produtos, setProdutos] = useState([]);

    // armazena a lista de sistemas que foram selecionados
    const [sistema, setSistema] = useState([]);

    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const dataAtual = ano + '-' + mes + '-' + dia;

    const delProduto = (id, nome) => {
        setSistema(sistema.filter((sistema) => sistema.produto_id !== id))
        setOpen(false)
        alertaSucesso(`O produto ${nome} foi removido do contrato.`)
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
        };

        // listar natureza de operação
        fetch(Apis.urlListarNatureza, requestOptions)
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

        // listar forma de pagamento
        fetch(Apis.urlListarFormasPagamentos, requestOptions)
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
    }, []);
    useEffect(() => {
        setLoading(true);
        // listar clientes
        const requestOptionsCli = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify(
                {
                    // "id_Representante": 0,
                    "qt_registros": 10,
                    "pesquisa": text,
                    // "bloqueio": filtrar
                }
            )
        };
        fetch(Apis.urlListarClientes, requestOptionsCli)
            .then(response => response.json())
            .then((result) => {
                if (result.retorno[0].sucesso) {
                    setClientes(result.registros);
                    setLoading(false);
                } else {
                    alertaErro(result.retorno[0].mensagem);
                    setLoading(false);
                }
            })
            .catch((erro) => {
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                redirect('/')
                console.log(erro)
                setLoading(false);
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
                if (result.retorno[0].sucesso) {
                    setProdutos(result.registros);
                } else {
                    alertaErro(result.retorno[0].mensagem);
                }
            })
            .catch((erro) => {
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
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
    }, [text]);

    // montar array de objetos (produtos)
    const handleAdicionarSistema = (id, nome) => {
        var dadosSistemas = sistema.filter((daods) => daods.produto_id == id);
        if (dadosSistemas?.length == 0) {
            handleModalSistemas();
            setSistema([...sistema, { "produto_id": id, "nome": nome, "data_inicio": dataAtual }])
            alertaSucesso(`O produto ${nome} foi inserido ao contrato.`);
        } else {
            alertaErro(`Erro, o produto ${nome} ja foi inserido no contrato.`);
        }
    }

    const handleIdCliente = (id) => {
        alertaSucesso("O cliente foi adicionado ao contrato.")
        handleModalClientes();
        setIdCliente(id);
        if (sistema?.length == 0) {
            handleModalSistemas();
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
        const arrayContrato = { "cliente_id": idCliente, "banco_id": data.banco_id, "prazo": data.prazo, "dia_vencimento": data.dia_vencimento, "valor": data.valor === "" ? 0 : data.valor, "data_inicio": data.data_inicio, "obs": data.obs, "produtos": sistema, 'data_primeira_mensalidade': data.data_primeira_mensalidade, 'gera_mensalidade': data.gera_mensalidade, 'forma_pgto_id': data.forma_pgto_id, 'natureza_operacao_id': data.natureza_operacao_id }

        // console.log(arrayContrato)
        setVerificacao(data)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify(arrayContrato)
        };
        console.log(arrayContrato);
        const url = Apis.urlCadContratos;
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
    const handleOpen = (id, descricao) => {
        setOpen(true);
        setIdSistema(id);
        setDescricaoSistema(descricao);
    }
    const handleClose = () => setOpen(false);
    const redirecionar = () => {
        redirect('/listar-contratos')
    }
    if (loading) {
        return (
            <div style={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loading />
            </div>
        );
    }
    else {
        if (clientes?.length > 0) {
            return (
                <div className={styles.container}>
                    <div style={{ display: "flex", alignItems: "center", borderStyle: 'solid', borderBottomWidth: 1, borderColor: '#174c4f', margin: 10, marginBottom: 10, color: '#174c4f' }}>
                        NOVO CONTRATO
                    </div>

                    <div className={styles.botoes_topo}>
                        <Button onClick={handleModalClientes} variant="contained" color={verificacaoCliente}>Selecionar o cliente</Button>
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
                                    </tr>
                                    {sistema.map((sistema, index) => (
                                        <tr className={styles.corpo_tabela} key={index} style={{
                                            backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                                        }}>
                                            {/* <td className={styles.id}>{sistema.produto_id}</td> */}
                                            <td className={styles.titulo}>{sistema.nome}</td>
                                            <td className={styles.titulo}>{sistema.data_inicio.split('-').reverse().join('/')}</td>
                                            <td className={styles.opcoes}>
                                                <Button variant="contained" color="error" onClick={() => handleOpen(sistema.produto_id, sistema.nome)}>
                                                    <DeleteIcon sx={{ fontSize: 20 }} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </table>
                            }
                        </div>
                    </div>
                    <form className={styles.form} onSubmit={handleSubmitContrato}>
                        <div className={styles.label_float}>
                            <input type="text" placeholder=" " name="valor" />
                            <label>valor</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <input type="date" placeholder=" " defaultValue={dataAtual} name="data_inicio" />
                            <label>Data de contrato</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <input type="date" placeholder=" " defaultValue={dataAtual} name="data_primeira_mensalidade" />
                            <label>Data da 1ª Mensalidade</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <select name='gera_mensalidade' style={{cursor: 'pointer'}}>
                                <option value='0'>Não</option>
                                <option value='1'>Sim</option>
                            </select>
                            <label>Gerar Mensalidade</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <select name='forma_pgto_id' style={{cursor: 'pointer'}}>
                                {formaPagamento.map((item, index) => (
                                    <option value={item.id} key={index}>{item.descricao}</option>
                                ))}
                            </select>
                            <label>Forma de pagamento</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <select name='banco_id' style={{cursor: 'pointer'}}>
                                {bancos?.map((item, index) => (
                                    <option value={item.id} key={index}>{item.descricao}</option>
                                ))}
                            </select>
                            <label>Banco</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <select name='natureza_operacao_id'>
                                {naturezas.map((item, index) => (
                                    <option value={item.id} key={index}>{item.descricao}</option>
                                ))}
                            </select>
                            <label>Natureza</label>
                            {/* <DoNotDisturbAltIcon cl assName={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <input type="text" placeholder=" " name="prazo" />
                            <label>Prazo do contrato</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <input type="text" placeholder=" " name="dia_vencimento" />
                            <label>Dia de vencimento</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <div className={styles.label_float}>
                            <input type="text" placeholder=" " name="obs" />
                            <label>Observações</label>
                            {/* <DoNotDisturbAltIcon className={styles.icone} /> */}
                        </div>
                        <Button type='submit' variant="contained" color="success">Salvar Contrato</Button>
                    </form>

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

                    {/* modal clientes */}

                    <Modal open={openModalClientes} onClose={handleModalClientes} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                        <Box sx={{
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            p: 4,
                        }} className={styles.modal_clientes}>
                            <SearchInputModal value={text} onChange={(search) => setText(search)} style={{ maxWidth: '100%' }} />

                            <table cellspacing="0" rules="none">
                                <tr className={styles.topo_tabela}>
                                    <th className={styles.titulo}>NOME</th>
                                </tr>
                                {clientes?.map((cliente, index) => (
                                    <tr onClick={() => handleIdCliente(cliente?.clientes_id)} className={styles.corpo_tabela} key={index} style={{
                                        backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                                    }}>
                                        <td className={styles.titulo}>{cliente?.nome}</td>
                                    </tr>
                                ))}
                            </table>
                        </Box>
                    </Modal>
                    {/* fim modal cliente */}

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
            );
        } else {
            return (
                <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    nenhum cliente foi encontrado
                </div>
            )
        }
    }
}