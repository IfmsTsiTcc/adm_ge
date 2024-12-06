import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VpnKeyOffIcon from '@mui/icons-material/VpnKeyOff';
import styles from "./ListarLeads.module.css";
import { Link } from "react-router-dom";
import Loading from "../../Loading";
import Tooltip from "@mui/material/Tooltip";
import ExcluirCliente from "../../exclusao/cliente/ExcluirCliente";
import SearchIcon from "@mui/icons-material/Search";
import { alertaErro, alertaSucesso } from "../../alertas/Alertas";
import SearchInput from "../../useDebounce/SearchInput";
import axios from "axios";
import * as XLSX from "xlsx";
export default function ListarLeads() {
  const [excelData, setExcelData] = useState([]);
  const [qtRegistros, setQtRegistros] = useState(10);
  const [situacao, setSituacao] = useState(0);
  const [loadingImport, setLoadingImport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const fileInputRef = useRef(null);
  const [text, setText] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current.click();
  }

  const handleFileUpload = (event) => {
    try {
      const file = event.target.files[0];
      // Leitura do arquivo Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        setLoadingImport(true);
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Pegando a primeira aba (sheet) do arquivo Excel
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertendo os dados da aba para um JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log(jsonData);
        setLoadingImport(false);
        handleImportDados(jsonData);
        setExcelData(jsonData);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      alertaErro(
        `Erro ao importar dados, tente novamente`
      );
    }
  };


  const handleImportDados = async (dados) => {

    const tamLote = 1000; // Define o tamanho do lote
    console.log(dados.length);

    try {
      setLoadingImport(true);
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      };

      // Envia os dados em lotes
      for (let i = 0; i < dados.length; i += tamLote) {
        const lote = dados.slice(i, i + tamLote);

        const response = await axios.post(
          "https://gesuportelogico.com.br/admin/api/leads/create",
          lote,
          requestOptions
        );
        alertaSucesso(`Lote ${i / tamLote + 1} de ${parseFloat(dados.length / 1000).toFixed(0)} enviado: ${response.data?.mensagem}`);

        // Aguardar um tempo para evitar sobrecarregar a API (opcional)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      alertaErro(`Erro ao enviar dados: ${error.response.data?.mensagem}`);
    } finally {
      setLoadingImport(false);
      handleLeads();
    }
  };


  const handleChange = (event) => {
    setQtRegistros(event.target.value);
  };

  const handleSituacao = (event) => {
    setSituacao(event.target.value);
  };

  useEffect(() => {
    handleLeads();
  }, [qtRegistros, text, situacao]);

  const handleLeads = async () => {
    try {
      setLoading(true);
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      };

      const response = await axios.get(`https://gesuportelogico.com.br/admin/api/leads/read?texto=${encodeURI(text)}&qtregistros=${qtRegistros}&situacao=${situacao}`, requestOptions);
      console.log(response.data);

      setLeads(response.data.registros);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data);

      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      {loadingImport ?
        <Loading texto="Importando dados, aguarde!" />
        :
        <>
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
            LISTAGEM DE LEADS
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
                  value={situacao}
                  onChange={handleSituacao}
                >
                  <option value="0">Lead Frio</option>
                  <option value="1">Lead Quente</option>
                  <option value="2">Lead com Proposta</option>
                  <option value="3">Lead Visitado</option>
                </select>
              </div>
            </div>
            <div>
              <div
                className={styles.div_container_topo_add_contrato}
                onClick={null}
              >
                <button onClick={handleButtonClick}>
                  Importar Dados
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls" style={{ display: 'none' }} />
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
                  <option value={400}>400</option>
                </select>
              </div>
              <div className={styles.div_container_topo}>
                <span style={{ width: "100%", textAlign: "left" }}>
                  {leads?.length} registro
                  {leads?.length == 1 ? "" : "s"} encontrado
                  {leads?.length == 1 ? "" : "s"}
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
                <th className={styles.titulo}>Dados</th>
                <th className={styles.titulo}>Atividade Principal</th>
                <th className={styles.titulo}>Contato</th>
                <th className={styles.titulo}>Situação</th>
                <th className={styles.titulo}>Ações</th>
              </tr>
              {leads?.map((lead, index) => (
                index < qtRegistros &&
                <tr
                  className={styles.corpo_tabela}
                  key={index}
                  style={{
                    backgroundColor: index % 2 == 0 ? "#e5e7eb" : "#fff",
                  }}
                >
                  <td className={styles.titulo}>
                    <p className={styles.nomeCliente}>{lead?.razao_social}</p>
                    {lead?.nome_fantasia && <p>Fantasia: {lead?.nome_fantasia}</p>}
                    <p className={styles.bairro}>{lead?.bairro} - {lead?.municipio} - {lead?.uf}</p>
                    <p className={styles.bairro}>CNPJ: {lead?.contato}</p>
                  </td>
                  <td className={styles.titulo}>{lead?.atividade_principal}</td>
                  <td className={styles.titulo}>{lead?.contato}</td>
                  <td className={styles.titulo}>{lead?.situacao == 0 ? "Lead Frio" : lead?.situacao == 1 ? "Lead Quente" : lead?.situacao == 2 ? "Lead com Proposta" : "Lead Visitado"}</td>
                  <td className={styles.opcoes}>
                    <ButtonGroup disableElevation variant="contained">
                      <Tooltip title="Situação">
                        <Button
                          size="small"
                          color="success"
                          style={{
                            borderColor: "white",
                          }}
                        >
                          <Link to={`/alterar-cliente/${lead?.id}`}>
                            <VpnKeyOffIcon sx={{ fontSize: 20 }} />
                          </Link>
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
                          <Link to={`/alterar-lead/${lead?.id}`}>
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
                            id={lead?.id}
                            cliente={lead?.nome}
                          />
                        </Button>
                      </Tooltip>
                      <Tooltip title={`Chamar ${lead?.contato} no whatsapp`}>
                        <Button
                          size="small"
                          color="success"
                          style={{
                            borderColor: "white",
                          }}
                        >
                          <Link target="_blank" to={`https://api.whatsapp.com/send?phone=55${lead?.contato}&text=`}>
                            <WhatsAppIcon sx={{ fontSize: 20 }} />
                          </Link>
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </td>
                </tr>

              ))}
            </table>
          )}
        </>
      }
    </div>
  );
}
