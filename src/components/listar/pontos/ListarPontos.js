import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../Loading';
import Apis from '../../../Apis';
import styles from './ListarPontos.module.css';
import { alertaErro } from '../../alertas/Alertas';
import axios from 'axios';

export default function ListarPontos() {
    const parametro = useParams();
    const [linha, setLinha] = useState(31);
    const [loading, setLoading] = useState(false);
    const [pontos, setPontos] = useState([]);
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const [dataIni, setDataIni] = useState(`${ano}-${mes}-01`);
    const [dataFin, setDataFin] = useState(`${ano}-${mes}-${dia}`);
    const redirect = useNavigate();

    const handleRegistros = (event) => {
        setLinha(event.target.value);
    };
    useEffect(() => {
        const handlePontos = async () => {
            setLoading(true);
            const requestOptions = {
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            };
            const body = { "colaborador_id": parametro.id, "data_inicial": dataIni, "data_final": dataFin }
            await axios.post(Apis.urlListarPontoUser, body, requestOptions)
                .then((response) => {
                    console.log(response.data);
                    setLoading(false)
                    setPontos(response.data.pontos)
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
        handlePontos();
    }, [dataIni, dataFin]);


    const planilha = async () => {
        const dataPlanilha = new Date();
        var horasPlanilhaTrab = 0;
        var minutosPlanilhaTrab = 0;
        var segundosPlanilhaTrab = 0;

        var horasPlanilhaFalta = 0;
        var minutosPlanilhaFalta = 0;
        var segundosPlanilhaFalta = 0;

        var csv = `"\n CARTÃO DE PONTO\r\n ${pontos.nome_colaborador}\r\n Empresa: GE Suporte Logico Ltda\r\n CNPJ: 22.714.341/0001.61\r\n Emitido em ${dia}/${mes}/${ano} as ${String(dataPlanilha.getHours()).padStart(2, '0')}:${String(dataPlanilha.getMinutes()).padStart(2, '0')}:${String(dataPlanilha.getSeconds()).padStart(2, '0')}\n"\n`;
        csv += 'DATA,DIA,ENTRADA,INTERVALO, FIM INTERVALO,SAIDA,TRAB,FALTAS,OBS\n';
        pontos.pontos?.map((item) => {

            horasPlanilhaTrab = horasPlanilhaTrab + parseInt(item.horas_trabalhadas.substring(0, 2));
            minutosPlanilhaTrab = minutosPlanilhaTrab + parseInt(item.horas_trabalhadas.substring(3, 5));
            segundosPlanilhaTrab = segundosPlanilhaTrab + parseInt(item.horas_trabalhadas.substring(6, 8));

            horasPlanilhaFalta = horasPlanilhaFalta + parseInt(item.faltas_atrasos.substring(0, 2));
            minutosPlanilhaFalta = minutosPlanilhaFalta + parseInt(item.faltas_atrasos.substring(3, 5));
            segundosPlanilhaFalta = segundosPlanilhaFalta + parseInt(item.faltas_atrasos.substring(6, 8));

            csv += item?.data?.split('-').reverse().join('/');
            csv += ',' + item?.semana.substring(0, 3);
            csv += ',' + item?.entrada;
            csv += ',' + item?.inicio_intervalo;
            csv += ',' + item?.fim_intervalo;
            csv += ',' + item?.saida;
            csv += ',' + item?.horas_trabalhadas;
            csv += ',' + item?.faltas_atrasos;
            csv += ',' + item?.obs;
            csv += '\n';
        })
        horasPlanilhaTrab = (horasPlanilhaTrab * 60) * 60;
        minutosPlanilhaTrab = minutosPlanilhaTrab * 60;
        horasPlanilhaTrab = horasPlanilhaTrab + minutosPlanilhaTrab + segundosPlanilhaTrab;
        const dataPlanilhaTrab = new Date(horasPlanilhaTrab * 1000);
        csv += `\n , , , , , , ,HRS TRAB,${String(dataPlanilhaTrab.getUTCHours()).padStart(2, '0')}:${String(dataPlanilhaTrab.getUTCMinutes()).padStart(2, '0')}:${String(dataPlanilhaTrab.getSeconds()).padStart(2, '0')}\n`;

        horasPlanilhaFalta = (horasPlanilhaFalta * 60) * 60;
        minutosPlanilhaFalta = minutosPlanilhaFalta * 60;
        horasPlanilhaFalta = horasPlanilhaFalta + minutosPlanilhaFalta + segundosPlanilhaFalta;
        const dataPlanilhaFalta = new Date(horasPlanilhaFalta * 1000);
        csv += ` , , , , , , ,HRS ATRASO,${String(dataPlanilhaFalta.getUTCHours()).padStart(2, '0')}:${String(dataPlanilhaFalta.getUTCMinutes()).padStart(2, '0')}:${String(dataPlanilhaFalta.getSeconds()).padStart(2, '0')}\n`;

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv.toUpperCase());
        hiddenElement.target = '_blank';
        hiddenElement.download = `${pontos.nome_colaborador.split(' ').join('_')?.toUpperCase()}_${dia}/${mes}/${ano}_${String(dataPlanilha.getHours()).padStart(2, '0')}:${String(dataPlanilha.getMinutes()).padStart(2, '0')}:${String(dataPlanilha.getSeconds()).padStart(2, '0')}.csv`;
        hiddenElement.click();
    }
    return (
        <div className={styles.container}>
            <div style={{ display: "flex", alignItems: "center", borderStyle: 'solid', borderBottomWidth: 1, borderColor: '#174c4f', marginBottom: 10, color: '#174c4f' }}>
                <b style={{ textTransform: 'uppercase' }}>{pontos.nome_colaborador}</b>
            </div>
            <div className={styles.topo_form}>
                <div>
                    <div className={styles.div_container_topo}>
                        <input type='date' value={dataIni} onChange={(e) => setDataIni(e.target.value)} className={styles.filtro} />
                    </div>
                    <div className={styles.div_container_topo}>
                        <input type='date' value={dataFin} onChange={(e) => setDataFin(e.target.value)} className={styles.filtro} />
                    </div>
                </div>
                <div>
                    <div className={styles.div_container_topo_add_contrato} onClick={planilha}>
                        <button>Salvar Dados</button>
                    </div>
                    <div className={styles.div_container_topo}>
                        <select className={styles.filtro} value={linha} onChange={handleRegistros}>
                            <option disabled>Registros</option>
                            <option value={31}>31 dias</option>
                            <option value={99999}>todos os dias</option>
                        </select>
                    </div>
                    <div className={styles.div_container_topo}>
                        <span style={{ width: '100%', textAlign: 'left' }}>
                            {pontos.pontos?.length} registro
                            {pontos.pontos?.length == 1 ? '' : 's'} encontrado
                            {pontos.pontos?.length == 1 ? '' : 's'}
                        </span>
                    </div>
                </div>
            </div>

            {loading ?
                <div style={{ marginTop: 50 }}>
                    <div style={{ marginTop: 50 }}>
                        <Loading />
                    </div>
                </div>
                :
                <table cellspacing="0" rules="none">
                    <tr className={styles.topo_tabela}>
                        <th className={styles.titulo}>DATA</th>
                        <th className={styles.titulo}>DIA</th>
                        <th className={styles.titulo}>ENTRADA</th>
                        <th className={styles.titulo}>INTERVALO</th>
                        <th className={styles.titulo}>FIM INTERVALO</th>
                        <th className={styles.titulo}>SAIDA</th>
                        <th className={styles.titulo}>TRAB.</th>
                        <th className={styles.titulo}>FALTAS</th>
                        <th className={styles.titulo}>OBS</th>
                    </tr>
                    {pontos.pontos?.map((item, index) => (
                        // index <= linha &&
                        <tr className={styles.corpo_tabela} key={index} style={{
                            backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                        }}>
                            <td className={styles.titulo}>{item?.data?.split('-').reverse().join('/')}</td>
                            <td className={styles.titulo}>{item?.semana.substring(0, 3)}</td>
                            <td className={styles.titulo}>{item?.entrada}</td>
                            <td className={styles.titulo}>{item?.inicio_intervalo}</td>
                            <td className={styles.titulo}>{item?.fim_intervalo}</td>
                            <td className={styles.titulo}>{item?.saida}</td>
                            <td className={styles.titulo}>{item.horas_trabalhadas}</td>
                            <td className={styles.titulo}>{item?.faltas_atrasos}</td>
                            <td className={styles.titulo}>{item?.obs}</td>
                        </tr>

                    ))}
                </table>
            }
        </div>
    );
}