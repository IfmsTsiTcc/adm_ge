import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import Apis from '../../../Apis';
import { useNavigate } from 'react-router-dom';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import VpnKeyOffIcon from '@mui/icons-material/VpnKeyOff';
import MenuItem from '@mui/material/MenuItem';
import { alertaErro, alertaSucesso } from '../../alertas/Alertas';
import { useState } from 'react';

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

export default function BlockSistema(props) {
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [situacao, setSituacao] = useState('');
  const [permissoes, setPermissoes] = useState([]);
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const dataAtual = ano + '-' + mes + '-' + dia;

  const handleMotivo = (e) => {
    setMotivo(e.target.value);
  }

  const handleSituacao = (event) => {
    setSituacao(event.target.value);
  };
  const dados = { "data": dataAtual, "contrato_id": props.id, "motivo": motivo, "cod_bloqueio": situacao, "sistema_id": props.idSistema }

  const redirect = useNavigate();
  const handleClose = () => {
    setOpen(!open)
  }

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
        if (result.retorno[0].sucesso) {
          setPermissoes(result.registros)
        } else {
          alertaErro(result.retorno[0].mensagem)
        }
      })
      .catch((erro) => {
        alertaErro("Tente novamente ou entre em contato com o administrador")
      })
  }, [])

  const handleBloqueio = () => {
    if (permissoes[0]?.contratos.alterar == 0) {
      if (situacao !== '' && motivo !== "") {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
          body: JSON.stringify(dados)
        };

        const url = Apis.urlBloquearContrato;
        fetch(url, requestOptions)
          .then((response) => {
            return response.json()
          })
          .then((result) => {
            if (result.retorno[0].sucesso) {
              alertaSucesso(result.retorno[0].mensagem);
              redirect(`/excluir-redirect/${"listar-contratos"}`)
            } else {
              alertaErro(result.retorno[0].mensagem);
            }
          })
          .catch(erro => console.log(erro))

      }
      else if (situacao === "" || motivo === "") {
        alertaErro("Preencha todos os campos")
      }
    }else {
      alertaErro("Você não possui permissão para alterar um contrato!")
      redirect(`/excluir-redirect/${"listar-contratos"}`)
    }
  }
  return (
    <>
      <VpnKeyOffIcon onClick={handleClose} sx={{ fontSize: 20 }} />
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" className='text-center' variant="h6" component="h2">
            Situção do Sistema
          </Typography>
          <Typography id="modal-modal-description" className='text-center' sx={{ mt: 2 }}>
            Deseja alterar a situação do sistema <strong style={{ textTransform: "uppercase" }}>{props.cliente}?</strong>
          </Typography>

          <TextField className='w-full mt-4' value={situacao} onChange={handleSituacao} id="outlined-select-currency" label="Situação" select>
            <MenuItem value={0}>Liberar</MenuItem>
            <MenuItem value={1}>Bloquear</MenuItem>
          </TextField>

          <TextField className="w-full mt-4" required value={motivo} onChange={handleMotivo} label="Motivo da alteração" input />

          <div className='text-center' style={{ marginTop: "20px" }}>
            <ButtonGroup disableElevation variant="contained" className='w-full'>
              <Button onClick={handleClose} color="success" className='w-full'><DoNotDisturbAltIcon style={{ marginRight: "5px" }} />Cancelar</Button>
              <Button color="error" onClick={handleBloqueio} className='w-full'><VpnKeyOffIcon style={{ marginRight: "5px" }} /> Confirmar</Button>
            </ButtonGroup>
          </div>
        </Box>
      </Modal>
    </>
  );
}
