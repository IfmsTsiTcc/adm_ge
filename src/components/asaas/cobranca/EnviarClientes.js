import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { useNavigate } from 'react-router-dom';
import ButtonGroup from '@mui/material/ButtonGroup';
import VpnKeyOffIcon from '@mui/icons-material/VpnKeyOff';
import { useState } from 'react';
import asaas from '../../../img/asaas.png';
import axios from 'axios';
import Apis from '../../../Apis';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function EnviarClientes(props) {
    const [open, setOpen] = useState(false);

    const redirect = useNavigate();
    const handleClose = () => {
        setOpen(!open)
    }


    const handleEnviar = () => {
        const requestOptions = {
            headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem('token') }
        }
        const data = { "cliente_id": props.cliente.clientes_id }
        axios.post(Apis.urlCadCobrancaAssas, data, requestOptions)
            .then((response) => {
                handleClose();
                console.log(response);
                if (response.status == 200) {
                    redirect(`/excluir-redirect/${"listar-clientes"}`);
                    return alertaSucesso(response.data.retorno[0].mensagem)
                }
                alertaErro(response.data.rejeitados[0].problema)
            })
            .catch((erro) => {
                handleClose();
                alertaErro(erro.response.data.rejeitados[0].problema)
                console.log(erro.response);
            })
    }

    return (
        <>
            <img onClick={handleClose} src={asaas} alt="Logo da Asaas" style={{ width: 25 }} />

            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" className='text-center' variant="h6" component="h2">
                        Deseja enviar cliente <b>{props.cliente.nome}</b>
                    </Typography>

                    <div className='text-center' style={{ marginTop: "20px" }}>
                        <ButtonGroup disableElevation variant="contained" className='w-full'>
                            <Button onClick={handleClose} color="error" className='w-full'><DoNotDisturbAltIcon style={{ marginRight: "5px" }} />Cancelar</Button>
                            <Button color="success" onClick={handleEnviar} className='w-full'><VpnKeyOffIcon style={{ marginRight: "5px" }} /> Confirmar</Button>
                        </ButtonGroup>
                    </div>
                </Box>
            </Modal>
        </>
    );
}
