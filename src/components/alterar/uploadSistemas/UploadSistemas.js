import React, { useState } from 'react';
import styles from '../../estilos/forms/Forms.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useEffect } from 'react';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import Apis from '../../../Apis';
import axios from 'axios';
import Loading from '../../Loading';
export default function UploadSistemas() {
    const parametro = useParams();
    const [loading, setLoading] = useState(false);
    const [produtos, setProdutos] = useState([]);
    const [arquivo, setArquivo] = useState('');
    const [versao, setVersao] = useState('');
    const [sistemaId, setSistemaId] = useState('1');
    const [historico, setHistorico] = useState('');

    const handleArquivo = (e) => {
        setArquivo(e.target.files[0])
    }
    const handleVersao = (e) => {
        setVersao(e.target.value)
    }
    const handleSistemaId = (e) => {
        setSistemaId(e.target.value)
    }
    const handleHistorico = (e) => {
        setHistorico(e.target.value)
    }
    const redirect = useNavigate();

    const handleSubmit = async () => {
        if (arquivo && historico && versao && sistemaId) {
            setLoading(true)
            const data = new FormData();
            data.append("arquivo", arquivo);
            data.append("historico", historico)
            data.append("sistema_id", sistemaId)
            data.append("versao", versao)
            const config = {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `${localStorage.getItem('token')}` }
            }
            await axios.post(Apis.urlAtualizaSistema, data, config)
                .then((response) => {
                    setLoading(false);
                    alertaSucesso(response.data.retorno[0].mensagem);
                    redirect('/listar-sistemas')
                })
                .catch(erro => {
                    setLoading(false)
                    console.log(erro)
                    alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                    redirect('/')
                })
        } else {
            alertaErro("Todos os campos devem ser preenchidos!");
        }

    }

    useEffect(() => {
        // listar sistemas
        const handleprod = async () => {
            const config = {
                headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` }
            }
            await axios.post(Apis.urlListarProdutos, {}, config)
                .then((response) => {
                    console.log(response);
                    setProdutos(response.data.registros);
                })
                .catch((erro) => {
                    alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
                    redirect('/')
                    console.log(erro)
                })
        }
        handleprod();
    }, []);
    if (loading) {
        return (
            <div style={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loading texto='enviando dados, aguarde' />
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <div className={styles.form}>
                {/* id do sistema */}
                <h5 className={styles.titulo}>Upload de sistema</h5>
                <div className={styles.card_input}>
                    <h5>informações</h5>
                    <div className={styles.container_form}>
                        <label className={styles.label} style={{ width: '100%', cursor: 'pointer' }}>
                            <span style={{ backgroundColor: '#2a73d9', padding: 7, color: '#fff', borderRadius: '3px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10, columnGap: 5, width: '100%' }}>
                                <AiOutlineCloudUpload size='25' color='#fff' /><span>SELECIONAR ARQUIVO</span>
                            </span>
                            <span className={styles.file}>
                                <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{arquivo.name?.substring(arquivo.name?.indexOf(".") + 1)}</span>
                                <span>
                                    {arquivo.name?.length > 38 ?
                                        <>{arquivo.name?.substring(arquivo.name?.indexOf("h") + 2)?.substring(0, 38)}...</>
                                        :
                                        arquivo.name?.substring(arquivo.name?.indexOf("h") + 2)
                                    }
                                </span>
                                {!arquivo && <span>Nenhum arquivo seleionado</span>}
                            </span>
                            <input style={{ flexGrow: 1, height: '100px', display: 'none' }} name='arquivo' type="file" onChange={handleArquivo} />
                        </label>

                        <label className={styles.label}>
                            <span>Sistema</span>
                            <select onChange={handleSistemaId} value={sistemaId}>
                                {produtos?.map((item) => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                ))}
                            </select>
                        </label>

                        <label className={styles.label}>
                            <span>Versão</span>
                            <input onChange={handleVersao} value={versao} type="text" placeholder='Versão do sistema' />
                        </label>

                        <label className={styles.label} style={{ width: '100%' }}>
                            <span>Histórico</span>
                            <textarea onChange={handleHistorico} value={historico} style={{ height: 70 }} placeholder='Histórico'></textarea>
                        </label>

                    </div>
                </div>

                <div className={styles.container_button}>
                    <button onClick={() => redirect('/listar-sistemas')} className={styles.cancelar}>Cancelar</button>
                    <button onClick={handleSubmit} className={styles.submit}>Salvar</button>
                </div>
            </div>
        </div>
    );
}