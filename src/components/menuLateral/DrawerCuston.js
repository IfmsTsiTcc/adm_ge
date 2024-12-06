import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { VscChromeClose } from 'react-icons/vsc';
import styles from './MenuLateral.module.css';
import SpeedIcon from '@mui/icons-material/Speed';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import Drawer from 'react-modern-drawer';
import { useEffect } from 'react';
import { alertaErro } from '../alertas/Alertas';
import Apis from '../../Apis';

export function DrawerCuston(props) {
    const redirect = useNavigate();
    const [openOpcao, setOpenOpcao] = useState('');
    const [permissoes, setPermissoes] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const idUser = localStorage.getItem('usuario_id');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
            body: JSON.stringify({ "usuario_id": idUser })
        };
        fetch(Apis.urlPermissoes, requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                console.log(result)
                if (result.retorno[0].sucesso) {
                    setPermissoes(result.registros)
                } else {
                    alertaErro(result.retorno[0].mensagem)
                }
            })
            .catch((erro) => {
                console.log(erro)
                alertaErro("Tente novamente ou entre em contato com o administrador")
            })
    }, [])

    const handleOpcao = (opcao) => {
        if (opcao == openOpcao) {
            setOpenOpcao('');
        } else {
            setOpenOpcao(opcao);
        }
    }

    const handleRediretRota = (rota) => {
        setOpenOpcao('');
        props.toggleDrawer();
        redirect(`/${rota}`);
    }

    const redirecionarContabilista = () => {
        window.location.href = 'http://gesistemas.com/contador/contador/cadastro_contador.php';
    }
    return (
        <Drawer size={300} duration={1000} open={props.isOpen} onClose={props.toggleDrawer} direction='left' style={{ backgroundColor: '#174c4f', overflowY: '-moz-hidden-unscrollable', boxShadow: 'none', overflowX: 'hidden', padding: 5, borderStyle: 'none' }}>
            <List sx={{ width: '100%', bgcolor: '#174c4f' }} component="nav" aria-labelledby="nested-list-subheader">
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'flex-end', padding: 10 }}>
                    <VscChromeClose color="white" size='30' onClick={props.toggleDrawer} />
                </div>
                <ListItemButton onClick={() => handleRediretRota("")} style={{ color: 'white' }} data-bs-dismiss="offcanvas" aria-label="Close">
                    <ListItemIcon>
                        <SpeedIcon className={styles.menuSvg} />
                    </ListItemIcon>
                    <ListItemText primary="Painel" />
                </ListItemButton>

                {/* listagem */}
                <ListItemButton style={{ color: 'white' }} onClick={() => handleOpcao('listagem')}>
                    <ListItemIcon>
                        <AddToPhotosIcon className={styles.menuSvg} />
                    </ListItemIcon>
                    <ListItemText style={{ color: 'white' }} primary="Listagem" />
                    {openOpcao == 'listagem' ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openOpcao == 'listagem'} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {permissoes[0]?.clientes.visualizar == 0 &&
                            <ListItemButton onClick={() => handleRediretRota("listar-clientes")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                <ListItemIcon>
                                    <ChevronRightIcon className={styles.menuSvg} />
                                </ListItemIcon>
                                <ListItemText primary="Clientes" />
                            </ListItemButton>
                        }
                        {permissoes[0]?.colaboradores.visualizar == 0 &&
                            <ListItemButton onClick={() => handleRediretRota("listar-user")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                <ListItemIcon>
                                    <ChevronRightIcon className={styles.menuSvg} />
                                </ListItemIcon>
                                <ListItemText primary="Usuário" />
                            </ListItemButton>
                        }
                        {permissoes[0]?.produtos.visualizar == 0 &&
                            <ListItemButton onClick={() => handleRediretRota("listar-sistemas")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                <ListItemIcon>
                                    <ChevronRightIcon className={styles.menuSvg} />
                                </ListItemIcon>
                                <ListItemText primary="Sistemas" />
                            </ListItemButton>
                        }
                        {permissoes[0]?.representantes.visualizar == 0 &&
                            <ListItemButton onClick={() => handleRediretRota("listar-representantes")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                <ListItemIcon>
                                    <ChevronRightIcon className={styles.menuSvg} />
                                </ListItemIcon>
                                <ListItemText primary="Representantes" />
                            </ListItemButton>
                        }
                        {permissoes[0]?.colaboradores.visualizar == 0 &&
                            <ListItemButton onClick={() => handleRediretRota("listar-colaboradores")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                <ListItemIcon>
                                    <ChevronRightIcon className={styles.menuSvg} />
                                </ListItemIcon>
                                <ListItemText primary="Colaboradores" />
                            </ListItemButton>
                        }
                        <ListItemButton style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close" onClick={redirecionarContabilista}>
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText style={{ color: 'white' }} primary="Contabilistas" />
                        </ListItemButton>
                        <ListItemButton onClick={() => handleRediretRota("listar-clientes-potencial")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Clientes em Potencial" />
                        </ListItemButton>
                    </List>
                </Collapse>
                {/* fim listagem */}

                {/* ponto */}
                <ListItemButton style={{ color: 'white' }} onClick={() => handleOpcao('colaboradores')}>
                    <ListItemIcon>
                        <PeopleAltIcon className={styles.menuSvg} />
                    </ListItemIcon>
                    <ListItemText style={{ color: 'white' }} primary="Colaboradores" />
                    {openOpcao == 'colaboradores' ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openOpcao == 'colaboradores'} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton onClick={() => handleRediretRota("listar-colaboradores-pronto")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Ponto" />
                        </ListItemButton>
                    </List>
                </Collapse>
                {/* fim ponto */}

                {/* financeiro */}
                <ListItemButton style={{ color: 'white' }} onClick={() => handleOpcao('financeiro')}>
                    <ListItemIcon>
                        <MonetizationOnIcon className={styles.menuSvg} />
                    </ListItemIcon>
                    <ListItemText style={{ color: 'white' }} primary="Financeiro" />
                    {openOpcao == 'financeiro' ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openOpcao == 'financeiro'} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {permissoes[0]?.contratos.visualizar == 0 &&
                            <ListItemButton onClick={() => handleRediretRota("listar-contratos")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                <ListItemIcon>
                                    <ChevronRightIcon className={styles.menuSvg} />
                                </ListItemIcon>
                                <ListItemText primary="Contrato" />
                            </ListItemButton>
                        }
                        {permissoes[0]?.contratos.visualizar == 0 &&
                            <ListItemButton onClick={() => handleRediretRota("listar-contas")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                <ListItemIcon>
                                    <ChevronRightIcon className={styles.menuSvg} />
                                </ListItemIcon>
                                <ListItemText primary="Bancos / Contas" />
                            </ListItemButton>
                        }
                        {permissoes[0]?.contratos.visualizar == 0 &&
                            <ListItemButton onClick={() => handleRediretRota("listar-mensalidades")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                <ListItemIcon>
                                    <ChevronRightIcon className={styles.menuSvg} />
                                </ListItemIcon>
                                <ListItemText primary="Mensalidade" />
                            </ListItemButton>
                        }

                        {permissoes[0]?.contratos.visualizar == 0 &&
                            <ListItemButton onClick={() => handleRediretRota("listar-reajuste")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                <ListItemIcon>
                                    <ChevronRightIcon className={styles.menuSvg} />
                                </ListItemIcon>
                                <ListItemText primary="Reajuste" />
                            </ListItemButton>
                        }
                        {permissoes[0]?.contratos.incluir == 0 &&
                            <ListItemButton onClick={() => handleRediretRota("listar-contas-receber")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                <ListItemIcon>
                                    <ChevronRightIcon className={styles.menuSvg} />
                                </ListItemIcon>
                                <ListItemText primary="Contas a receber" />
                            </ListItemButton>
                        }
                        <ListItemButton onClick={() => handleRediretRota("boletos")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Boletos" />
                        </ListItemButton>
                        <ListItemButton onClick={() => handleRediretRota("listar-natureza")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Natureza" />
                        </ListItemButton>
                    </List>
                </Collapse>
                {/* fim financeiro */}

                {/* suporte */}
                <ListItemButton style={{ color: 'white' }} onClick={() => handleOpcao('suporte')}>
                    <ListItemIcon>
                        <HeadsetMicIcon className={styles.menuSvg} />
                    </ListItemIcon>
                    <ListItemText style={{ color: 'white' }} primary="Suporte" />
                    {openOpcao == 'suporte' ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openOpcao == 'suporte'} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton onClick={() => handleRediretRota("utilizacao-sistemas")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Utilização de Sistemas" />
                        </ListItemButton>
                        <ListItemButton onClick={() => handleRediretRota("upload-sistemas")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Upload de Sistemas" />
                        </ListItemButton>
                        <ListItemButton onClick={() => handleRediretRota("documentos-fiscais-clientes")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Documentos Fiscais do Clientes" />
                        </ListItemButton>
                        <ListItemButton onClick={() => handleRediretRota("mensagens")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Enviar Mensagem" />
                        </ListItemButton>
                        <ListItemButton onClick={() => handleRediretRota("tarefas")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Cadastrar Tarefa" />
                        </ListItemButton>
                        <ListItemButton onClick={() => handleRediretRota("ticket")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Abrir um Ticket" />
                        </ListItemButton>
                    </List>
                </Collapse>
                {/* fim suporte */}

                {/* crm */}
                <ListItemButton style={{ color: 'white' }} onClick={() => handleOpcao('crm')}>
                    <ListItemIcon>
                        <HomeRepairServiceIcon className={styles.menuSvg} />
                    </ListItemIcon>
                    <ListItemText style={{ color: 'white' }} primary="Crm" />
                    {openOpcao == 'crm' ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openOpcao == 'crm'} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton onClick={() => handleRediretRota("orcamentos")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Orçamentos" />
                        </ListItemButton>
                        <ListItemButton onClick={() => handleRediretRota("propostas")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Propostas" />
                        </ListItemButton>
                        <ListItemButton onClick={() => handleRediretRota("listar-leads")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Leads" />
                        </ListItemButton>
                    </List>
                </Collapse>
                {/* fim crm */}

                {/* drive */}
                <ListItemButton style={{ color: 'white' }} onClick={() => handleOpcao('driver')}>
                    <ListItemIcon>
                        <AddToDriveIcon className={styles.menuSvg} />
                    </ListItemIcon>
                    <ListItemText style={{ color: 'white' }} primary="Driver" />
                    {openOpcao == 'driver' ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openOpcao == 'driver'} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton onClick={() => handleRediretRota("atualizacao-sistemas")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Atualização de Sistemas" />
                        </ListItemButton>
                        <ListItemButton onClick={() => handleRediretRota("dados-clientes")} style={{ color: 'white' }} sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                            <ListItemIcon>
                                <ChevronRightIcon className={styles.menuSvg} />
                            </ListItemIcon>
                            <ListItemText primary="Dados de Clientes" />
                        </ListItemButton>
                    </List>
                </Collapse>
                {/* fim drive */}
            </List>
        </Drawer>
    )
}