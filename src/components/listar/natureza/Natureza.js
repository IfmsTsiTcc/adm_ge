import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import Apis from '../../../Apis';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import styles from './Natureza.module.css';
import { alertaErro } from '../../alertas/Alertas';
import SearchInput from '../../useDebounce/SearchInput';
import ExcluirNatureza from '../../exclusao/natureza/ExcluirNatureza';
import axios from 'axios';

export default function Natureza() {
    const [linha, setLinha] = useState(10);
    const [loading, setLoading] = useState(false);
    const [naturezas, setNaturezas] = useState([]);
    const [text, setText] = useState('');

    const redirect = useNavigate();

    const handleRegistros = (event) => {
        setLinha(event.target.value);
    };
    useEffect(() => {
        const handleNatureza = async () => {
            setLoading(true);
            const requestOptions = {
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            };

            await axios.get(Apis.urlListarNatureza, requestOptions)
                .then((response) => {
                    if (response.status) {
                        if (response.data.registros.length < 1) {
                            setNaturezas([]);
                            setLoading(false)
                            return alertaErro(response.data.retorno[0].mensagem);
                        }
                        setNaturezas(response.data.registros)
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
        handleNatureza();
    }, []);
    const redirecionar = () => {
        redirect('/cadastrar-natureza')
    }
    return (
        <div className={styles.container}>
            <div style={{ display: "flex", alignItems: "center", borderStyle: 'solid', borderBottomWidth: 1, borderColor: '#174c4f', marginBottom: 10, color: '#174c4f' }}>
                LISTAGEM DE NATUREZA
            </div>

            <div className={styles.topo_form}>
                <div>
                    <div className={styles.div_container_topo}>
                        <SearchInput value={text} onChange={(search) => setText(search)} />
                        <SearchIcon sx={{ fontSize: 20 }} />
                    </div>
                </div>
                <div>
                    <div className={styles.div_container_topo_add_contrato} onClick={redirecionar}>
                        <button>Adicionar Natureza</button>
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
                            {naturezas?.length} registro
                            {naturezas?.length == 1 ? '' : 's'} encontrado
                            {naturezas?.length == 1 ? '' : 's'}
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
                        <th className={styles.titulo}>Descrição</th>
                        <th className={styles.titulo}>Tipo</th>
                        <th className={styles.titulo}>Ações</th>
                    </tr>
                    {naturezas?.filter((natureza) => {
                        if (text === '') {
                            return natureza
                        }
                        if (text !== '' && natureza?.descricao.toLowerCase().includes(text.toLowerCase())) {
                            return natureza
                        }
                    }).map((natureza, index) => (
                        <tr className={styles.corpo_tabela} key={index} style={{
                            backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                        }}>
                            <td className={styles.id}>{natureza?.id}</td>
                            <td className={styles.titulo}>
                                <p className={styles.nomeCliente}>{natureza?.descricao}</p>
                            </td>
                            <td className={styles.titulo}>{natureza?.RD == 0 ? 'Receita' : 'Despesa'}</td>
                            <td className={styles.opcoes}>
                                <ButtonGroup disableElevation variant="contained">
                                    <Tooltip title="Editar">
                                        <Button size="small" style={{ backgroundColor: "rgb(255, 193, 7)", borderColor: "white" }}><Link to={`/alterar-natureza/${natureza?.id}&${natureza?.descricao}&${natureza?.RD}&${natureza?.conta}`}><EditIcon sx={{ fontSize: 20 }} /></Link></Button>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <Button size="small" style={{ borderColor: "white" }} color="error">
                                            <ExcluirNatureza id={natureza?.id} descricao={natureza?.descricao} />
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