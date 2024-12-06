import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./ListarContratos.module.css";
import { Link } from "react-router-dom";
import Loading from "../../Loading";
import Apis from "../../../Apis";
import Tooltip from "@mui/material/Tooltip";
import ExcluirContrato from "../../exclusao/contrato/ExcluirContrato";
import BlockContrato from "../../bloqueio/contrato/BlockContrato";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { alertaErro, alertaSucesso } from "../../alertas/Alertas";
import { FaUser } from "react-icons/fa";
import { GiSuitcase } from "react-icons/gi";
import SearchInput from "../../useDebounce/SearchInput";
import axios from "axios";
export default function ListarContratosTeste() {
  const [qtRegistros, setQtRegistros] = useState(10);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPanilha, setLoadingPanilha] = useState(false);
  const [contratos, setContratos] = useState([]);
  const [filtrar, setFiltrar] = useState("");
  const redirect = useNavigate();

  const handleRegistros = (event) => {
    setQtRegistros(event.target.value);
  };

  const handleFiltrar = (event) => {
    setFiltrar(event.target.value);
  };
  useEffect(() => {
    const handleContratos = async () => {
      setLoading(true);
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      };
      const body = {
        id_Representante: 0,
        qt_registros: qtRegistros,
        pesquisa: text,
        bloqueio: filtrar,
      };
      console.log(body);
      await axios
        .post(Apis.urlListarContratos, JSON.stringify(body), requestOptions)
        .then((response) => {
          console.log(response);
          if (response.status) {
            if (response.data.registros.length < 1) {
              setContratos([]);
              setLoading(false);
              return alertaErro(response.data.retorno[0].mensagem);
            }
            var reduced = [];
            response.data.registros.forEach((item) => {
              var duplicated =
                reduced.findIndex((redItem) => {
                  return item.cnpj_cpf_cliente == redItem.cnpj_cpf_cliente;
                }) > -1;

              if (!duplicated) {
                reduced.push(item);
              }
            });
            setContratos(reduced);
          }
          setLoading(false);
        })
        .catch((erro) => {
          if (erro.response.status > 201) {
            alertaErro(
              `Erro ${erro.response.status} - ${erro.response.data.retorno[0].mensagem}`
            );
            redirect("/");
            setLoading(false);
          }
        });
    };
    handleContratos();
  }, [qtRegistros, text, filtrar]);

  // gerar planilha de todos os contratos
  const downloadCsv = async () => {
    setLoadingPanilha(true);
    var csv = "NOME CLIENTE,CNPJ,SISTEMA,Nº CONTRATO,SITUAÇÃO,REPRESENTANTE\n";
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    };

    await axios
      .post(Apis.urlListarContratos, {}, requestOptions)
      .then((response) => {
        if (response.status) {
          if (response.data.registros.length < 1) {
            setLoadingPanilha(false);
            return;
          }
          response.data.registros?.map((item) => {
            csv += item.nome_cliente;
            csv += "," + item.cnpj_cpf_cliente;
            csv += "," + item.sistema;
            csv += "," + item.numero_contrato;
            csv += "," + item.situacao;
            csv += "," + item.nome_representante;
            csv += "\n";
          });

          var hiddenElement = document.createElement("a");
          hiddenElement.href =
            "data:text/csv;charset=utf-8," + encodeURI(csv.toUpperCase());
          hiddenElement.target = "_blank";
          hiddenElement.download = "lista_contratos.csv";
          hiddenElement.click();
          setLoadingPanilha(false);
        }
        setLoadingPanilha(false);
      })
      .catch((erro) => {
        if (erro.response.status > 201) {
          alertaErro(
            `Erro ${erro.response.status} - ${erro.response.data.retorno[0].mensagem}`
          );
          redirect("/");
          setLoadingPanilha(false);
        }
      });
  };
  const redirecionar = () => {
    redirect("/cadastrar-contrato");
  };
  if (loadingPanilha) {
    return (
      <div
        style={{
          width: "100%",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading texto="gerando planilha, o download será iniciado em breve" />
      </div>
    );
  }
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
        {/* <ViewListIcon></ViewListIcon> */}
        LISTAGEM DE CONTRATOS
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
              onChange={handleFiltrar}
              value={filtrar}
            >
              <option disabled>Filtrar por situação</option>
              <option value="">Todos</option>
              <option value="0">Liberados</option>
              <option value="1">Bloqueados</option>
              <option value="2">Encerrados</option>
            </select>
          </div>
        </div>
        <div>
          <div
            className={styles.div_container_topo}
            onClick={() => downloadCsv()}
          >
            <button>Exportar Dados</button>
          </div>
          <div
            className={styles.div_container_topo_add_contrato}
            onClick={redirecionar}
          >
            <button>Adicionar Contrato</button>
          </div>
          <div className={styles.div_container_topo}>
            <select
              className={styles.filtro}
              value={qtRegistros}
              onChange={handleRegistros}
            >
              <option disabled>Registros</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className={styles.div_container_topo}>
            <span style={{ width: "100%", textAlign: "left" }}>
              {contratos?.length} registro
              {contratos?.length == 1 ? "" : "s"} encontrado
              {contratos?.length == 1 ? "" : "s"}
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
            <th className={styles.titulo}>Cliente</th>
            <th className={styles.titulo}>CDC</th>
            <th className={styles.titulo}>Data Início</th>
            <th className={styles.titulo}>Ações</th>
          </tr>
          {contratos?.map((contrato, index) => (
            <tr
              className={styles.corpo_tabela}
              key={index}
              style={{
                backgroundColor:
                  contrato.situacao.toLowerCase() == "bloqueado"
                    ? "#f1b9b9"
                    : contrato.situacao.toLowerCase() == "encerrado"
                    ? "#ffffba"
                    : index % 2 == 0
                    ? "#e5e7eb"
                    : "#fff",
              }}
            >
              {/* <td className={styles.id}>{contrato.id}</td> */}
              <td className={styles.titulo}>
                <p
                  className={styles.nomeCliente}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {/* cor devendo #c5381a */}
                  <FaUser
                    size="13"
                    style={{ marginRight: 5, color: "#00d071" }}
                  />
                  {contrato.nome_cliente}
                </p>
                <p className={styles.situacao}>Situação: {contrato.situacao}</p>
                <p className={styles.cpfCnpj}>
                  CNPJ / CPF: {contrato.cnpj_cpf_cliente}
                </p>
              </td>
              <td className={styles.titulo}>{contrato.numero_contrato}</td>
              <td className={styles.titulo}>
                {contrato.data_inicio.split("-").reverse().join("/")}
              </td>
              <td className={styles.opcoes}>
                <ButtonGroup disableElevation variant="contained">
                  <Tooltip title={`Contrato ${contrato.numero_contrato}`}>
                    <Button
                      size="small"
                      style={{
                        backgroundColor: "#6464f8",
                        borderColor: "white",
                      }}
                    >
                      <Link to={`/contrato-pdf/${contrato.id}`} target="_blank">
                        <GiSuitcase size={25} />
                      </Link>
                    </Button>
                  </Tooltip>
                  <Tooltip title="Situação">
                    <Button
                      size="small"
                      style={{ borderColor: "white" }}
                      color="success"
                    >
                      <BlockContrato
                        id={contrato.id}
                        numero={contrato.numero_contrato}
                        cliente={contrato.nome_cliente}
                        situacao={contrato.situacao}
                      ></BlockContrato>
                    </Button>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <Button
                      size="small"
                      style={{
                        backgroundColor: "rgb(255, 193, 7)",
                        borderColor: "white",
                      }}
                    >
                      <Link to={`/alterar-contrato/${contrato.id}`}>
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
                      <ExcluirContrato
                        id={contrato.id}
                        cliente={contrato.nome_cliente}
                        contrato={contrato.numero_contrato}
                      />
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}
