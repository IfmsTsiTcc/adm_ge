import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import Apis from '../../../Apis';
import Tooltip from '@mui/material/Tooltip';
import ExcluirSistema from '../../exclusao/sistema/ExcluirSistema';
import SearchIcon from '@mui/icons-material/Search';
import styles from './ListarSistemas.module.css';
import { alertaErro } from '../../alertas/Alertas';
import SearchInput from '../../useDebounce/SearchInput';
import axios from 'axios';

export default function ListarSistemas() {
    const [linha, setLinha] = useState(10);
    const [loading, setLoading] = useState(false);
    const [sistemas, setSistemas] = useState([]);
    const [text, setText] = useState('');

    const redirect = useNavigate();

    const handleRegistros = (event) => {
        setLinha(event.target.value);
    };
    useEffect(() => {
        const handleSistemas = async () => {
            setLoading(true);
            const requestOptions = {
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            };

            await axios.post(Apis.urlListarProdutos, {}, requestOptions)
                .then((response) => {
                    if (response.status) {
                        if (response.data.registros.length < 1) {
                            setSistemas([]);
                            setLoading(false)
                            return alertaErro(response.data.retorno[0].mensagem);
                        }
                        setSistemas(response.data.registros)
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
        handleSistemas();
    }, []);
    const redirecionar = (url) => {
        redirect(url)
    }
    return (
        <div className={styles.container}>
            <div style={{ display: "flex", alignItems: "center", borderStyle: 'solid', borderBottomWidth: 1, borderColor: '#174c4f', marginBottom: 10, color: '#174c4f' }}>
                LISTAGEM DE SISTEMA
            </div>

            <div className={styles.topo_form}>
                <div>
                    <div className={styles.div_container_topo}>
                        <SearchInput value={text} onChange={(search) => setText(search)} />
                        <SearchIcon sx={{ fontSize: 20 }} />
                    </div>
                    {/* <div className={styles.div_container_topo}>
                        <select className={styles.filtro} onChange={handleFiltrar} value={filtrar}>
                            <option disabled>Filtrar por situação</option>
                            <option value="">Todos</option>
                            <option value="0">Liberados</option>
                            <option value="1">Bloqueados</option>
                            <option value="2">Encerrados</option>
                        </select>
                    </div> */}
                </div>
                <div>
                    <div className={styles.div_container_topo_add_contrato} style={{ backgroundColor: '#ffc107' }} onClick={() => redirecionar('/upload-sistemas')}>
                        <button>Atualizar Sistema</button>
                    </div>
                    <div className={styles.div_container_topo_add_contrato} onClick={() => redirecionar('/cadastrar-sistema')}>
                        <button>Adicionar Sistema</button>
                    </div>
                    <div className={styles.div_container_topo}>
                        <select className={styles.filtro} value={linha} onChange={handleRegistros}>
                            <option disabled>Registros</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    <div className={styles.div_container_topo}>
                        <span style={{ width: '100%', textAlign: 'left' }}>
                            {sistemas?.length} registro
                            {sistemas?.length == 1 ? '' : 's'} encontrado
                            {sistemas?.length == 1 ? '' : 's'}
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
                        <th className={styles.titulo}>Sistema</th>
                        <th className={styles.titulo}>Data</th>
                        <th className={styles.titulo}>Versão</th>
                        <th className={styles.titulo}>Ações</th>
                    </tr>
                    {sistemas?.filter((sistema) => {
                        if (text === '') {
                            return sistema
                        }
                        if (text !== '' && sistema.nome.toLowerCase().includes(text.toLowerCase())) {
                            return sistema
                        }
                        if (text !== '' && sistema.versao.toLowerCase().includes(text.toLowerCase())) {
                            return sistema
                        }
                    }).map((sistema, index) => (
                        <tr className={styles.corpo_tabela} key={index} style={{
                            backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                        }}>
                            <td className={styles.id}>{sistema.id}</td>
                            <td className={styles.titulo}>
                                <p className={styles.nomeCliente}>{sistema.nome}</p>
                            </td>
                            <td className={styles.titulo}>{sistema.data_atualizacao?.substring(0, 10).split('-').reverse().join('/')}</td>
                            <td className={styles.titulo}>{sistema.versao}</td>
                            <td className={styles.opcoes}>
                                <ButtonGroup disableElevation variant="contained">
                                    <Tooltip title="Editar">
                                        <Button size="small" style={{ backgroundColor: "rgb(255, 193, 7)", borderColor: "white" }}><Link to={`/alterar-sistema/${sistema.id}&${sistema.nome}&${sistema.versao}`}><EditIcon sx={{ fontSize: 20 }} /></Link></Button>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <Button size="small" style={{ borderColor: "white" }} color="error">
                                            <ExcluirSistema id={sistema.id} sistema={sistema.nome} versao={sistema.versao} />
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