import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./ListarClientes.module.css";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../Loading";
import Apis from "../../../Apis";
import Tooltip from "@mui/material/Tooltip";
import ExcluirCliente from "../../exclusao/cliente/ExcluirCliente";
import SearchIcon from "@mui/icons-material/Search";
import { alertaErro } from "../../alertas/Alertas";
import SearchInput from "../../useDebounce/SearchInput";
import axios from "axios";
import EnviarClientes from "../../asaas/cobranca/EnviarClientes";
export default function ListarClientes() {
  const [qtRegistros, setQtRegistros] = useState(10);
  const [uf, setUf] = useState("MS");
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const redirect = useNavigate();
  const [text, setText] = useState("");

  const handleChange = (event) => {
    setQtRegistros(event.target.value);
  };

  const handleUf = (event) => {
    setUf(event.target.value);
  };

  const handleStatus = (event) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    const handleClientes = async () => {
      setLoading(true);
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      };
      const body = JSON.stringify({
        id_Representante: 0,
        qt_registros: qtRegistros,
        uf: uf,
        pesquisa: text,
        status: status,
      });
      await axios
        .post(Apis.urlListarClientes, body, requestOptions)
        .then((response) => {
          if (response.status) {
            console.log(response);
            if (response.data.registros.length < 1) {
              setClientes([]);
              setLoading(false);
              return alertaErro(response.data.retorno[0].mensagem);
            }
            setClientes(response.data.registros);
          }
          setLoading(false);
        })
        .catch((erro) => {
          console.log(erro.response);
          if (erro.response.status > 201) {
            alertaErro(
              `Erro ${erro.response.status} - ${erro.response.data.retorno[0].mensagem}`
            );
            redirect("/");
            setLoading(false);
          }
        });
    };
    handleClientes();
  }, [qtRegistros, text, status, uf]);

  const baixarCsv = () => {
    var csv =
      "NOME,CNPJ-CPF,LOGRADOURO,NUMERO,BAIRRO,CIDADE,UF,TELEFONE 1,TELEFONE 2\n";
    clientes?.forEach(function (item) {
      csv += item.nome;
      csv += "," + item.cnpj_cpf;
      csv += "," + item.logradouro;
      csv += "," + item.numero;
      csv += "," + item.bairro;
      csv += "," + item.cidade;
      csv += "," + item.uf;
      csv += "," + item.telefone1;
      csv += "," + item.telefone2;
      csv += "\n";
    });
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = "lista_clientes.csv";
    hiddenElement.click();
  };
  const redirecionar = () => {
    redirect("/cadastrar-cliente");
  };
  return (
    <div className={styles.container}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderStyle: "solid",
          borderBottomWidth: 1,
          borderColor: "#174c4f",
          marginBottom: 10,
          color: "#174c4f",
        }}
      >
        LISTAGEM DE CLIENTE
      </div>

      <div className={styles.topo_form}>
        <div>
          <div className={styles.div_container_topo}>
            <SearchInput value={text} onChange={(search) => setText(search)} />
            <SearchIcon sx={{ fontSize: 20 }} />
          </div>
          <div className={styles.div_container_topo}>
            <select
              className={styles.filtro}
              value={status}
              onChange={handleStatus}
            >
              <option value="0">Mostrar ativos</option>
              <option value="1">Mostrar inativos</option>
            </select>
          </div>
        </div>
        <div>
          <div className={styles.div_container_topo} onClick={baixarCsv}>
            <button>Exportar Dados</button>
          </div>
          <div
            className={styles.div_container_topo_add_contrato}
            onClick={redirecionar}
          >
            <button>Adicionar Cliente</button>
          </div>
          <div className={styles.div_container_topo}>
            <select
              className={styles.filtro}
              value={qtRegistros}
              onChange={handleChange}
            >
              <option disabled>Registros</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={300}>300</option>
              <option value={0}>Mostrar todos</option>
            </select>
          </div>
          <div className={styles.div_container_topo}>
            <select className={styles.filtro} value={uf} onChange={handleUf}>
              <option disabled></option>
              <option value="MS">MS</option>
              <option value="MT">MT</option>
              <option value="RO">RO</option>
              <option value="PR">PR</option>
              <option value="SP">SP</option>
              {/* <option value="?">Mostrar todos</option> */}
            </select>
          </div>
          <div className={styles.div_container_topo}>
            <span style={{ width: "100%", textAlign: "left" }}>
              {clientes?.length} registro
              {clientes?.length == 1 ? "" : "s"} encontrado
              {clientes?.length == 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ marginTop: 50 }}>
          <Loading />
        </div>
      ) : (
        <table cellspacing="0" rules="none">
          <tr className={styles.topo_tabela}>
            <th className={styles.titulo}>Sistema</th>
            <th className={styles.titulo}>Data</th>
            <th className={styles.titulo}>Ações</th>
          </tr>
          {clientes?.map((cliente, index) => (
            <tr
              className={styles.corpo_tabela}
              key={index}
              style={{
                backgroundColor: index % 2 == 0 ? "#e5e7eb" : "#fff",
              }}
            >
              <td className={styles.id}>{cliente.id}</td>
              <td className={styles.titulo}>
                <p className={styles.nomeCliente}>{cliente.nome}</p>
                <p className={styles.situacao}>Fantasia: {cliente.apelido}</p>
                <p className={styles.situacao}>
                  CNPJ / CPF: {cliente.cnpj_cpf}
                </p>
              </td>
              <td className={styles.titulo}>{cliente.updated_at}</td>
              <td className={styles.opcoes}>
                <ButtonGroup disableElevation variant="contained">
                  <Tooltip title="Editar">
                    <Button
                      size="small"
                      style={{
                        backgroundColor: "rgb(255, 193, 7)",
                        borderColor: "white",
                      }}
                    >
                      <Link to={`/alterar-cliente/${cliente?.id}`}>
                        <EditIcon sx={{ fontSize: 20 }} />
                      </Link>
                    </Button>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <Button
                      size="small"
                      style={{ borderColor: "white" }}
                      color="error"
                    >
                      <ExcluirCliente
                        id={cliente?.id}
                        cliente={cliente?.nome}
                      />
                    </Button>
                  </Tooltip>
                  {!cliente.identificador_terceiros && (
                    <Tooltip
                      title={`Enviar cliente ${cliente.cnpj_cpf} para Asaas`}
                    >
                      <Button
                        size="small"
                        style={{ backgroundColor: "#0028c3" }}
                      >
                        <EnviarClientes cliente={cliente} />
                      </Button>
                    </Tooltip>
                  )}
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}
