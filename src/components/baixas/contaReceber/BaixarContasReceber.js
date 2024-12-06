import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import Apis from "../../../Apis";
import { useNavigate } from "react-router-dom";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { alertaErro, alertaSucesso } from "../../alertas/Alertas";
import { useState } from "react";
import { Payment } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BaixarContasReceber(props) {
  const [open, setOpen] = useState(false);
  const [valor, setValor] = useState(0);
  const [banco, setBanco] = useState("");
  const [multa, setMulta] = useState(0);
  const [juros, setJuros] = useState(0);
  const [permissoes, setPermissoes] = useState([]);
  const [bancos, setBancos] = useState([]);
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const dataAtual = ano + "-" + mes + "-" + dia;
  const redirect = useNavigate();

  const handleValor = (e) => {
    setValor(e.target.value);
  };

  const handleBanco = (event) => {
    setBanco(event.target.value);
  };

  const handleMulta = (event) => {
    setMulta(event.target.value);
  };

  const handleJuros = (event) => {
    setJuros(event.target.value);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const idUser = localStorage.getItem("usuario_id");
    // buscar permissoes
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ usuario_id: idUser }),
    };

    fetch(Apis.urlPermissoes, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.retorno[0].sucesso) {
          setPermissoes(result.registros);
        } else {
          alertaErro(result.retorno[0].mensagem);
        }
      })
      .catch((erro) => {
        alertaErro("Tente novamente ou entre em contato com o administrador");
      });

    // buscar bancos
    const requestOptionsBancos = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(""),
    };

    fetch(Apis.urlListarBancos, requestOptionsBancos)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.retorno[0].sucesso) {
          setBancos(result.registros);
        } else {
          alertaErro(result.retorno[0].mensagem);
        }
      })
      .catch((erro) => {
        alertaErro(
          "Nenhum banco, Tente novamente ou entre em contato com o administrador"
        );
      });
  }, []);

  const handleBloqueio = () => {
    const dados = {
      parcela_id: props.id,
      data: dataAtual,
      banco_id: banco,
      valor_pago: valor,
      juros: juros,
      multa: multa,
    };

    if (permissoes[0]?.contratos.alterar == 0) {
      if (banco !== "" && valor !== "") {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(dados),
        };

        fetch(Apis.urlCadBaixa, requestOptions)
          .then((response) => {
            return response.json();
          })
          .then((result) => {
            if (result.retorno[0].sucesso) {
              alertaSucesso(result.retorno[0].mensagem);
              redirect(`/excluir-redirect/${"listar-contas-receber"}`);
            } else {
              alertaErro(result.retorno[0].mensagem);
            }
          })
          .catch((erro) => console.log(erro));
      } else if (banco === "" || valor === "") {
        alertaErro("Preencha todos os campos");
      }
    } else {
      alertaErro("Você não possui permissão para alterar um contrato!");
      redirect(`/excluir-redirect/${"listar-contas-receber"}`);
    }
  };
  return (
    <>
      <Payment onClick={handleClose} sx={{ fontSize: 20 }} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            className="text-center"
            variant="h6"
            component="h2"
          >
            Baixar Parcela
          </Typography>
          <Typography
            id="modal-modal-description"
            className="text-center"
            sx={{ mt: 2 }}
          >
            Deseja alterar a situação da conta{" "}
            <strong style={{ textTransform: "uppercase" }}>
              {props.numero}
            </strong>
            , do cliente{" "}
            <strong style={{ textTransform: "uppercase" }}>
              {props.cliente}?
            </strong>
          </Typography>

          <TextField
            className="w-full mt-4"
            value={banco}
            onChange={handleBanco}
            id="outlined-select-currency"
            label="Banco"
            select
          >
            {bancos?.map((item) => (
              <MenuItem value={item.id} key={item.id}>{item.descricao}</MenuItem>
            ))}
          </TextField>

          <TextField
            className="w-full mt-4"
            required
            value={valor}
            onChange={handleValor}
            label="Valor pago"
            input
          />
          <TextField
            className="w-full mt-4"
            required
            value={juros}
            onChange={handleJuros}
            label="Valor juros"
            input
          />
          <TextField
            className="w-full mt-4"
            required
            value={multa}
            onChange={handleMulta}
            label="Valor multa"
            input
          />

          <div className="text-center" style={{ marginTop: "20px" }}>
            <ButtonGroup
              disableElevation
              variant="contained"
              className="w-full"
            >
              <Button onClick={handleClose} color="success" className="w-full">
                <DoNotDisturbAltIcon style={{ marginRight: "5px" }} />
                Cancelar
              </Button>
              <Button color="error" onClick={handleBloqueio} className="w-full">
                <Payment style={{ marginRight: "5px" }} /> Confirmar
              </Button>
            </ButtonGroup>
          </div>
        </Box>
      </Modal>
    </>
  );
}
