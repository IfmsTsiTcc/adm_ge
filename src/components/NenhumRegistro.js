import React, { forwardRef, useState } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const NenhumaRegistro = (props) => {
    const redirect = useNavigate();
    const redirecionar = () => {
        redirect(`${props.onclick}`)
    }

    //   modal sem permissão ou registros
    const [openModal, setOpenModal] = useState(true);
    const handleClickOpenModal = () => {
      setOpenModal(true);
    };
    const handleCloseModal = () => {
      setOpenModal(false);
    };
    return(
        <div>
            <Dialog open={openModal} TransitionComponent={Transition} keepMounted onClose={handleCloseModal} aria-describedby="alert-dialog-slide-description">
                <DialogTitle>Nenhum registro disponivel</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Cadastre um novo {props.pagina} ou verifique suas permissões junto ao administrador e tente novamente!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Fechar</Button>
                </DialogActions>
            </Dialog>
            <Tooltip title={`Adicionar ${props.pagina}`}>
                <Box onClick={redirecionar} style={{position: 'fixed', bottom: 20, right: 20}}>
                    <Fab color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                </Box>   
            </Tooltip> 
        </div>
    )
}
export default NenhumaRegistro;