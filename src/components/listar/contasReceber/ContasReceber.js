import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading";
import Apis from "../../../Apis";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./ContasReceber.module.css";
import { alertaErro } from "../../alertas/Alertas";
import SearchInput from "../../useDebounce/SearchInput";
import Drawer from "react-modern-drawer";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import { CurrencyExchange, Edit } from "@mui/icons-material";
import BaixarContasReceber from "../../baixas/contaReceber/BaixarContasReceber";
import AlterarBaixa from "../../alterar/baixas/AlterarBaixa";
import { ImBarcode } from 'react-icons/im';
export default function ContasReceber() {
  const [linha, setLinha] = useState(10);
  const [loading, setLoading] = useState(false);
  const [contas, setContas] = useState([]);
  const [baixas, setBaixas] = useState([]);
  const [text, setText] = useState("");
  const [filtro, setFiltro] = useState("0");
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = (item) => {
    setIsOpen((prevState) => !prevState);
    setBaixas(item);
  };

  const data = new Date();
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const [dataIni, setDataIni] = useState(ano + "-" + mes + "-01");
  const [dataFin, setDataFin] = useState(ano + "-" + mes + "-" + dia);

  const redirect = useNavigate();

  const handleFiltro = (event) => {
    setFiltro(event.target.value);
  };

  const handleRegistros = (event) => {
    setLinha(event.target.value);
  };
  const verificaConta = (dataReceber) => {
    var partesData = dataReceber.split("-");
    return (
      new Date(ano, mes, dia) <
      new Date(partesData[0], partesData[1], partesData[2])
    );
  };
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json", Authorization: `${token}`,
      },
    };
    fetch(
      `${Apis.urlListarContasReceber}?pesquisa=${text}&data_inicial=${dataIni}&data_final=${dataFin}&qt_registros=${linha}&filtro=${filtro}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.retorno[0].sucesso) {
          setContas(result.registros);
        } else {
          if (result.retorno[0].mensagem == "Sem autorização!.") {
            alertaErro(result.retorno[0].mensagem);
            redirect("/");
          }
        }
        setLoading(false);
      })
      .catch((erro) => {
        alertaErro(
          "Falha na requisição, verifique sua conexão e tente novamente!"
        );
        redirect("/");
        console.log(erro);
      });
  }, [linha, text, dataIni, dataFin, filtro]);
  const redirecionar = () => {
    redirect("/cadastrar-cobranca");
  };
  return (
    <>
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
          CONTAS A RECEBER
        </div>

        <div className={styles.topo_form}>
          <div>
            <div className={styles.div_container_topo}>
              <SearchInput
                value={text}
                onChange={(search) => setText(search)}
              />
              <SearchIcon sx={{ fontSize: 20 }} />
            </div>
            <div className={styles.div_container_topo}>
              <select
                className={styles.filtro}
                onChange={handleFiltro}
                value={filtro}
              >
                <option disabled>Filtrar por situação</option>
                <option value="0">Todos</option>
                <option value="1">Somente à receber</option>
                <option value="2">Somente as recebidas</option>
                <option value="3">Somente á vencer</option>
                <option value="4">Somente as vencidas</option>
                <option value="5">Somente as recebidas paciais</option>
              </select>
            </div>
          </div>
          <div>
            <div
              className={styles.div_container_topo_add_contrato}
              onClick={redirecionar}
            >
              <button>Adicionar Cobrança</button>
            </div>
            <div className={styles.div_container_topo}>
              <select
                className={styles.filtro}
                value={linha}
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
              <input
                className={styles.filtro}
                type="date"
                value={dataIni}
                onChange={(e) => setDataIni(e.target.value)}
              />
            </div>
            <div className={styles.div_container_topo}>
              <input
                className={styles.filtro}
                type="date"
                value={dataFin}
                onChange={(e) => setDataFin(e.target.value)}
              />
            </div>
            <div className={styles.div_container_topo}>
              <span style={{ width: "100%", textAlign: "left" }}>
                {contas?.length} registro
                {contas?.length == 1 ? "" : "s"} encontrado
                {contas?.length == 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ marginTop: 50 }}>
            <div style={{ marginTop: 50 }}>
              <Loading />
            </div>
          </div>
        ) : (
          <table cellspacing="0" rules="none">
            <tr className={styles.topo_tabela}>
              <th className={styles.titulo} style={{ textAlign: 'left' }}>Cliente</th>
              <th className={styles.titulo}>Nº documento</th>
              <th className={styles.titulo}>Boleto</th>
              <th className={styles.titulo}>Pagamento</th>
              <th className={styles.titulo}>Vencimento</th>
              <th className={styles.titulo} style={{ textAlign: "center" }}>
                Valor
              </th>
              <th className={styles.titulo} style={{ textAlign: "center" }}>
                Valor Pago
              </th>
              <th className={styles.titulo} style={{ textAlign: "center" }}>
                À Receber
              </th>
              <th className={styles.titulo} style={{ textAlign: "center" }}>
                Ações
              </th>
            </tr>
            {contas?.map((conta, index) => (
              <tr
                // onClick={() => redirect(`/alterar-contrato/id_contrato_aqui`)}
                className={styles.corpo_tabela}
                key={index}
                style={{
                  // backgroundColor: index % 2 == 0 ? '#e5e7eb' : '#fff',
                  backgroundColor:
                    conta.a_receber == 0
                      ? "#a0eba0"
                      : parseFloat(conta.a_receber) > 0 &&
                        parseFloat(conta.a_receber) < parseFloat(conta.valor)
                        ? "rgb(158 217 249)"
                        : conta.a_receber > 0 && verificaConta(conta.vencimento)
                          ? "#e5e7eb"
                          : conta.a_receber < 0
                            ? "#a0eba0"
                            : "#f7a7a7",
                }}
              >
                <td className={styles.id}>{conta.numero}</td>
                <td className={styles.titulo} style={{ textAlign: 'left' }}>
                  <p className={styles.nomeCliente}>{conta.nome}</p>
                  <p className={styles.cpfCnpj}>CNPJ / CPF: {conta.cnpj_cpf}</p>
                </td>
                <td className={styles.titulo}>{conta.numero}</td>
                <td className={styles.titulo} style={{ display: 'flex', justifyContent: 'center' }}>
                  {conta?.identificador_terceiros && <ImBarcode size='25' />}
                </td>

                <td className={styles.titulo}>{conta.forma_pag}</td>
                <td className={styles.titulo}>
                  {conta.vencimento.split("-").reverse().join("/")}
                </td>
                <td className={styles.titulo} style={{ textAlign: "center" }}>
                  {conta.valor}
                </td>
                <td className={styles.titulo} style={{ textAlign: "center" }}>
                  {conta.valor_pago}
                </td>
                <td className={styles.titulo} style={{ textAlign: "center" }}>
                  {conta.a_receber}
                </td>
                <td className={styles.opcoes} style={{ textAlign: "center" }}>
                  <ButtonGroup disableElevation variant="contained">
                    {conta.baixas?.length > 0 && (
                      <Tooltip title="Visualizar baixas">
                        <Button
                          size="small"
                          onClick={() => toggleDrawer(conta)}
                          style={{ borderColor: "white" }}
                          color="success"
                        >
                          <CurrencyExchange
                            sx={{ fontSize: 20 }}
                            id={conta.numero}
                            cliente={conta.nome}
                          />
                        </Button>
                      </Tooltip>
                    )}
                    {parseFloat(conta.valor_pago ? conta.valor_pago : 0) <
                      parseFloat(conta.valor) && (
                        <Tooltip title="Baixar conta">
                          <Button
                            size="small"
                            style={{ borderColor: "white" }}
                            color="warning"
                          >
                            <BaixarContasReceber
                              id={conta.id_parcela}
                              numero={conta.numero}
                              cliente={conta.nome}
                            />
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

      <Drawer
        duration={1000}
        open={isOpen}
        onClose={() => toggleDrawer([])}
        direction="bottom"
        style={{
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "auto",
          display: "flex",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            width: "100%",
            zIndex: 2,
            transition: "ease-out",
            padding: 10,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {baixas.baixas?.length > 0 ? (
            <>
              <p style={{ color: "#174c4f", extAlign: "left", width: "100%" }}>
                <strong>BAIXAS</strong>
              </p>
              <table cellspacing="0" rules="none">
                <tr className={styles.topo_tabela}>
                  <th className={styles.titulo}>Data</th>
                  <th className={styles.titulo}>Valor Pago</th>
                  <th className={styles.titulo}>Multa</th>
                  <th className={styles.titulo}>Juros</th>
                  <th className={styles.titulo}>Ações</th>
                </tr>
                {baixas.baixas?.map((baixa, index) => (
                  <tr
                    className={styles.corpo_tabela}
                    key={index}
                    // onClick={() => toggleDrawer([])}
                    style={{
                      backgroundColor: index % 2 == 0 ? "#e5e7eb" : "#fff",
                    }}
                  >
                    <td className={styles.titulo}>
                      {baixa.data_baixa.split("-").reverse().join("/")}
                    </td>
                    <td className={styles.titulo}>{baixa.valor_pago}</td>
                    <td className={styles.titulo}>{baixa.multa}</td>
                    <td className={styles.titulo}>{baixa.juros}</td>
                    <td className={styles.titulo}>
                      <ButtonGroup>
                        <Tooltip title="Alterar baixa">
                          <Button
                            size="small"
                            style={{
                              borderColor: "white",
                              backgroundColor: "#ed6c02",
                              color: "#fff",
                            }}
                          >
                            <AlterarBaixa baixa={baixa} dados={baixas} />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </table>
            </>
          ) : (
            <p>Nenhum baixa para exibir</p>
          )}
        </div>
      </Drawer>
    </>
  );
}
