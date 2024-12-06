import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import Apis from '../../../Apis';
import styles from './Mensalidades.module.css';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import axios from 'axios';

export default function Mensalidades() {
    const [loading, setLoading] = useState(false);
    const [loadingPlanilha, setLoadingPlanilha] = useState(false);
    const [mensalidades, setMensalidades] = useState([]);
    const [status, setStatus] = useState(0);
    const [page, setPage] = useState(-1);
    const dataAtual = new Date();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, 0);
    const dia = String(dataAtual.getDate()).padStart(2, 0);
    const ano = dataAtual.getFullYear();
    const [data, setData] = useState(`${ano}-${mes}-${dia}`);

    const redirect = useNavigate();

    const handleData = (e) => {
        setPage(-1);
        setMensalidades([]);
        setData(e.target.value);
    }

    const handleStatus = (e) => {
        setPage(-1);
        setMensalidades([]);
        setStatus(e.target.value);
    }


    useEffect(() => {
        const intersectionObserve = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                setPage(page => page + 1);
            }
        });

        intersectionObserve.observe(document.querySelector('#sentinela'));

        return () => intersectionObserve.disconnect();
    }, []);

    useEffect(() => {
        const handleMensalidades = async () => {
            setLoading(true);
            const requestOptions = {
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            };
            await axios.post(Apis.urlListarMensalidades, { "ano": data.substring(0, 4), "mes": data.substring(5, 7), "status": status, "offset": page, regPag: 20 }, requestOptions)
                .then((response) => {
                    console.log(response);
                    if (response.status) {
                        setMensalidades([...mensalidades, ...response.data.registros])
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
        handleMensalidades();
    }, [data, status, page]);

    // gerar planilha de todos os contratos
    const downloadCsv = async () => {
        setLoadingPlanilha(true);
        var csv = 'NOME CLIENTE,CDC,UF,VALOR\n';
        const requestOptions = {
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
        };

        await axios.post(Apis.urlListarMensalidades, { "ano": data.substring(0, 4), "mes": data.substring(5, 7) }, requestOptions)
            .then((response) => {
                if (response.status) {
                    if (response.data.registros.length < 1) {
                        setLoadingPlanilha(false);
                        return;
                    }
                    response.data.registros?.map((item) => {
                        csv += item.nome;
                        csv += ',' + item.numero_contrato;
                        csv += ',' + item.uf;
                        csv += ',' + item.mensalidade;
                        csv += '\n';
                    })

                    var hiddenElement = document.createElement('a');
                    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv.toUpperCase());
                    hiddenElement.target = '_blank';
                    hiddenElement.download = 'lista_contratos.csv';
                    hiddenElement.click();
                    setLoadingPlanilha(false);
                }
                setLoadingPlanilha(false);
            })
            .catch((erro) => {
                if (erro.response.status > 201) {
                    alertaErro(`Erro ${erro.response.status} - ${erro.response.data.retorno[0].mensagem}`);
                    redirect('/')
                    setLoadingPlanilha(false);
                }
            })
    }

    const gerarMensalidade = async () => {
        setLoading(true)
        const requestOptions = {
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
        };
        await axios.post(Apis.urlCadMensalidade, { "ano": data.substring(0, 4), "mes": data.substring(5, 7) }, requestOptions)
            .then((response) => {
                alertaSucesso(`${response.data.retorno[0].mensagem}`);
                setLoading(false)
            })
            .catch((erro) => {
                console.log(erro);
                if (erro.response.status > 201) {
                    alertaErro(`Erro ${erro.response.status} - ${erro.response.data.retorno[0].mensagem}`);
                    setLoading(false)
                }
            })
    }
    if (loadingPlanilha) {
        return (
            <div style={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loading texto="gerando planilha, o download será iniciado em breve" />
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <div style={{ display: "flex", alignItems: "center", borderStyle: 'solid', borderBottomWidth: 1, borderColor: '#174c4f', marginBottom: 10, color: '#174c4f' }}>
                LISTAGEM DE MENSALIDADE
            </div>

            <div className={styles.topo_form}>
                <div>
                    <div className={styles.div_container_topo}>
                        <input type='date' value={data} onChange={handleData} style={{ width: '100%', backgroundColor: 'transparent' }} />
                    </div>
                    <div className={styles.div_container_topo}>
                        <select className={styles.filtro} value={status} onChange={handleStatus}>
                            <option disabled>status</option>
                            <option value={0}>Todos</option>
                            <option value={1}>somente os que tem valores acima de 0</option>
                            <option value={2}>somente os que estao sem valores</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div className={styles.div_container_topo} onClick={downloadCsv}>
                        <button>Exportar Dados</button>
                    </div>
                    <div className={styles.div_container_topo_add_contrato} onClick={gerarMensalidade}>
                        <button>Gerar Mensalidade</button>
                    </div>
                    <div className={styles.div_container_topo}>
                        <span style={{ width: '100%', textAlign: 'left' }}>
                            {mensalidades?.length} registro
                            {mensalidades?.length == 1 ? '' : 's'} encontrado
                            {mensalidades?.length == 1 ? '' : 's'}
                        </span>
                    </div>
                </div>
            </div>
            <table cellspacing="0" rules="none">
                <tr className={styles.topo_tabela}>
                    <th className={styles.titulo}>Cliente</th>
                    <th className={styles.titulo}>CDC</th>
                    <th className={styles.titulo}>UF</th>
                    <th className={styles.titulo}>Valor</th>
                </tr>
                {mensalidades.map((mensalidade, index) => (
                    <tr className={styles.corpo_tabela} key={index} style={{
                        backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                    }}>
                        <td className={styles.titulo}>
                            <p className={styles.nomeCliente}>{mensalidade.nome}</p>
                        </td>
                        <td className={styles.titulo}>{mensalidade.numero_contrato}</td>
                        <td className={styles.titulo}>{mensalidade.uf}</td>
                        <td className={styles.titulo}>R$ {mensalidade.mensalidade}</td>
                    </tr>
                ))}
            </table>
            <div id='sentinela' style={{ height: mensalidades.length < 1 ? '100vh' : 0 }}>
                {
                    loading &&
                    <div style={{ marginTop: 50 }}>
                        <div style={{ marginTop: 50 }}>
                            <Loading />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}