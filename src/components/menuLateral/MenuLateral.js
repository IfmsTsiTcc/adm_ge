import MenuIcon from '@mui/icons-material/Menu';
import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import styles from './MenuLateral.module.css';
import SpeedIcon from '@mui/icons-material/Speed';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import logo from '../../img/logo.png'
import { Link } from 'react-router-dom';

export default function MenuLateral(){
    const [openCadastro, setOpenCadastro] = React.useState(false);
    const [openColaboradores, setOpenColaboradores] = React.useState(false);
    const [openFinanceiro, setOpenFinanceiro] = React.useState(false);
    const [openSuporte, setOpenSuporte] = React.useState(false);
    const [openCrm, setOpenCrm] = React.useState(false);
    const [openDriver, setOpenDriver] = React.useState(false);
    const cadastro = () => {
        setOpenCadastro(!openCadastro);
        setOpenColaboradores(false);
        setOpenFinanceiro(false);
        setOpenSuporte(false);
        setOpenCrm(false);
        setOpenDriver(false);
    };
    const colaboradores = () => {
        setOpenColaboradores(!openColaboradores);
        setOpenCadastro(false);
        setOpenFinanceiro(false);
        setOpenSuporte(false);
        setOpenCrm(false);
        setOpenDriver(false);
    };
    const financeiro = () => {
        setOpenFinanceiro(!openFinanceiro);
        setOpenCadastro(false);
        setOpenColaboradores(false);
        setOpenSuporte(false);
        setOpenCrm(false);
    };
    const suporte = () => {
        setOpenSuporte(!openSuporte);
        setOpenCadastro(false);
        setOpenColaboradores(false);
        setOpenFinanceiro(false);
        setOpenCrm(false);
        setOpenDriver(false);
    };
    const crm = () => {
        setOpenCrm(!openCrm);
        setOpenCadastro(false);
        setOpenColaboradores(false);
        setOpenFinanceiro(false);
        setOpenSuporte(false);
        setOpenDriver(false);
    };
    const driver = () => {
        setOpenDriver(!openDriver);
        setOpenCadastro(false);
        setOpenColaboradores(false);
        setOpenFinanceiro(false);
        setOpenSuporte(false);
        setOpenCrm(false);
    };
    const redirecionarContabilista = () => {
        window.location.href = 'http://gesistemas.com/contador/contador/cadastro_contador.php';
    }
    return(
        <div>
            <MenuIcon style={{color: "white"}} data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling"/>
            <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel"  style={{backgroundColor: "#174c4f"}}>
            <div className="offcanvas-header">
                {/* <h5 className="offcanvas-title" id="offcanvasScrollingLabel" style={{textTransform: 'capitalize'}}>{localStorage.getItem('nome').toLowerCase()}</h5> */}
                <h5></h5>
                <CloseIcon data-bs-dismiss="offcanvas" aria-label="Close"></CloseIcon>
            </div>
                <div className={styles.menuLateralContainerFilho}>
                    <List
                    sx={{ width: '100%', bgcolor: '#174c4f' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    >
                        <div>
                            <img src={logo} alt="Logo da GE Sistemas" width="180"/>
                        </div>
                            <Link to="painel">
                                <ListItemButton data-bs-dismiss="offcanvas" aria-label="Close">
                                    <ListItemIcon>
                                    <SpeedIcon className={styles.menuSvg}/>
                                    </ListItemIcon>
                                    <ListItemText primary="Painel" />
                                </ListItemButton>
                            </Link>
                            <ListItemButton onClick={cadastro}>
                                    <ListItemIcon>
                                        <AddToPhotosIcon className={styles.menuSvg}/>
                                    </ListItemIcon>
                                    <ListItemText primary="Cadastro" />
                                    {openCadastro ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openCadastro} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <Link to="listar-user">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                                <ChevronRightIcon className={styles.menuSvg}/>
                                            </ListItemIcon>
                                            <ListItemText primary="Usuário" />
                                        </ListItemButton>
                                    </Link>
                                    <Link to="listar-sistemas">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                                <ChevronRightIcon className={styles.menuSvg}/>
                                            </ListItemIcon>
                                            <ListItemText primary="Sistemas" />
                                        </ListItemButton>
                                    </Link>
                                    <Link to="/listar-representantes">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Representantes" />
                                        </ListItemButton>
                                    </Link>
                                    <Link to="listar-clientes">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Clientes" />
                                        </ListItemButton>
                                    </Link>
                                    <Link to="listar-colaboradores">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Colaboradores" />
                                        </ListItemButton>
                                    </Link>
                                    <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close" onClick={redirecionarContabilista}>
                                        <ListItemIcon>
                                        <ChevronRightIcon className={styles.menuSvg} />
                                        </ListItemIcon>
                                        <ListItemText primary="Contabilistas" />
                                    </ListItemButton>
                                    <Link to="listar-clientes-potencial">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Clientes em Potencial" />
                                        </ListItemButton>
                                    </Link>
                                </List>
                            </Collapse>

                            <ListItemButton onClick={colaboradores}>
                                <ListItemIcon>
                                    <PeopleAltIcon className={styles.menuSvg}/>
                                </ListItemIcon>
                                <ListItemText primary="Colaboradores" />
                                {openColaboradores ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openColaboradores} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <Link to="listar-colaboradores-pronto">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Ponto" />
                                        </ListItemButton>
                                    </Link>
                                </List>
                            </Collapse>

                            <ListItemButton onClick={financeiro}>
                                    <ListItemIcon>
                                        <MonetizationOnIcon className={styles.menuSvg}/>
                                    </ListItemIcon>
                                    <ListItemText primary="Financeiro" />
                                    {openFinanceiro ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openFinanceiro} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <Link to="listar-contratos">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Contrato" />
                                        </ListItemButton>
                                    </Link>
                                    <Link to="boletos">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Boletos" />
                                        </ListItemButton>
                                    </Link>
                                    {/* <Link to="situacao-contrato">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Situação de Contrato" />
                                        </ListItemButton>
                                    </Link> */}
                                </List>
                            </Collapse>

                            <ListItemButton onClick={suporte}>
                                <ListItemIcon>
                                    <HeadsetMicIcon className={styles.menuSvg}/>
                                </ListItemIcon>
                                <ListItemText primary="Suporte" />
                                {openSuporte ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openSuporte} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <Link to="utilizacao-sistemas">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                                <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Utilização de Sistemas" />
                                        </ListItemButton>
                                    </Link>
                                    <Link to="documentos-fiscais-clientes">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                                <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Documentos Fiscais do Clientes" />
                                        </ListItemButton>
                                    </Link>
                                    <Link to="mensagens">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                                <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Enviar Mensagem" />
                                        </ListItemButton>
                                    </Link>
                                    <Link to="tarefas">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                                <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Cadastrar Tarefa" />
                                        </ListItemButton>
                                    </Link>
                                    <Link to="ticket">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                                <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Abrir um Ticket" />
                                        </ListItemButton>
                                    </Link>
                                </List>
                            </Collapse>
                            <ListItemButton onClick={crm}>
                                <ListItemIcon>
                                    <HomeRepairServiceIcon className={styles.menuSvg}/>
                                </ListItemIcon>
                                <ListItemText primary="Crm" />
                                {openCrm ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openCrm} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <Link to="orcamentos">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Orçamentos" />
                                        </ListItemButton>
                                    </Link>
                                    <Link to="propostas">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Propostas" />
                                        </ListItemButton>
                                    </Link>
                                </List>
                            </Collapse>
                            <ListItemButton onClick={driver}>
                                    <ListItemIcon>
                                        <AddToDriveIcon className={styles.menuSvg}/>
                                    </ListItemIcon>
                                    <ListItemText primary="Driver" />
                                    {openDriver ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openDriver} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <Link to="atualizacao-sistemas">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Atualização de Sistemas" />
                                        </ListItemButton>
                                    </Link>
                                    <Link to="dados-clientes">
                                        <ListItemButton sx={{ pl: 4 }} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <ListItemIcon>
                                            <ChevronRightIcon className={styles.menuSvg} />
                                            </ListItemIcon>
                                            <ListItemText primary="Dados de Clientes" />
                                        </ListItemButton>
                                    </Link>
                                </List>
                            </Collapse>
                    </List>
                </div>
            </div>
        </div>
    )
}