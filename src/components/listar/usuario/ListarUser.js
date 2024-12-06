import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Link } from 'react-router-dom';
import KeyIcon from '@mui/icons-material/Key';
import Loading from '../../Loading';
import Apis from '../../../Apis';
import Tooltip from '@mui/material/Tooltip';
import ExcluirUser from '../../exclusao/usuario/ExcluirUser';
import styles from './ListarUser.module.css';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { alertaErro } from '../../alertas/Alertas';
import SearchInput from '../../useDebounce/SearchInput';
import axios from 'axios';

export default function ListarUser() {
    const [linha, setLinha] = useState(10);
    const [loading, setLoading] = useState(false);
    const redirect = useNavigate();
    const [text, setText] = useState('');

    const handleChange = (event) => {
        setLinha(event.target.value);
    };
    const [usuarios, setUsuarios] = useState([]);
    useEffect(() => {
        const handleuser = async () => {
            setLoading(true);
            const requestOptions = {
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
            };

            await axios.post(Apis.urlListarUser, {}, requestOptions)
                .then((response) => {
                    if (response.status) {
                        if (response.data.registros.length < 1) {
                            setUsuarios([]);
                            setLoading(false)
                            return alertaErro(response.data.retorno[0].mensagem);
                        }
                        setUsuarios(response.data.registros)
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
        handleuser();
    }, []);
    const redirecionar = () => {
        redirect('/cadastrar-user')
    }
    return (
        <div className={styles.container}>
            <div style={{ display: "flex", alignItems: "center", borderStyle: 'solid', borderBottomWidth: 1, borderColor: '#174c4f', marginBottom: 10, color: '#174c4f' }}>
                LISTAGEM DE USUÁRIO
            </div>

            <div className={styles.topo_form}>
                <div>
                    <div className={styles.div_container_topo}>
                        <SearchInput value={text} onChange={(search) => setText(search)} />
                        <SearchIcon sx={{ fontSize: 20 }} />
                    </div>
                    <div className={styles.div_container_topo}>
                        <select className={styles.filtro}>
                            <option value="1">Mostrar inativos</option>
                            <option value="2">Ocultar inativos</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div className={styles.div_container_topo_add_contrato} onClick={redirecionar}>
                        <button>Adicionar Usuário</button>
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
                            {usuarios?.length} registro
                            {usuarios?.length == 1 ? '' : 's'} encontrado
                            {usuarios?.length == 1 ? '' : 's'}
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
                        <th className={styles.titulo}>Usuário</th>
                        <th className={styles.titulo}>Data de Cadastro</th>
                        <th className={styles.titulo}>Ações</th>
                    </tr>
                    {usuarios?.filter((usuario) => {
                        if (text === '') {
                            return usuario
                        }
                        if (text !== '' && usuario?.nome?.toLowerCase().includes(text.toLowerCase())) {
                            return usuario
                        }
                        if (text !== '' && usuario?.cpf?.includes(text)) {
                            return usuario
                        }
                        if (text !== '' && usuario?.email?.includes(text)) {
                            return usuario
                        }
                    }).map((usuario, index) => (
                        <tr className={styles.corpo_tabela} key={index} style={{
                            backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                        }}>
                            <td className={styles.id}>{usuario.id}</td>
                            <td className={styles.titulo}>
                                <p className={styles.nomeCliente}>{usuario.nome}</p>
                                <p className={styles.situacao}>Email: {usuario.email}</p>
                                <p className={styles.situacao}>CNPJ / CPF: {usuario.cpf}</p>
                            </td>
                            <td className={styles.titulo}>{usuario.updated_at}</td>
                            <td className={styles.opcoes}>
                                <ButtonGroup disableElevation variant="contained">
                                    <Tooltip title="Permissões">
                                        <Button size='small' style={{ borderColor: "white" }} color="success"><Link to={`/permissoes-user/${usuario?.id}&${usuario?.nome}`}><KeyIcon sx={{ fontSize: 20 }} /></Link></Button>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <Button size='small' style={{ borderColor: "white" }} color="error">
                                            <ExcluirUser id={usuario?.id} usuario={usuario?.nome} />
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