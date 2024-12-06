import React, { useEffect, useState } from 'react';
import styles from './ListarReajuste.module.css';
import Loading from '../../Loading';
import Apis from '../../../Apis';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import { BsInfoCircle } from 'react-icons/bs';
import { GrCheckboxSelected, GrCheckbox } from 'react-icons/gr';
import { TbSortAscendingNumbers } from 'react-icons/tb';
import axios from 'axios';
export default function ListarReajuste() {
    const [loading, setLoading] = useState(false);
    const [contratos, setContratos] = useState([]);
    const [contratosCopy, setContratosCopy] = useState([]);
    const [opcao, setOpcao] = useState('0');
    const [qtRegistros, setQtRegistros] = useState(10);
    const [atualizarTela, setatualizarTela] = useState(false);
    const [uf, setUF] = useState('MS');
    const [valor, setValor] = useState('');
    const [pesquisar, setPesquisar] = useState('');
    const [motivo, setMotivo] = useState('');
    const dataAtual = new Date()
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const [data, setData] = useState(`${ano}-${mes}-${dia}`);

    const redirect = useNavigate();

    useEffect(() => {
        const handleContratos = async () => {
            setLoading(true);
            const requestOptions = {
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            };
            const body = {};
            await axios.post(Apis.urlListarContratos, JSON.stringify(body), requestOptions)
                .then((response) => {
                    if (response.status) {
                        if (response.data.registros.length < 1) {
                            setContratos([]);
                            setLoading(false)
                            return alertaErro(response.data.retorno[0].mensagem);
                        }
                        var cont = response.data.registros;
                        for (var i = 0; i < cont.length; i++) {
                            cont[i].checked = false;
                        }
                        setContratos(cont)
                    }
                    setLoading(false)
                })
                .catch((erro) => {
                    if (erro.response.status > 201) {
                        alertaErro(`Erro ${erro.response.status} - ${erro.response.data.retorno[0].mensagem}`);
                        redirect('/')
                        setLoading(false)
                    }
                })
        }
        handleContratos();
    }, [])

    useEffect(() => {
        setContratosCopy(contratos.filter((item) => item?.uf_cliente?.toLowerCase() == uf?.toLowerCase()))
    }, [uf, contratos, atualizarTela]);

    const handleReajustar = async () => {
        setLoading(true);
        const contReaj = contratosCopy.filter((item) => item.checked);
        var cont = [];
        for (var i = 0; i < contReaj.length; i++) {
            cont = [...cont, { "id": contReaj[i].id }]
        }
        var dataReq = { "data": data, "ano": data.substring(0, 4), "mes": data.substring(5, 7), "motivo": motivo, "contratos": cont }
        if (opcao == 0) {
            dataReq.percentual = valor;
        } else {
            dataReq.valor = valor
        }
        const config = {
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` }
        }
        await axios.post(Apis.urlAjusteValorContrato, dataReq, config)
            .then((response) => {
                if (response.data.retorno[0].sucesso) {
                    alertaSucesso(response.data.retorno[0].mensagem)
                    setData(`${ano}-${mes}-${dia}`);
                    setMotivo('');
                    setValor('');
                    setOpcao('0');
                    setUF('MS');
                    setPesquisar('');
                    setQtRegistros(10);
                    var cont = contratosCopy;
                    for (var i = 0; i < cont.length; i++) {
                        cont[i].checked = false;
                    }
                    setContratosCopy(cont)
                    setLoading(false);
                } else {
                    alertaErro(response.data.retorno[0].mensagem);
                    setLoading(false);
                }
            })
            .catch((erro) => {
                console.log(erro);
                setLoading(false);
            })

    }


    const handleAddReajuste = (id) => {
        var cont = contratosCopy;
        if (id == 'todos') {
            if (cont.filter((item) => !item.checked).length > 0) {
                for (var i = 0; i < cont.length; i++) {
                    cont[i].checked = true;
                }
            } else {
                for (var i = 0; i < cont.length; i++) {
                    cont[i].checked = false;
                }
            }
        } else {
            for (var i = 0; i < cont.length; i++) {
                if (cont[i].id == id) {
                    if (!cont[i].checked) {
                        cont[i].checked = true;
                    } else {
                        cont[i].checked = false;
                    }
                }
            }
        }
        setContratosCopy(cont)
        setatualizarTela(!atualizarTela);
    }
    return (
        <div className={styles.container}>
            <div style={{ display: "flex", alignItems: "center", borderStyle: 'solid', borderBottomWidth: 1, borderColor: '#174c4f', marginBottom: 10, color: '#174c4f' }}>
                CONTRATOS PARA REAJUSTE
            </div>
            {opcao === '1' && <span style={{ color: 'red', fontWeight: 'bold' }}> ATENÇÃO, O VALOR INFORMADO SERÁ APLICADO PARA TODOS OS CONTRATOS SELECIONADOS, DESEJA REALMENTE REAJUSTAR POR VALOR?</span>}
            <div className={styles.topo_form}>
                <div>
                    <div className={styles.div_container_topo}>
                        <input
                            className={styles.input_topo}
                            type="text"
                            placeholder='Pesquisar'
                            value={pesquisar} onChange={(e) => setPesquisar(e.target.value)}
                            required
                        />
                        <SearchIcon sx={{ fontSize: 20 }} />
                    </div>
                    <div className={styles.div_container_topo}>
                        <select className={styles.filtro} value={opcao} onChange={(e) => setOpcao(e.target.value)}>
                            <option value="0">Por percentual</option>
                            <option value="1">Por valor</option>
                        </select>
                    </div>
                    <div className={styles.div_container_topo}>
                        <input
                            className={styles.input_topo}
                            type="number"
                            placeholder={opcao === '0' ? "Informa o percentual" : 'Informe o valor'}
                            value={valor} onChange={(e) => setValor(e.target.value)}
                            required
                        />
                        <TbSortAscendingNumbers sx={{ fontSize: 20 }} />
                    </div>
                    <div className={styles.div_container_topo}>
                        <input
                            style={{ width: '100%' }}
                            className={styles.input_topo}
                            type="date"
                            value={data} onChange={(e) => setData(e.target.value)}
                        />
                        <span> </span>
                    </div>
                    <div className={styles.div_container_topo}>
                        <input
                            className={styles.input_topo}
                            type="text"
                            placeholder='Motivo do reajuste'
                            value={motivo} onChange={(e) => setMotivo(e.target.value)}
                            required
                        />
                        <BsInfoCircle sx={{ fontSize: 20 }} />
                    </div>
                    {!loading &&
                        <div className={styles.div_container_topo} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 5, cursor: 'pointer' }} onClick={() => handleAddReajuste('todos')}>
                            {(contratosCopy?.filter((item) => !item.checked).length > 0) ?
                                <GrCheckbox sx={{ fontSize: 20 }} />
                                :
                                <GrCheckboxSelected sx={{ fontSize: 20 }} />
                            }
                            <span style={{ width: '100%', textAlign: 'left' }}>
                                MARCAR TODOS ({contratosCopy?.filter((item) => item.checked).length} de {contratosCopy?.length} para {uf})
                            </span>
                        </div>
                    }
                </div>
                <div>
                    <div className={styles.div_container_topo_add_contrato}>
                        <button onClick={handleReajustar}>Reajustar Valores</button>
                    </div>
                    <div className={styles.div_container_topo}>
                        <select className={styles.filtro} value={qtRegistros} onChange={(e) => setQtRegistros(e.target.value)}>
                            <option disabled>Registros</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={200}>200</option>
                            <option value={300}>300</option>
                            <option value={9999}>Mostrar todos</option>
                        </select>
                    </div>

                    <div className={styles.div_container_topo}>
                        <select className={styles.filtro} value={uf} onChange={(e) => setUF(e.target.value)}>
                            <option disabled>Registros</option>
                            <option value='MS'>MS</option>
                            <option value="MT">MT</option>
                            <option value="RO">RO</option>
                            <option value="PR">PR</option>
                            <option value="SP">SP</option>
                        </select>
                    </div>
                    <div className={styles.div_container_topo}>
                        <span style={{ width: '100%', textAlign: 'left' }}>
                            {contratosCopy?.length} registro
                            {contratosCopy?.length == 1 ? '' : 's'} encontrado
                            {contratosCopy?.length == 1 ? '' : 's'}
                        </span>
                    </div>
                </div>
            </div>
            {loading == 1 ?
                <div style={{ marginTop: 50 }}>
                    <Loading />
                </div>
                :
                <table cellspacing="0" rules="none">
                    <tr className={styles.topo_tabela}>
                        <th className={styles.titulo}>Cliente</th>
                        <th className={styles.titulo}>Reajustado em</th>
                        <th className={styles.titulo}>CDC</th>
                        <th className={styles.titulo}>Situação</th>
                        <th className={styles.titulo}>CNPJ / CPF</th>
                    </tr>
                    {contratosCopy?.filter((contrato) => {
                        if (pesquisar === '') {
                            return contrato
                        }
                        if (pesquisar !== '' && contrato.nome_cliente.toLowerCase().includes(pesquisar.toLowerCase())) {
                            return contrato
                        }
                        if (pesquisar !== '' && contrato.numero_contrato.toLowerCase().includes(pesquisar.toLowerCase())) {
                            return contrato
                        }
                        if (pesquisar !== '' && contrato.cnpj_cpf_cliente.toLowerCase().includes(pesquisar.toLowerCase())) {
                            return contrato
                        }
                    }).map((contrato, index) => (
                        index < qtRegistros &&
                        <tr onClick={() => handleAddReajuste(contrato?.id)}
                            className={styles.corpo_tabela} key={index} style={{
                                cursor: 'pointer',
                                backgroundColor: contrato?.situacao.toLowerCase() == 'bloqueado' ? '#f1b9b9' :
                                    contrato?.situacao.toLowerCase() == 'encerrado' ? '#ffffba' :
                                        index % 2 == 0 ? '#e5e7eb' : '#fff'
                            }}>
                            <td className={styles.titulo}>
                                <label className={styles.nomeCliente} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                                    {contrato?.checked ?
                                        <GrCheckboxSelected sx={{ fontSize: 20 }} />
                                        :
                                        <GrCheckbox sx={{ fontSize: 20 }} />
                                    }
                                    {contrato?.nome_cliente}
                                </label>
                            </td>
                            <td className={styles.titulo}>{contrato?.data_reajuste?.split('-').reverse().join('/')}</td>
                            <td className={styles.titulo}>{contrato?.numero_contrato}</td>

                            <td className={styles.titulo}>
                                {contrato?.situacao}
                            </td>

                            <td className={styles.titulo}>
                                {contrato?.cnpj_cpf_cliente}
                            </td>
                        </tr>

                    ))}
                </table>
            }
        </div>
    );
}