import React, { useEffect, useState } from 'react';
import styles from './UsoSistemas.module.css';
import Loading from '../../Loading';
import Apis from '../../../Apis';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { alertaErro } from '../../alertas/Alertas';
import SearchInput from '../../useDebounce/SearchInput';
export default function UsoSistemas() {
    const [linha, setLinha] = useState(10);
    const [loading, setLoading] = useState(false);
    const [usoSistemas, setUsoSistemas] = useState([]);
    const redirect = useNavigate();
    const [text, setText] = useState('');

    const handleRegistros = (event) => {
        setLinha(event.target.value);
    };

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
            body: JSON.stringify("")
        };
        fetch(Apis.urlListarUsoSistemas, requestOptions)
            .then(response => response.json())
            .then((result) => {
                console.log(result)
                if (result.retorno[0].sucesso) {
                    setUsoSistemas(result.registros)
                } else {
                    if (result.retorno[0].mensagem == "Sem autorização!.") {
                        alertaErro(result.retorno[0].mensagem)
                        // localStorage.removeItem('token')
                        redirect('/')
                    } else {
                        alertaErro(result.retorno[0].mensagem)
                    }
                }
                setLoading(false)
            })
            .catch((erro) => {
                alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                redirect('/')
                console.log(erro)
            })
    }, [])
    return (
        <div className={styles.container}>
            <div style={{ display: "flex", alignItems: "center", borderStyle: 'solid', borderBottomWidth: 1, borderColor: '#174c4f', marginBottom: 10, color: '#174c4f' }}>
                LISTAGEM DE USO DO SISTEMA
            </div>

            <div className={styles.topo_form}>
                <div>
                    <div className={styles.div_container_topo}>
                        <SearchInput value={text} onChange={(search) => setText(search)} />
                        <SearchIcon sx={{ fontSize: 20 }} />
                    </div>
                </div>
                <div>
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
                            {usoSistemas?.length} registro
                            {usoSistemas?.length == 1 ? '' : 's'} encontrado
                            {usoSistemas?.length == 1 ? '' : 's'}
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
                        <th className={styles.titulo}>Cliente</th>
                        <th className={styles.titulo}>CDC</th>
                        <th className={styles.titulo}>Chave</th>
                        <th className={styles.titulo}>Local</th>
                        <th className={styles.titulo}>Data de Uso</th>
                        <th className={styles.titulo}>Data de Início</th>
                        <th className={styles.titulo}>Tipo</th>
                    </tr>
                    {usoSistemas?.filter((usoSistema) => {
                        if (text === '') {
                            return usoSistema
                        }
                        if (text !== '' && usoSistema.nome_empresa?.toLowerCase().includes(text.toLowerCase())) {
                            return usoSistema
                        }
                        if (text !== '' && usoSistema.municipio?.toLowerCase().includes(text.toLowerCase())) {
                            return usoSistema
                        }
                        if (text !== '' && usoSistema.sistema?.toLowerCase().includes(text.toLowerCase())) {
                            return usoSistema
                        }
                        if (text !== '' && usoSistema.cdc?.toLowerCase().includes(text.toLowerCase())) {
                            return usoSistema
                        }
                        if (text !== '' && usoSistema.nome_usuario?.toLowerCase().includes(text.toLowerCase())) {
                            return usoSistema
                        }
                        if (text !== '' && usoSistema.cnpj_usuario?.includes(text)) {
                            return usoSistema
                        }
                    }).map((usoSistema, index) => (
                        index < linha && //definir a quantidade de registros mostrados
                        <tr className={styles.corpo_tabela} key={index} style={{
                            backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff'
                        }}>
                            <td className={styles.id}>{usoSistema.id}</td>
                            <td className={styles.titulo}>
                                <p className={styles.nomeCliente}>Empresa: {usoSistema.nome_empresa} - {usoSistema.cnpj_empresa}</p>
                                <p className={styles.situacao}>Usuário: {usoSistema.nome_usuario} - {usoSistema.cnpj_usuario}</p>
                                <p className={styles.situacao}>{usoSistema.sistema} - v{usoSistema.versao}</p>
                                <p className={styles.situacao}>{usoSistema.serie_dispositivo}</p>
                            </td>
                            <td className={styles.titulo}>{usoSistema.cdc}</td>
                            <td className={styles.titulo}>{usoSistema.chave}</td>
                            <td className={styles.titulo}>{usoSistema.municipio} - {usoSistema.uf}</td>
                            <td className={styles.titulo}>{usoSistema.data}</td>
                            <td className={styles.titulo}>{usoSistema.created_at}</td>
                            <td className={styles.titulo}>{usoSistema.tipo_computador}</td>
                        </tr>

                    ))}
                </table>
            }
        </div>
    );
}