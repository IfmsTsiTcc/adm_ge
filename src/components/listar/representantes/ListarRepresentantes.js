import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import EditIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Work';
import styles from './ListarRepresentantes.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import Tooltip from '@mui/material/Tooltip';
import Apis from '../../../Apis';
import ExcluirRepresentante from '../../exclusao/representante/ExcluirRepresentante';
import SearchIcon from '@mui/icons-material/Search';
import { alertaErro } from '../../alertas/Alertas';
import SearchInput from '../../useDebounce/SearchInput';
import axios from 'axios';
export default function ListarRepresentantes() {
    const [linha, setLinha] = useState(10);
    const [loading, setLoading] = useState(false);
    const redirect = useNavigate();
    const [text, setText] = useState('');

    const handleRegistros = (event) => {
        setLinha(event.target.value);
    };
    const [representantes, setRepresentantes] = useState([]);
    useEffect(() => {
        const handleRepresentantes = async () => {
            setLoading(true);
            const requestOptions = {
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            };

            await axios.post(Apis.urlListarRepresentantes, {}, requestOptions)
                .then((response) => {
                    if (response.status) {
                        if (response.data.registros.length < 1) {
                            setRepresentantes([]);
                            setLoading(false)
                            return alertaErro(response.data.retorno[0].mensagem);
                        }
                        setRepresentantes(response.data.registros)
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
        handleRepresentantes();
    }, []);

    const redirecionar = () => {
        redirect('/cadastrar-representantes')
    }
    return (
        <div className={styles.container}>
            <div style={{ display: "flex", alignItems: "center", borderStyle: 'solid', borderBottomWidth: 1, borderColor: '#174c4f', marginBottom: 10, color: '#174c4f' }}>
                LISTAGEM DE REPRESENTANTE
            </div>

            <div className={styles.topo_form}>
                <div>
                    <div className={styles.div_container_topo}>
                        <SearchInput value={text} onChange={(search) => setText(search)} />
                        <SearchIcon sx={{ fontSize: 20 }} />
                    </div>
                    <div className={styles.div_container_topo}>
                        <select className={styles.filtro}>
                            <option value="1">Mostrar inativo</option>
                            <option value="2">Ocultar inativo</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div className={styles.div_container_topo_add_contrato} onClick={redirecionar}>
                        <button>Adicionar Representante</button>
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
                            {representantes?.length} registro
                            {representantes?.length == 1 ? '' : 's'} encontrado
                            {representantes?.length == 1 ? '' : 's'}
                        </span>
                    </div>
                </div>
            </div>

            {loading ?
                <div style={{ marginTop: 50 }}>
                    <Loading />
                </div>
                :
                <table cellspacing="0" rules="none">
                    <tr className={styles.topo_tabela}>
                        <th className={styles.titulo}>Representante</th>
                        <th className={styles.titulo}>Cidade</th>
                        <th className={styles.titulo}>UF</th>
                        <th className={styles.titulo}>Data de Cadastro</th>
                        <th className={styles.titulo}>Ações</th>
                    </tr>
                    {representantes?.filter((representante) => {
                        if (text === '') {
                            return representante
                        }
                        if (text !== '' && representante.nome?.toLowerCase().includes(text.toLowerCase())) {
                            return representante
                        }
                        if (text !== '' && representante.cnpj_cpf?.includes(text)) {
                            return representante
                        }
                        if (text !== '' && representante.email?.toLowerCase().includes(text.toLowerCase())) {
                            return representante
                        }
                    }).map((representante, index) => (
                        <tr className={styles.corpo_tabela} key={index} style={{
                            backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                        }}>
                            <td className={styles.id}>{representante.id}</td>
                            <td className={styles.titulo}>
                                <p className={styles.nomeCliente}>{representante.nome}</p>
                                <p className={styles.situacao}>Email: {representante.email}</p>
                                <p className={styles.situacao}>CNPJ / CPF: {representante.cnpj_cpf}</p>
                            </td>
                            <td className={styles.titulo}>{representante.cidade}</td>
                            <td className={styles.titulo}>{representante.uf}</td>
                            <td className={styles.titulo}>{representante.updated_at}</td>
                            <td className={styles.opcoes}>
                                <ButtonGroup disableElevation variant="contained">
                                    <Tooltip title="Financeiro">
                                        <Button color="success" size='small'><WorkIcon sx={{ fontSize: 20 }} /></Button>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <Button size='small' style={{ backgroundColor: "rgb(255, 193, 7)", borderColor: "white" }}><Link to={`/alterar-representante/${representante?.id}`}><EditIcon sx={{ fontSize: 20 }} /></Link></Button>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <Button size='small' style={{ borderColor: "white" }} color="error">
                                            <ExcluirRepresentante id={representante?.id} representante={representante?.nome} />
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