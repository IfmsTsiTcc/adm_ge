import React, { useEffect, useState } from 'react';
import styles from './Ponto.module.css';
import ViewListIcon from '@mui/icons-material/ViewList';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MedicationIcon from '@mui/icons-material/Medication';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Apis from '../../../Apis';
import ScaleIcon from '@mui/icons-material/Scale';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../Loading';
export default function Ponto() {
    const [ocorrencia, setOcorrencia] = useState('');
    const [ocorrenciaAcao, setOcorrenciaAcao] = useState([]);
    const [useData, setUseData] = useState();
    const [ponto, setPonto] = useState([]);
    const [reload, setReload] = useState('');
    const [loading, setLoading] = useState(false);
    const [tempo, setTempo] = useState('');
    const parametro = useParams();
    // Obtém a data/hora atual
    var data = new Date();
    var dias_sem = new Array('Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado');
    var meses = new Array('Janeiro', 'Fevreiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro');
    // pega hora atual e atualiza a cada 1 segundo
    setTimeout(function () {
        setUseData(`${data.getHours() < 10 ? '0' : ''}${data.getHours()}:${data.getMinutes() < 10 ? '0' : ''}${data.getMinutes()}:${data.getSeconds() < 10 ? '0' : ''}${data.getSeconds()}`)
    }, 1000);
    const handleOcorrencia = (ocorrencia) => {
        setOcorrencia(ocorrencia);
        const dataCreate = { "colaborador_id": parametro.colaborador_id, "cod_ocorrencia": ocorrencia, "acao": '0' }
        const requestOptionsCreate = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify(dataCreate)
        };
        //   cadastrar ponto
        const urlCreate = Apis.urlCadPonto;
        fetch(urlCreate, requestOptionsCreate)
            .then((response) => {
                return response.json()
            })
            .then((result) => { })
            .catch(erro => console.log(erro))

    }
    const handleAcao = (acao) => {
        const dataCreate = { "colaborador_id": parametro.colaborador_id, "cod_ocorrencia": ocorrenciaAcao?.cod_ocorrencia, "acao": acao }
        const requestOptionsCreate = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            body: JSON.stringify(dataCreate)
        };
        //   cadastrar ponto
        const urlCreate = Apis.urlCadPonto;
        fetch(urlCreate, requestOptionsCreate)
            .then((response) => {
                return response.json()
            })
            .then((result) => { })
            .catch(erro => console.log(erro))
        setReload(data.getSeconds())
    }
    useEffect(() => {
        setLoading(true);
        setTimeout(async function () {
            const requestOptions = {
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            };
            //   listar ultimo registro
            const body = JSON.stringify({ 'colaborador_id': parametro.colaborador_id })

            await axios.post(Apis.urlListarOnePonto, body, requestOptions)
                .then((response) => {
                    setOcorrenciaAcao(response.data.registro)
                })
                .catch((erro) => {
                    console.log(erro.response);
                })
            await axios.post(Apis.urlListarPonto, body, requestOptions)
                .then((response) => {
                    setTempo(response.data.retorno[0].tempo_trabalhado)
                    setPonto(response.data.registros);
                })
                .catch((erro) => {
                    console.log(erro.response.data)
                })
            setLoading(false)
        }, 300);
    }, [ocorrencia, reload])
    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loading />
            </div>
        )
    }
    return (
        <div style={{ padding: "30px" }}>
            <div className={styles.paiTopo}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <ViewListIcon></ViewListIcon>
                    <div>REGISTRO DE PONTO</div>
                </div>
                <hr className="border-b-1 border-gray-400" />
                <div className={styles.pai}>
                    <div className={styles.container}>
                        <div className={styles.linhasPai}>
                            <div className='text-left ml-1 mr-1 p-3'>
                                <p className='text-uppercase'>{ocorrenciaAcao?.nome_colaborador}</p>
                                <h5 className='mt-3'><strong>{`${dias_sem[data.getDay()]}, ${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()} - ${useData}`}</strong></h5>
                                <p className='mt-3'>
                                    {ocorrenciaAcao.length == 0 && <ScaleIcon />}
                                    {ocorrenciaAcao.length == 0 ? " Aguardando registro de ponto" : ocorrenciaAcao?.ultima_ocorrencia}
                                    {ocorrenciaAcao?.ultima_ocorrencia && " em"} {ocorrenciaAcao?.hora}
                                </p>
                            </div>
                            <div className={styles.pai}>
                                {/* <div className='w-full ml-1 mr-1 mt-3'>
                                        texto aqui
                                    </div> */}
                            </div>

                            <div className={styles.pai}>
                                <div className='w-full mt-3 ml-1 mr-1'>
                                    <Button onClick={ocorrenciaAcao?.cod_ocorrencia === '1' && ocorrenciaAcao?.acao === "0" ? () => handleAcao('1') : () => handleOcorrencia('1')} className='w-full d-block h-40' variant="contained" disabled={ocorrenciaAcao?.cod_ocorrencia === '2' && ocorrenciaAcao?.acao === "0" && true} color={`${ocorrenciaAcao?.cod_ocorrencia === '1' && ocorrenciaAcao?.acao === "0" ? "error" : "success"}`}>
                                        <p>{ocorrenciaAcao?.cod_ocorrencia === '1' && ocorrenciaAcao?.acao === "0" ? <><p><LoginIcon /></p><p>FIM <br /> JORNADA</p></> : <><p><LogoutIcon /></p><p>INICIAR JORNADA</p></>}</p>
                                    </Button>
                                </div>
                                <div className='w-full mt-3 ml-1 mr-1'>
                                    <Button onClick={ocorrenciaAcao?.cod_ocorrencia === '2' && ocorrenciaAcao?.acao === "0" ? () => handleAcao('1') : () => handleOcorrencia('2')} className='w-full d-block h-40' variant="contained" color={`${ocorrenciaAcao?.cod_ocorrencia === '2' && ocorrenciaAcao?.acao === "0" ? "error" : "success"}`}>
                                        <p>{ocorrenciaAcao?.cod_ocorrencia === '2' && ocorrenciaAcao?.acao === "0" ? <><p><LoginIcon /></p><p>FIM <br /> INTERVALO</p></> : <><p><RestaurantIcon /></p><p>INICIAR INTERVALO</p></>}</p>
                                    </Button>
                                </div>
                                <div className='w-full mt-3 ml-1 mr-1'>
                                    <Button onClick={ocorrenciaAcao?.cod_ocorrencia === '4' && ocorrenciaAcao?.acao === "0" ? () => handleAcao('1') : () => handleOcorrencia('4')} className='w-full d-block h-40' variant="contained" color={`${ocorrenciaAcao?.cod_ocorrencia === '4' && ocorrenciaAcao?.acao === "0" ? "error" : "success"}`}>
                                        <p>{ocorrenciaAcao?.cod_ocorrencia === '4' && ocorrenciaAcao?.acao === "0" ? <><p><LoginIcon /></p><p>FIM <br /> FÉRIAS</p></> : <><p><AirplanemodeActiveIcon /></p><p>INICIAR <br />FÉRIAS</p></>}</p>
                                    </Button>
                                </div>
                                <div className='w-full mt-3 ml-1 mr-1'>
                                    <Button onClick={ocorrenciaAcao?.cod_ocorrencia === '3' && ocorrenciaAcao?.acao === "0" ? () => handleAcao('1') : () => handleOcorrencia('3')} className='w-full d-block h-40' variant="contained" color={`${ocorrenciaAcao?.cod_ocorrencia === '3' && ocorrenciaAcao?.acao === "0" ? "error" : "success"}`}>
                                        <p>{ocorrenciaAcao?.cod_ocorrencia === '3' && ocorrenciaAcao?.acao === "0" ? <><p><LoginIcon /></p><p>FIM <br /> MÉDICO</p></> : <><p><MedicationIcon /></p><p>INICIAR MÉDICO</p></>}</p>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.containerSistemas}>
                        <h5 className='text-left'><ScheduleIcon /> Tempo de trabalho: {tempo}</h5>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Data</strong></TableCell>
                                        <TableCell align="left"><strong>Hora</strong></TableCell>
                                        <TableCell align="left"><strong>Ocorrência</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ponto?.map((ponto, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} className={`${index % 2 === 0 && 'bg-gray-200'}`}>
                                            <TableCell component="th" scope="row">{ponto.data}</TableCell>
                                            <TableCell align="left">{ponto.hora}</TableCell>
                                            <TableCell align="left">{ponto.ocorrencia}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}