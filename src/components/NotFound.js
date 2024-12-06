import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 1.5,
};
const NotFound = () => {
  return (
    <div>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <strong style={{color: "red"}} >ERRO 404</strong> - Sem permissão
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Por favor, verifique a URL informada ou solicite permissão ao administrador do site.
          </Typography>
        </Box>
    </div>
  );
}
export default NotFound;