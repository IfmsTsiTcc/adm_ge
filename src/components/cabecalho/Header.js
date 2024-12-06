import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineLogout } from "react-icons/ai";
import { IoMdOptions } from 'react-icons/io'
import { CgProfile } from 'react-icons/cg'
import Drawer from 'react-modern-drawer';
import { useLocation, useNavigate } from "react-router-dom";
import { DrawerCuston } from "../menuLateral/DrawerCuston";
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Apis from "../../Apis";
import { alertaErro } from "../alertas/Alertas";
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import Notificacoes from "../listar/notificacoes/Notificacoes";
export default function Header(props) {
    const navigate = useNavigate();
    const rotaAtual = useLocation();
    const [isOpen, setIsOpen] = useState(false)
    const [openClosePerfil, setOpenClosePerfil] = useState(false);
    const [OpenNotificacoes, setOpenNotificacoes] = useState(false);
    const [request, setRequest] = useState(false);
    const [mensagens, setMensagens] = useState([]);

    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }
    const toggleDrawerPerfil = () => {
        setOpenClosePerfil((prevState) => !prevState)
    }
    const toggleDrawerNotificaoes = () => {
        setOpenClosePerfil(false)
        setOpenNotificacoes((prevState) => !prevState)
    }
    const handleSair = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('nome');
        localStorage.removeItem('pagina');
        localStorage.removeItem('contratoPdf');
        localStorage.removeItem('usuario_id');
        // props.setToken(localStorage.getItem('token'))
        navigate('/login');
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
                setMensagens(result.registros)
                // if (result.retorno[0].sucesso) {
                //     setPermissoes(result.registros)
                // } else {
                //     alertaErro(result.retorno[0].mensagem)
                // }
            })
            .catch((erro) => {
                console.log(erro)
                alertaErro("Tente novamente ou entre em contato com o administrador")
            })
    }, [rotaAtual.pathname, request])

    return (
        <>
            <div style={{ backgroundColor: '#174c4f', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                    <AiOutlineMenu color="white" size='30' onClick={toggleDrawer} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: 8 }}>
                    {/* <Link to='/listar-avisos'> */}
                        <Badge badgeContent={mensagens?.filter((dados) => dados.status == 0).length} color="error" anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
                            <NotificationsIcon onClick={toggleDrawerNotificaoes} style={{ color: 'white', fontSize: 30, cursor: 'pointer' }} />
                        </Badge>
                    {/* </Link> */}

                    <Badge badgeContent={5} color="error" anchorOrigin={{ horizontal: 'right', vertical: 'top' }} style={{ marginLeft: 25, cursor: 'pointer' }}>
                        <MailIcon style={{ color: 'white', fontSize: 30 }} />
                    </Badge>

                    <AccountCircleIcon onClick={toggleDrawerPerfil} style={{ color: 'white', fontSize: 30, cursor: 'pointer', marginLeft: 25 }} />
                    {/* <RiGroup2Fill color="#fff" size='45' onClick={toggleDrawerPerfil} style={{ cursor: 'pointer' }} /> */}
                </div>
                {/* <img onClick={toggleDrawerPerfil} src={perfil} alt="Logo da GE Sistemas" style={{ width: 50, cursor: 'pointer' }} /> */}
            </div>
            <Drawer duration={1000} open={openClosePerfil} onClose={toggleDrawerPerfil} direction='right' style={{ backgroundColor: 'transparent', padding: 10, boxShadow: 'none' }}>
                <div style={{ backgroundColor: '#fff', top: 10, right: 10, width: '100%', zIndex: 2, borderRadius: 5, transition: 'ease-out', padding: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, color: '#174c4f', cursor: 'pointer' }}>
                        <span>Perfil</span>
                        <CgProfile color="#174c4f" size='20' style={{ marginLeft: 30 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, color: '#174c4f', cursor: 'pointer' }}>
                        <span>Mensagens</span>
                        {/* <FaRegComments color="#174c4f" size='20' style={{ marginLeft: 30 }} /> */}
                        <Badge badgeContent={5} color="error" anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
                            <MailIcon style={{ color: '#174c4f', fontSize: 20, cursor: 'pointer' }} />
                        </Badge>
                    </div>
                    <div onClick={toggleDrawerNotificaoes} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, color: '#174c4f', cursor: 'pointer' }}>
                        <span>Avisos</span>
                        {/* <IoMdNotificationsOutline color="#174c4f" size='20' style={{ marginLeft: 30 }} /> */}
                        <Badge badgeContent={mensagens?.filter((dados) => dados.status == 0).length} color="error" anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
                            <NotificationsIcon style={{ color: '#174c4f', fontSize: 20, cursor: 'pointer' }} />
                        </Badge>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, color: '#174c4f', cursor: 'pointer' }}>
                        <span>Configurações</span>
                        <IoMdOptions color="#174c4f" size='20' style={{ marginLeft: 30 }} />
                    </div>
                    <div onClick={handleSair} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, color: '#174c4f', cursor: 'pointer' }}>
                        <span>Sair</span>
                        <AiOutlineLogout color="#174c4f" size='20' style={{ marginLeft: 30 }} />
                    </div>
                </div>
            </Drawer>

            <Notificacoes open={OpenNotificacoes} onClick={toggleDrawerNotificaoes} setRequest={setRequest} request={request}/>
            <DrawerCuston isOpen={isOpen} toggleDrawer={toggleDrawer} />
        </>
    )
}