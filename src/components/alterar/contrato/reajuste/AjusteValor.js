import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import Apis from '../../../../Apis.js'
import { useNavigate } from 'react-router-dom';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import VpnKeyOffIcon from '@mui/icons-material/VpnKeyOff';
import MenuItem from '@mui/material/MenuItem';
import { alertaErro, alertaSucesso } from '../../../alertas/Alertas';
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

export default function AjusteValor(props) {
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState(props.dados[0].ultimo_reajuste?.motivo);
  const [valor, setValor] = useState(props.dados[0].ultimo_reajuste?.valor);
  const [permissoes, setPermissoes] = useState([]);
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const [dataAtual, setDataAtual] = useState(props.dados[0].ultimo_reajuste?.data);

  const handleDataAtual = (e) => {
    setDataAtual(e.target.value);
  }

  const handleValor = (e) => {
    setValor(e.target.value);
  }

  const handleMotivo = (e) => {
    setMotivo(e.target.value);
  }
  const dados = { "contrato_id": props.dados[0].id, "valor": valor, "data": dataAtual, "motivo": motivo, "valor_id": "0" };
  console.log(dados);
  const redirect = useNavigate();
  const handleClose = () => {
    setOpen(!open)
  }

  useEffect(() => {
    console.log(props.dados);
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

  const handleAjustar = () => {
    if (permissoes[0]?.contratos.alterar == 0) {
      if (valor !== '' && motivo !== "") {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
          body: JSON.stringify(dados)
        };
        const url = Apis.urlAjusteValorContrato;
        fetch(url, requestOptions)
          .then((response) => {
            return response.json()
          })
          .then((result) => {
            if (result.retorno[0].sucesso) {
              alertaSucesso(result.retorno[0].mensagem);
              redirect(`/alterar-contrato/${props.dados[0].id}`)
              setOpen(false);
              props.setReloadContrato(!props.reloadContrato)
            } else {
              alertaErro(result.retorno[0].mensagem);
            }
          })
          .catch(erro => console.log(erro))

      }
      else if (valor === "" || motivo === "") {
        alertaErro("Preencha todos os campos")
      }
    } else {
      alertaErro("Você não possui permissão para alterar um contrato!")
      redirect(`/excluir-redirect/${"listar-contratos"}`)
    }
  }
  return (
    <>
      <input onClick={handleClose} type="button" placeholder=" " value='Reajuste de Valor' style={{ backgroundColor: 'green', color: '#fff' }} />

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" className='text-center' variant="h6" component="h2">
            Ajuste de Valor
          </Typography>

          <TextField className="w-full mt-4" required value={valor} onChange={handleValor} label="Valor" input />
          <TextField className="w-full mt-4" required type='date' value={dataAtual} onChange={handleDataAtual} min={props.dados[0].ultimo_reajuste?.data} label="Data da alteração" input />
          <TextField className="w-full mt-4" required label="Motivo da alteração" value={motivo} onChange={handleMotivo} input />

          <div className='text-center' style={{ marginTop: "20px" }}>
            <ButtonGroup disableElevation variant="contained" className='w-full'>
              <Button onClick={handleClose} color="error" className='w-full'><DoNotDisturbAltIcon style={{ marginRight: "5px" }} />Cancelar</Button>
              <Button color="success" onClick={handleAjustar} className='w-full'><VpnKeyOffIcon style={{ marginRight: "5px" }} /> Confirmar</Button>
            </ButtonGroup>
          </div>
        </Box>
      </Modal>
    </>
  );
}
