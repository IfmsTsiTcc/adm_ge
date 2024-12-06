import React, { useEffect, useState } from 'react';
import styles from './Notificacoes.module.css';
import Apis from '../../../Apis';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import Drawer from 'react-modern-drawer';
import { VscChromeClose } from 'react-icons/vsc';
import { useLocation } from 'react-router-dom';
import { BsFillCircleFill } from 'react-icons/bs';
import swal from 'sweetalert';
export default function Notificacoes(props) {
    const [request, setRequest] = useState(false);
    const [pesquisar, setPesquisar] = useState('');
    const [notificacao, setNotificacao] = useState([]);
    const rotaAtual = useLocation();
    const handlePesquisar = (e) => {
        setPesquisar(e.target.value);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
            body: JSON.stringify({})
        };
        fetch(Apis.urlListarMensagens, requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                if (result.sucesso) {
                    setNotificacao(result.registros.reverse())
                } else {
                    setNotificacao([])
                }
            })
            .catch((erro) => {
                console.log(erro)
                alertaErro("Tente novamente ou entre em contato com o administrador")
            })
    }, [rotaAtual.pathname, request])

    const handleLer = (dados) => {
        if (dados.status == 0) {
            const token = localStorage.getItem('token');
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
                body: JSON.stringify({ "mensagem_id": dados.id })
            };
            fetch('https://gesuportelogico.com.br/admin/api/mensagens/aware', requestOptions)
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    if (result.sucesso) {
                        setRequest(!request);
                        props.setRequest(!props.request);
                    } else {
                        alertaErro(result.mensagem)
                    }
                })
                .catch((erro) => {
                    console.log(erro)
                    alertaErro("Tente novamente ou entre em contato com o administrador")
                })
        } else {
            swal(`Deseja excluir o aviso ${dados.id}?`, {
                buttons: {
                    Cancelar: {
                        text: "Cancelar",
                        value: "Cancelar",
                        dangerMode: true,
                    },
                    Confirmar: {
                        text: "Confirmar",
                        value: "Confirmar",
                        dangerMode: true,
                    },
                },
            })
                .then((value) => {
                    switch (value) {
                        case "Cancelar":
                            // alert('Cancelar')
                            break;
                        case "Confirmar":
                            const token = localStorage.getItem('token');
                            const requestOptions = {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
                                body: JSON.stringify({ "mensagem_id": dados.id })
                            };
                            fetch('https://gesuportelogico.com.br/admin/api/mensagens/takeout', requestOptions)
                                .then((response) => {
                                    return response.json()
                                })
                                .then((result) => {
                                    if (result.sucesso) {
                                        alertaSucesso(result.mensagem)
                                        setRequest(!request);
                                        props.setRequest(!props.request);
                                    } else {
                                        alertaErro(result.mensagem)
                                    }
                                })
                                .catch((erro) => {
                                    console.log(erro)
                                    alertaErro("Tente novamente ou entre em contato com o administrador")
                                })
                            break;
                    }
                });
        }
    }
    if (notificacao?.length > 0) {
        return (
            <div className={styles.modal}>
                <Drawer className={styles.container} duration={1000} open={props.open} onClose={props.onClick} direction='right' style={{ backgroundColor: 'transparent', boxShadow: 'none', width: '500px', display: 'flex', justifyContent: 'flex-end' }}>
                    <div className={styles.areaContainer}>
                        <div className={styles.topo}>
                            <h3 className={styles.titulo}>Avisos</h3>
                            <VscChromeClose color="#174c4f" size='25' onClick={props.onClick} />
                        </div>
                        <input type='text' placeholder='Pesquisar' onChange={handlePesquisar} value={pesquisar} className={styles.input} />
                        {notificacao?.filter((notificacao) => {
                            if (pesquisar === '') {
                                return notificacao
                            }
                            if (pesquisar !== '' && notificacao.nome_remetente?.toLowerCase().includes(pesquisar?.toLowerCase())) {
                                return notificacao
                            }
                            if (pesquisar !== '' && notificacao.mensagem?.toLowerCase().includes(pesquisar?.toLowerCase())) {
                                return notificacao
                            }
                        }).map((notificacao, index) => (
                            index <= 20 &&
                            <div key={index} className={styles.containerNotificacao} onClick={() => handleLer(notificacao)}>
                                <div className={styles.notificacao}>
                                    <span className={styles.remetente}><b>{notificacao.nome_remetente}</b></span>
                                    <span className={styles.mensagem} style={{ color: notificacao.status == 0 ? '#1877f2' : '#174c4f' }}>{notificacao.mensagem}</span>
                                </div>
                                {notificacao.status == 0 &&
                                    <div>
                                        <BsFillCircleFill color="#1877f2" size='15' onClick={props.onClick} />
                                    </div>
                                }
                            </div>

                        ))}
                    </div>
                </Drawer>
            </div>
        );
    } else {
        return (
            <div className={styles.modal}>
                <Drawer className={styles.container} duration={1000} open={props.open} onClose={props.onClick} direction='right' style={{ backgroundColor: 'transparent', boxShadow: 'none', width: '500px', display: 'flex', justifyContent: 'flex-end' }}>
                    <div className={styles.areaContainer}>
                        <div className={styles.topo}>
                            <h3 className={styles.titulo}>Avisos</h3>
                            <VscChromeClose color="#174c4f" size='25' onClick={props.onClick} />
                        </div>
                        <input type='text' placeholder='Pesquisar' onChange={handlePesquisar} value={pesquisar} className={styles.input} />
                        <div style={{ flex: 1, display: 'flex', height: '100%', justifyContent: 'center', flexDirection: 'column' }}>
                            <p style={{ color: '#174c4f' }}>nenhum aviso</p>
                        </div>
                    </div>
                </Drawer>
            </div>
        )
    }
}