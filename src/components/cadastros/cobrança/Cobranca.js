import React, { useEffect, useState } from 'react';
import styles from '../../estilos/forms/Forms.module.css';
import stylesModal from '../contrato/Contrato.module.css';
import Apis from '../../../Apis';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import { Box, Modal } from '@mui/material';
import SearchInputModal from '../../useDebounce/SearchInputModal';

export default function Cobranca() {
    const [loading, setLoading] = useState(false);
    const redirect = useNavigate();
    const [natureza, setNatureza] = useState([]);
    const [formaPagamentos, setFormaPagamentos] = useState([]);
    const [cliente, setCliente] = useState();
    const [listaCliente, setListaCliente] = useState();
    const [openModalClientes, setOpenModalClientes] = useState(false);
    const [openModalAlterarDataParcela, setOpenModalAlterarDataParcela] = useState(false);
    const [text, setText] = useState('');
    const [valor, setValor] = useState('');
    const [parcelas, setParcelas] = useState([]);
    const [qtdParcelas, setQtdParcelas] = useState(1);
    const [parcelaDataAlt, setParcelaDataAlt] = useState();
    const [dataAtualParcela, setDataAtualParcela] = useState();

    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = String(data.getFullYear());
    const dataCobranca = `${ano}-${mes}-${dia}`;
    const [dataVencimento, setDataVencimento] = useState(`${ano}-${mes}-${dia}`);

    const handleModalAlterarDataParcela = (parcela) => {
        setOpenModalAlterarDataParcela(!openModalAlterarDataParcela);
        setParcelaDataAlt(parcela)
        setDataAtualParcela(parcela.vencimento);
    }

    const handleAltDataParcela = () => {
        var meuObjeto = parcelas;
        for (var i = 0; i < parcelas.length; i++) {
            if (meuObjeto[i]?.parcela == parcelaDataAlt?.parcela) {
                meuObjeto[i].vencimento = dataAtualParcela;

            }
        }
        setParcelas(meuObjeto);
        setOpenModalAlterarDataParcela(false);
    }


    const handleDataAtualParcela = (e) => {
        setDataAtualParcela(e.target.value)
    }

    const handleModalClientes = () => {
        setOpenModalClientes(!openModalClientes);
    }

    const handleIdCliente = (cliente) => {
        setCliente(cliente);
        handleModalClientes();
    }
    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');

        // buscar naturezas
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `${token}` },
            body: JSON.stringify({})
        }
        fetch(Apis.urlListarNatureza, requestOptions)
            .then(response => response.json())
            .then((result) => {
                setNatureza(result?.registros);
                setLoading(false)
            })
            .catch((erro) => {
                console.log(erro);
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                redirect('/')
                setLoading(false)
            })

        // buscar formas de pagamento
        const requestOptionsPagamentos = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `${token}` },
            body: JSON.stringify({})
        }
        fetch(Apis.urlListarFormasPagamentos, requestOptionsPagamentos)
            .then(response => response.json())
            .then((result) => {
                setFormaPagamentos(result?.registros);
                setLoading(false)
            })
            .catch((erro) => {
                console.log(erro);
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                redirect('/')
                setLoading(false)
            })
    }, []);

    useEffect(() => {
        // buscar clientes
        setLoading(true)
        const token = localStorage.getItem('token');
        const requestOptionsClientes = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `${token}` },
            body: JSON.stringify({
                // "id_Representante": 0,
                "qt_registros": 10,
                "pesquisa": text,
                // "bloqueio": filtrar
            })
        }
        fetch(Apis.urlListarClientes, requestOptionsClientes)
            .then(response => response.json())
            .then((result) => {
                setListaCliente(result?.registros);
                setLoading(false)
            })
            .catch((erro) => {
                console.log(erro);
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                redirect('/')
                setLoading(false)
            })
    }, [text]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.target);
        const form = Object.fromEntries(formData);
        const dados = { ...form, parcelas };
        if (parcelas?.length <= 0 || form.participante_id == '' || form.data == '' || form.valor == '' || form.natureza_id == '' || form.forma_pgto_id == '') {
            setLoading(false)
            return alertaErro("Preencha todos os campos")
        } else {
            const token = localStorage.getItem('token');
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
                body: JSON.stringify(dados)
            }
            fetch(Apis.urlCadCobranca, requestOptions)
                .then(response => response.json())
                .then((result) => {
                    if (result.retorno[0].mensagem) {
                        alertaSucesso(result.retorno[0].mensagem);
                        redirect('/listar-contas-receber')
                        setLoading(false)
                    } else {
                        alertaErro(result.retorno[0].mensagem);
                        setLoading(false)
                    }
                })
                .catch((erro) => {
                    console.log(erro);
                    alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                    redirect('/')
                    setLoading(false)
                })
        }

    }

    const handleGerarParcelas = () => {
        if (qtdParcelas <= 0) {
            setParcelas([]);
            alertaErro("Não é possivel gerar parcelas pois a quantidade de parcelas não foi informada!")
        }
        else {
            var parcelaTemp = [];
            var data2 = new Date(dataVencimento.substring(0, 4), dataVencimento.substring(5, 7), dataVencimento.substring(8, 10));

            var dia2 = dataVencimento.substring(8, 10);
            var mes2 = dataVencimento.substring(5, 7);
            var ano2 = '';

            for (var i = 0; i < qtdParcelas; i++) {
                parcelaTemp = [...parcelaTemp, { "parcela": i + 1, "vencimento": ano2 == '' ? dataVencimento : `${ano2}-${mes2}-${dia2}`, "valor": parseFloat(valor) / parseFloat(qtdParcelas) }];

                if (mes2 == 12) {
                    mes2 = 0;
                }

                ano2 = data2.getFullYear();
                data2.setDate(data2.getDate() + 30);

                mes2 = String(parseInt(mes2) + 1).padStart(2, '0');

                if (mes2 == 2 && dia2 > 28) {
                    dia2 = 28;
                } else {
                    if (mes2 == 4 && dia2 > 30 || mes2 == 6 && dia2 > 30 || mes2 == 9 && dia2 > 30 || mes2 == 11 && dia2 > 30) {
                        dia2 = 30;
                    } else {
                        dia2 = dataVencimento.substring(8, 10);
                    }
                }


            }
            setParcelas(parcelaTemp)
        }
    }

    useEffect(() => {
        if (valor != '') {
            handleGerarParcelas();
        }
    }, [dataVencimento, valor, qtdParcelas]);

    if (loading) {
        return (
            <div style={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loading />
            </div>
        )
    } else {
        return (
            <>
                <div className={styles.container}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h5 className={styles.titulo}>Faturamento</h5>
                        <div className={styles.card_input}>
                            <h5>informações</h5>
                            <div className={styles.container_form}>
                                <label className={styles.label} style={{ width: '100%' }}>
                                    <input type="button" style={{ backgroundColor: '#ed6c02', color: '#fff', borderColor: 'transparent' }} onClick={handleModalClientes} placeholder='Cliente' value='Selecionar Cliente' />
                                </label>
                                {cliente &&
                                    <label className={styles.label} style={{ width: '100%' }}>
                                        <span>Cliente</span>
                                        <input type="text" disabled value={cliente?.nome} />
                                    </label>
                                }
                                <input type="hidden" name='participante_id' defaultValue={cliente?.id} />

                                <label className={styles.label} style={{ flexBasis: 2, minWidth: '200px' }}>
                                    <span>Valor</span>
                                    <input type="text" name='valor' defaultValue={valor} onChange={(e) => setValor(e.target.value)} placeholder='Valor' />
                                </label>

                                <label className={styles.label}>
                                    <span>Natureza</span>
                                    <select name='natureza_id'>
                                        {natureza?.map((item) => (
                                            <option key={item?.id} value={item?.id}>{item?.descricao}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className={styles.label} style={{ flexBasis: 2, minWidth: '200px' }}>
                                    <span>Forma de Pagamento</span>
                                    <select name='forma_pgto_id'>
                                        {formaPagamentos?.map((item) => (
                                            <option key={item?.id} value={item?.id}>{item?.descricao}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className={styles.label}>
                                    <span>Obeservação</span>
                                    <textarea placeholder='Observação' name='obs'></textarea>
                                </label>
                                {valor > 0 &&
                                    <>
                                        <div style={{ display: 'flex', minWidth: '100%', flexWrap: 'wrap' }}>
                                            <label className={styles.label}>
                                                <span>Data de Emissão</span>
                                                <input type="date" name='data' defaultValue={dataCobranca} />
                                            </label>

                                            <label className={styles.label}>
                                                <span>{qtdParcelas > 1 ? 'Vecimento da 1ª parcela' : 'Data de Cobrança'}</span>
                                                <input type="date" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} />
                                            </label>

                                            <label className={styles.label}>
                                                <span>Quantidade de Parcelas</span>
                                                <select defaultValue={qtdParcelas} onChange={(e) => setQtdParcelas(e.target.value)}>
                                                    <option value='1'>À vista R$ {parseFloat(valor)?.toFixed(2)}</option>
                                                    <option value='2'>2 parcelas de R$ {parseFloat(valor / 2)?.toFixed(2)}</option>
                                                    <option value='3'>3 parcelas de R$ {parseFloat(valor / 3)?.toFixed(2)}</option>
                                                    <option value='4'>4 parcelas de R$ {parseFloat(valor / 4)?.toFixed(2)}</option>
                                                    <option value='5'>5 parcelas de R$ {parseFloat(valor / 5)?.toFixed(2)}</option>
                                                    <option value='6'>6 parcelas de R$ {parseFloat(valor / 6)?.toFixed(2)}</option>
                                                    <option value='7'>7 parcelas de R$ {parseFloat(valor / 7)?.toFixed(2)}</option>
                                                    <option value='8'>8 parcelas de R$ {parseFloat(valor / 8)?.toFixed(2)}</option>
                                                    <option value='9'>9 parcelas de R$ {parseFloat(valor / 9)?.toFixed(2)}</option>
                                                    <option value='10'>10 parcelas de R$ {parseFloat(valor / 10)?.toFixed(2)}</option>
                                                    <option value='11'>11 parcelas de R$ {parseFloat(valor / 11)?.toFixed(2)}</option>
                                                    <option value='12'>12 parcelas de R$ {parseFloat(valor / 12)?.toFixed(2)}</option>
                                                </select>
                                                {/* <input type="number" defaultValue={qtdParcelas} onChange={(e) => setQtdParcelas(e.target.value)} placeholder='Quantidade de parcelas' /> */}
                                            </label>

                                            <label className={styles.label}>
                                                <span style={{ color: '#fff' }}>'</span>
                                                <input type="button" style={{ backgroundColor: '#174c4f', color: '#fff', borderColor: 'transparent' }} onClick={handleGerarParcelas} placeholder='Cliente' value='Gerar Parcelas' />
                                            </label>
                                        </div>
                                        {parcelas?.length > 0 &&
                                            <div style={{ padding: 10, minWidth: '100%' }}>
                                                <table cellspacing="0" rules="none">
                                                    <tr className={stylesModal.topo_tabela}>
                                                        <th className={stylesModal.titulo}>PARCELA</th>
                                                        <th className={stylesModal.titulo}>DATA</th>
                                                        <th className={stylesModal.titulo}>VALOR</th>
                                                    </tr>
                                                    {parcelas?.map((item, index) => (
                                                        <tr onClick={() => handleModalAlterarDataParcela(item)} key={item?.parcela} className={stylesModal.corpo_tabela} style={{
                                                            backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                                                        }}>
                                                            <td className={stylesModal.titulo}>{item?.parcela}ª</td>
                                                            <td className={stylesModal.titulo}>{(item?.vencimento.split('-').reverse().join('/'))}</td>
                                                            <td className={stylesModal.titulo}>R$ {(item?.valor.toFixed(2))}</td>
                                                        </tr>
                                                    ))}
                                                </table>
                                            </div>
                                        }
                                    </>
                                }

                            </div>
                        </div>

                        <div className={styles.container_button}>
                            <button onClick={() => redirect('/listar-contas-receber')} className={styles.cancelar}>Cancelar</button>
                            <button type='submit' className={styles.submit}>Salvar</button>
                        </div>
                    </form>
                </div>

                {/* modal clientes */}

                <Modal open={openModalAlterarDataParcela} onClose={handleModalAlterarDataParcela} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={{
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        p: 4,
                    }} className={stylesModal.modal_clientes} style={{ flexGrow: 1 }}>
                        <div className={styles.container_form}>
                            <label className={styles.label}>
                                <span>DATA DA PARCELA {parcelaDataAlt?.parcela}</span>
                                <input type="date" onChange={handleDataAtualParcela} value={dataAtualParcela} />
                            </label>

                            <label className={styles.label} style={{ width: '100%' }}>
                                <input type="button" value='ALTERAR' onClick={handleAltDataParcela} style={{ backgroundColor: 'green', borderColor: 'transparent', color: '#fff' }} />
                            </label>
                        </div>
                    </Box>
                </Modal>
                {/* fim modal alterar data parcela */}

                {/* modal clientes */}

                <Modal open={openModalClientes} onClose={handleModalClientes} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={{
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        p: 4,
                    }} className={stylesModal.modal_clientes}>
                        <SearchInputModal value={text} onChange={(search) => setText(search)} style={{ maxWidth: '100%' }} />

                        <table cellspacing="0" rules="none">
                            <tr className={stylesModal.topo_tabela}>
                                <th className={stylesModal.titulo}>NOME</th>
                            </tr>
                            {listaCliente?.map((item, index) => (
                                <tr onClick={() => handleIdCliente(item)} className={stylesModal.corpo_tabela} key={index} style={{
                                    backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                                }}>
                                    <td className={stylesModal.titulo}>{item?.nome}</td>
                                </tr>
                            ))}
                        </table>
                    </Box>
                </Modal>
                {/* fim modal cliente */}
            </>
        );
    }
}
