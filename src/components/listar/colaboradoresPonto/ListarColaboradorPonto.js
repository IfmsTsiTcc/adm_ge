import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import styles from './ListarColaboradorPonto.module.css';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import Apis from '../../../Apis';
import Tooltip from '@mui/material/Tooltip';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ExcluirColaborador from '../../exclusao/colaborador/ExcluirColaborador';
import SearchIcon from '@mui/icons-material/Search';
import { alertaErro } from '../../alertas/Alertas';
import SearchInput from '../../useDebounce/SearchInput';
import axios from 'axios';
export default function ListarColaboradorPonto() {
    const [linha, setLinha] = useState(10);
    const [loading, setLoading] = useState(false);
    const redirect = useNavigate();
    const [colaboradores, setcolaboradores] = useState([]);
    const [text, setText] = useState('');

    const handleChange = (event) => {
        setLinha(event.target.value);
    };
    useEffect(() => {
        const handleColaboradores = async () => {
            setLoading(true);
            const requestOptions = {
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            };

            await axios.post(Apis.urlListarColaborador, {}, requestOptions)
                .then((response) => {
                    console.log(response);
                    if (response.status) {
                        if (response.data.registros.length < 1) {
                            setcolaboradores([]);
                            setLoading(false)
                            return alertaErro(response.data.retorno[0].mensagem);
                        }
                        setcolaboradores(response.data.registros)
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
        handleColaboradores();
    }, []);
    const redirecionar = () => {
        redirect('/cadastrar-colaborador')
    }
    return (
        <div className={styles.container}>
            <div style={{ display: "flex", alignItems: "center", borderStyle: 'solid', borderBottomWidth: 1, borderColor: '#174c4f', marginBottom: 10, color: '#174c4f' }}>
                LISTAGEM DE COLABORADORES
            </div>

            <div className={styles.topo_form}>
                <div>
                    <div className={styles.div_container_topo}>
                        <SearchInput value={text} onChange={(search) => setText(search)} />
                        <SearchIcon sx={{ fontSize: 20 }} />
                    </div>
                </div>
                <div>
                    <div className={styles.div_container_topo_add_contrato} onClick={() => redirecionar()}>
                        <button>Adicionar Colaborador</button>
                    </div>
                    <div className={styles.div_container_topo}>
                        <select className={styles.filtro} value={linha} onChange={handleChange}>
                            <option disabled>Registros</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    <div className={styles.div_container_topo}>
                        <span style={{ width: '100%', textAlign: 'left' }}>
                            {colaboradores?.length} registro
                            {colaboradores?.length == 1 ? '' : 's'} encontrado
                            {colaboradores?.length == 1 ? '' : 's'}
                        </span>
                    </div>
                </div>
            </div>

            {loading ?
                <div style={{ marginTop: 50 }}>
                    <Loading />
                </div>
                :
                colaboradores &&
                <table cellspacing="0" rules="none">
                    <tr className={styles.topo_tabela}>
                        <th className={styles.titulo}>colaborador</th>
                        <th className={styles.titulo}>Data de Cadastro</th>
                        <th className={styles.titulo}>Ações</th>
                    </tr>
                    {colaboradores?.filter((colaborador) => {
                        if (text === '') {
                            return colaborador
                        }
                        if (text !== '' && colaborador?.nome.toLowerCase().includes(text.toLowerCase())) {
                            return colaborador
                        }
                        if (text !== '' && colaborador?.matricula.includes(text)) {
                            return colaborador
                        }
                        if (text !== '' && colaborador?.email.includes(text)) {
                            return colaborador
                        }
                    }).map((colaborador, index) => (
                        <tr className={styles.corpo_tabela} key={index} style={{
                            backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                        }}>
                            <td className={styles.id}>{colaborador.id}</td>
                            <td className={styles.titulo}>
                                <p className={styles.nomeCliente}>{colaborador.nome}</p>
                                <p className={styles.situacao}>Email: {colaborador.email}</p>
                                <p className={styles.situacao}>Matrícula: {colaborador.matricula}</p>
                            </td>
                            <td className={styles.titulo}>{colaborador.updated_at}</td>
                            <td className={styles.opcoes}>
                                <ButtonGroup disableElevation variant="contained">
                                    <Tooltip title="Macações de eventos">
                                        <Button size='small' style={{ borderColor: "white" }} color="success"><Link to={`/listar-ponto-colaborador/${colaborador?.id}`}><ScheduleIcon sx={{ fontSize: 20 }} /></Link></Button>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <Button size='small' style={{ backgroundColor: "rgb(255, 193, 7)", borderColor: "white" }}><Link to={`/alterar-colaborador/${colaborador?.id}`}><EditIcon sx={{ fontSize: 20 }} /></Link></Button>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <Button size='small' style={{ borderColor: "white" }} color="error">
                                            <ExcluirColaborador id={colaborador?.id} colaborador={colaborador?.nome} />
                                        </Button>
                                    </Tooltip>
                                </ButtonGroup>
                            </td>
                        </tr>

                    ))}
                </table>
            }
        </div>
    );
}