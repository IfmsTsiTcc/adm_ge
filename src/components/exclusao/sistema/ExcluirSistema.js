import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import Apis from '../../../Apis';
import { useNavigate } from 'react-router-dom';
import ButtonGroup from '@mui/material/ButtonGroup';
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

export default function ExcluirSistema(props) {
  const [open, setOpen] = useState(false);
  const redirect = useNavigate();
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

  const handleClose = () => {
    setOpen(!open)
  }
  const handleDelete = () => {
    if (permissoes[0]?.produtos.excluir == 0) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
        body: JSON.stringify({ 'id': props.id })
      };
      fetch(`${Apis.urlDeleteProduto}`, requestOptions)
        .then(response => response.json())
        .then((result) => {
          if (result.retorno[0].sucesso) {
            setOpen(false)
            alertaSucesso(result.retorno[0].mensagem);
            redirect(`/excluir-redirect/${"listar-sistemas"}`)
          } else {
            setOpen(false)
            alertaErro(result.retorno[0].mensagem);
          }
        })
        .catch((erro) => {
          alertaErro("Falha na requisição, verifique sua conexão e tente novamente!");
          redirect('/')
          console.log(erro)
        })
    } else {
      setOpen(false)
      alertaErro("Você não possui permissão para excluir um sistema!")
    }
  }
  return (
    <>
      <DeleteIcon onClick={handleClose} sx={{ fontSize: 20 }} />
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center'>
            Exclusão de Sistema
          </Typography>
          <Typography id="modal-modal-description" className='text-center mt-2'>
            Deseja Realmente excluir o sistema <strong style={{ textTransform: "uppercase" }}>{props.sistema}</strong>, versão: <strong>{props.versao}?</strong>
          </Typography>
          <div className='text-center mt-4'>
            <ButtonGroup disableElevation variant="contained" className='w-full'>
              <Button onClick={handleClose} color="success" className='w-full'><DoNotDisturbAltIcon style={{ marginRight: "5px" }} />Cancelar</Button>
              <Button color="error" onClick={handleDelete} className='w-full'><DeleteIcon style={{ marginRight: "5px" }}></DeleteIcon> Confirmar</Button>
            </ButtonGroup>
          </div>
        </Box>
      </Modal>
    </>
  );
}
