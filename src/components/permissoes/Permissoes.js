import * as React from 'react';
import styles from './ListarUser.module.css';
import ViewListIcon from '@mui/icons-material/ViewList';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import Loading from '../Loading';
import Apis from '../../Apis';
import styled from 'styled-components';
import { alertaErro, alertaSucesso } from '../alertas/Alertas';
export default function Permissoes() {
  const redirect = useNavigate();
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState([]);
  const parametro = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value })
  }
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    var dadosPermissoes =
    {
      "usuario_id": parametro.id,
      "clientes": { "incluir": data.incluirclientes, "alterar": data.alterarclientes, "excluir": data.excluirclientes, "visualizar": data.visualizarclientes },
      "fornecedores": { "incluir": data.incluirfornecedores, "alterar": data.alterarfornecedores, "excluir": data.excluirfornecedores, "visualizar": data.visualizarfornecedores },
      "colaboradores": { "incluir": data.incluircolaboradores, "alterar": data.alterarcolaboradores, "excluir": data.excluircolaboradores, "visualizar": data.visualizarcolaboradores },
      "representantes": { "incluir": data.incluirrepresentantes, "alterar": data.alterarrepresentantes, "excluir": data.excluirrepresentantes, "visualizar": data.visualizarrepresentantes },
      "contratos": { "incluir": data.incluircontratos, "alterar": data.alterarcontratos, "excluir": data.excluircontratos, "visualizar": data.visualizarcontratos },
      "produtos": { "incluir": data.incluirprodutos, "alterar": data.alterarprodutos, "excluir": data.excluirprodutos, "visualizar": data.visualizarprodutos },
      "mensagens": { "incluir": data.incluirmensagens, "alterar": data.alterarmensagens, "excluir": data.excluirmensagens, "visualizar": data.visualizarmensagens },
      "avisos": { "incluir": data.incluiravisos, "alterar": data.alteraravisos, "excluir": data.excluiravisos, "visualizar": data.visualizaravisos },
      "financeiro": { "incluir": data.incluirfinanceiro, "alterar": data.alterarfinanceiro, "excluir": data.excluirfinanceiro, "visualizar": data.visualizarfinanceiro }
    }

    const token = localStorage.getItem('token');
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
      body: JSON.stringify(dadosPermissoes)
    };

    fetch(Apis.urlAlterarPermissoes, requestOptions)
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        if (result.retorno[0].sucesso) {
          redirect('/listar-user')
          alertaSucesso(result.retorno[0].mensagem)
        } else {
          alertaErro(result.retorno[0].mensagem)
        }
        setLoading(false);
      })
      .catch((erro) => {
        alertaErro("Tente novamente ou entre em contato com o administrador")
      })
  }

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
      body: JSON.stringify({ "usuario_id": parametro.id })
    };

    fetch(Apis.urlPermissoes, requestOptions)
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        if (result.retorno[0].sucesso) {
          setDados(result.registros);
          // monta um array com os objetos vindos da api
          setFormValues({
            visualizarclientes: result.registros[0].clientes.visualizar, incluirclientes: result.registros[0].clientes.incluir, alterarclientes: result.registros[0].clientes.alterar, excluirclientes: result.registros[0].clientes.excluir,
            visualizaravisos: result.registros[0].avisos.visualizar, incluiravisos: result.registros[0].avisos.incluir, alteraravisos: result.registros[0].avisos.alterar, excluiravisos: result.registros[0].avisos.excluir,
            visualizarcolaboradores: result.registros[0].colaboradores.visualizar, incluircolaboradores: result.registros[0].colaboradores.incluir, alterarcolaboradores: result.registros[0].colaboradores.alterar, excluircolaboradores: result.registros[0].colaboradores.excluir,
            visualizarcontratos: result.registros[0].contratos.visualizar, incluircontratos: result.registros[0].contratos.incluir, alterarcontratos: result.registros[0].contratos.alterar, excluircontratos: result.registros[0].contratos.excluir,
            visualizarfinanceiro: result.registros[0].financeiro.visualizar, incluirfinanceiro: result.registros[0].financeiro.incluir, alterarfinanceiro: result.registros[0].financeiro.alterar, excluirfinanceiro: result.registros[0].financeiro.excluir,
            visualizarfornecedores: result.registros[0].fornecedores.visualizar, incluirfornecedores: result.registros[0].fornecedores.incluir, alterarfornecedores: result.registros[0].fornecedores.alterar, excluirfornecedores: result.registros[0].fornecedores.excluir,
            visualizarmensagens: result.registros[0].mensagens.visualizar, incluirmensagens: result.registros[0].mensagens.incluir, alterarmensagens: result.registros[0].mensagens.alterar, excluirmensagens: result.registros[0].mensagens.excluir,
            visualizarprodutos: result.registros[0].produtos.visualizar, incluirprodutos: result.registros[0].produtos.incluir, alterarprodutos: result.registros[0].produtos.alterar, excluirprodutos: result.registros[0].produtos.excluir,
            visualizarrepresentantes: result.registros[0].representantes.visualizar, incluirrepresentantes: result.registros[0].representantes.incluir, alterarrepresentantes: result.registros[0].representantes.alterar, excluirrepresentantes: result.registros[0].representantes.excluir,
          })
        } else {
          alertaErro(result.retorno[0].mensagem)
        }
        setLoading(false);
      })
      .catch((erro) => {
        alertaErro("Tente novamente ou entre em contato com o administrador")
      })
  }, [])
  // monta um array com o nome dos objetos vindos da api
  const obj = Object.assign({}, dados[0]);
  const arrayNomeObjetos = Object.keys(obj);
  // exclui o primeiro registro do array arrayNomeObjetos (usuario_id)
  arrayNomeObjetos.splice(0, 1)
  if (loading) {
    return (
      <div style={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loading />
      </div>
    )
  }
  else {
    return (
      <div style={{ padding: "30px" }} className={styles.pai}>
        <div className={styles.paiTopo}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <ViewListIcon />
            <div>PERMISSÕES DO USUÁRIO</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexWrap: 'wrap', flexGrow: 1, justifyContent: 'space-around', borderStyle: 'solid', borderWidth: 1, marginTop: 10, borderRadius: 3, borderColor: '#c4c4c4', padding: 20 }}>
            <div style={{ borderStyle: 'solid', borderWidth: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 10, marginTop: 30, flexGrow: 1, minWidth: 250, maxWidth: 250, borderRadius: 0, backgroundColor: '#f3f3f3' }}>
              <ContainerInput>
                <label style={{ color: '#174c4f', width: '100%', fontWeight: 'bold' }}>CLIENTES</label>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>CRIAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirclientes == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="incluirclientes" id="incluirclientesSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.incluirclientes != 1 ? true : false} />
                      <label for="incluirclientesSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirclientes == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="incluirclientes" id="incluirclientesNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.incluirclientes == 1 ? true : false} />
                      <label for="incluirclientesNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>ALTERAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarclientes == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="alterarclientes" id="alterarclientesSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.alterarclientes != 1 ? true : false} />
                      <label for="alterarclientesSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarclientes == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="alterarclientes" id="alterarclientesNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.alterarclientes == 1 ? true : false} />
                      <label for="alterarclientesNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>LISTAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarclientes == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="visualizarclientes" id="visualizarclientesSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.visualizarclientes != 1 ? true : false} />
                      <label for="visualizarclientesSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarclientes == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="visualizarclientes" id="visualizarclientesNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.visualizarclientes == 1 ? true : false} />
                      <label for="visualizarclientesNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>EXCLUIR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirclientes == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="excluirclientes" id="excluirclientesSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.excluirclientes != 1 ? true : false} />
                      <label for="excluirclientesSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirclientes == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="excluirclientes" id="excluirclientesNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.excluirclientes == 1 ? true : false} />
                      <label for="excluirclientesNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>
            </div>

            {/* ############## */}
            <div style={{ borderStyle: 'solid', borderWidth: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 10, marginTop: 30, flexGrow: 1, minWidth: 250, maxWidth: 250, borderRadius: 0, backgroundColor: '#f3f3f3' }}>
              <ContainerInput>
                <label style={{ color: '#174c4f', width: '100%', fontWeight: 'bold' }}>PRODUTOS</label>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>CRIAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirprodutos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="incluirprodutos" id="incluirprodutosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.incluirprodutos != 1 ? true : false} />
                      <label for="incluirprodutosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirprodutos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="incluirprodutos" id="incluirprodutosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.incluirprodutos == 1 ? true : false} />
                      <label for="incluirprodutosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>ALTERAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarprodutos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="alterarprodutos" id="alterarprodutosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.alterarprodutos != 1 ? true : false} />
                      <label for="alterarprodutosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarprodutos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="alterarprodutos" id="alterarprodutosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.alterarprodutos == 1 ? true : false} />
                      <label for="alterarprodutosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>LISTAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarprodutos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="visualizarprodutos" id="visualizarprodutosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.visualizarprodutos != 1 ? true : false} />
                      <label for="visualizarprodutosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarprodutos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="visualizarprodutos" id="visualizarprodutosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.visualizarprodutos == 1 ? true : false} />
                      <label for="visualizarprodutosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>EXCLUIR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirprodutos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="excluirprodutos" id="excluirprodutosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.excluirprodutos != 1 ? true : false} />
                      <label for="excluirprodutosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirprodutos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="excluirprodutos" id="excluirprodutosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.excluirprodutos == 1 ? true : false} />
                      <label for="excluirprodutosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>
            </div>

            {/* ############## */}
            <div style={{ borderStyle: 'solid', borderWidth: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 10, marginTop: 30, flexGrow: 1, minWidth: 250, maxWidth: 250, borderRadius: 0, backgroundColor: '#f3f3f3' }}>
              <ContainerInput>
                <label style={{ color: '#174c4f', width: '100%', fontWeight: 'bold' }}>REPRESENTANTES</label>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>CRIAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirrepresentantes == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="incluirrepresentantes" id="incluirrepresentantesSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.incluirrepresentantes != 1 ? true : false} />
                      <label for="incluirrepresentantesSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirrepresentantes == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="incluirrepresentantes" id="incluirrepresentantesNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.incluirrepresentantes == 1 ? true : false} />
                      <label for="incluirrepresentantesNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>ALTERAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarrepresentantes == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="alterarrepresentantes" id="alterarrepresentantesSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.alterarrepresentantes != 1 ? true : false} />
                      <label for="alterarrepresentantesSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarrepresentantes == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="alterarrepresentantes" id="alterarrepresentantesNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.alterarrepresentantes == 1 ? true : false} />
                      <label for="alterarrepresentantesNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>LISTAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarrepresentantes == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="visualizarrepresentantes" id="visualizarrepresentantesSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.visualizarrepresentantes != 1 ? true : false} />
                      <label for="visualizarrepresentantesSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarrepresentantes == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="visualizarrepresentantes" id="visualizarrepresentantesNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.visualizarrepresentantes == 1 ? true : false} />
                      <label for="visualizarrepresentantesNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>EXCLUIR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirrepresentantes == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="excluirrepresentantes" id="excluirrepresentantesSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.excluirrepresentantes != 1 ? true : false} />
                      <label for="excluirrepresentantesSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirrepresentantes == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="excluirrepresentantes" id="excluirrepresentantesNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.excluirrepresentantes == 1 ? true : false} />
                      <label for="excluirrepresentantesNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>
            </div>

            {/* ############## */}
            <div style={{ borderStyle: 'solid', borderWidth: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 10, marginTop: 30, flexGrow: 1, minWidth: 250, maxWidth: 250, borderRadius: 0, backgroundColor: '#f3f3f3' }}>
              <ContainerInput>
                <label style={{ color: '#174c4f', width: '100%', fontWeight: 'bold' }}>FORNECEDORES</label>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>CRIAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirfornecedores == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="incluirfornecedores" id="incluirfornecedoresSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.incluirfornecedores != 1 ? true : false} />
                      <label for="incluirfornecedoresSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirfornecedores == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="incluirfornecedores" id="incluirfornecedoresNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.incluirfornecedores == 1 ? true : false} />
                      <label for="incluirfornecedoresNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>ALTERAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarfornecedores == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="alterarfornecedores" id="alterarfornecedoresSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.alterarfornecedores != 1 ? true : false} />
                      <label for="alterarfornecedoresSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarfornecedores == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="alterarfornecedores" id="alterarfornecedoresNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.alterarfornecedores == 1 ? true : false} />
                      <label for="alterarfornecedoresNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>LISTAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarfornecedores == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="visualizarfornecedores" id="visualizarfornecedoresSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.visualizarfornecedores != 1 ? true : false} />
                      <label for="visualizarfornecedoresSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarfornecedores == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="visualizarfornecedores" id="visualizarfornecedoresNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.visualizarfornecedores == 1 ? true : false} />
                      <label for="visualizarfornecedoresNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>EXCLUIR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirfornecedores == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="excluirfornecedores" id="excluirfornecedoresSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.excluirfornecedores != 1 ? true : false} />
                      <label for="excluirfornecedoresSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirfornecedores == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="excluirfornecedores" id="excluirfornecedoresNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.excluirfornecedores == 1 ? true : false} />
                      <label for="excluirfornecedoresNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>
            </div>

            {/* ############## */}
            <div style={{ borderStyle: 'solid', borderWidth: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 10, marginTop: 30, flexGrow: 1, minWidth: 250, maxWidth: 250, borderRadius: 0, backgroundColor: '#f3f3f3' }}>
              <ContainerInput>
                <label style={{ color: '#174c4f', width: '100%', fontWeight: 'bold' }}>COLABORADORES</label>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>CRIAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluircolaboradores == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="incluircolaboradores" id="incluircolaboradoresSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.incluircolaboradores != 1 ? true : false} />
                      <label for="incluircolaboradoresSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluircolaboradores == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="incluircolaboradores" id="incluircolaboradoresNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.incluircolaboradores == 1 ? true : false} />
                      <label for="incluircolaboradoresNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>ALTERAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarcolaboradores == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="alterarcolaboradores" id="alterarcolaboradoresSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.alterarcolaboradores != 1 ? true : false} />
                      <label for="alterarcolaboradoresSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarcolaboradores == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="alterarcolaboradores" id="alterarcolaboradoresNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.alterarcolaboradores == 1 ? true : false} />
                      <label for="alterarcolaboradoresNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>LISTAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarcolaboradores == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="visualizarcolaboradores" id="visualizarcolaboradoresSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.visualizarcolaboradores != 1 ? true : false} />
                      <label for="visualizarcolaboradoresSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarcolaboradores == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="visualizarcolaboradores" id="visualizarcolaboradoresNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.visualizarcolaboradores == 1 ? true : false} />
                      <label for="visualizarcolaboradoresNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>EXCLUIR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluircolaboradores == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="excluircolaboradores" id="excluircolaboradoresSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.excluircolaboradores != 1 ? true : false} />
                      <label for="excluircolaboradoresSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluircolaboradores == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="excluircolaboradores" id="excluircolaboradoresNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.excluircolaboradores == 1 ? true : false} />
                      <label for="excluircolaboradoresNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>
            </div>

            {/* ############## */}
            <div style={{ borderStyle: 'solid', borderWidth: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 10, marginTop: 30, flexGrow: 1, minWidth: 250, maxWidth: 250, borderRadius: 0, backgroundColor: '#f3f3f3' }}>
              <ContainerInput>
                <label style={{ color: '#174c4f', width: '100%', fontWeight: 'bold' }}>CONTRATOS</label>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>CRIAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluircontratos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="incluircontratos" id="incluircontratosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.incluircontratos != 1 ? true : false} />
                      <label for="incluircontratosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluircontratos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="incluircontratos" id="incluircontratosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.incluircontratos == 1 ? true : false} />
                      <label for="incluircontratosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>ALTERAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarcontratos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="alterarcontratos" id="alterarcontratosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.alterarcontratos != 1 ? true : false} />
                      <label for="alterarcontratosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarcontratos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="alterarcontratos" id="alterarcontratosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.alterarcontratos == 1 ? true : false} />
                      <label for="alterarcontratosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>LISTAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarcontratos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="visualizarcontratos" id="visualizarcontratosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.visualizarcontratos != 1 ? true : false} />
                      <label for="visualizarcontratosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarcontratos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="visualizarcontratos" id="visualizarcontratosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.visualizarcontratos == 1 ? true : false} />
                      <label for="visualizarcontratosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>EXCLUIR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluircontratos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="excluircontratos" id="excluircontratosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.excluircontratos != 1 ? true : false} />
                      <label for="excluircontratosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluircontratos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="excluircontratos" id="excluircontratosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.excluircontratos == 1 ? true : false} />
                      <label for="excluircontratosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>
            </div>

            {/* ############## */}
            <div style={{ borderStyle: 'solid', borderWidth: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 10, marginTop: 30, flexGrow: 1, minWidth: 250, maxWidth: 250, borderRadius: 0, backgroundColor: '#f3f3f3' }}>
              <ContainerInput>
                <label style={{ color: '#174c4f', width: '100%', fontWeight: 'bold' }}>MENSAGENS</label>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>CRIAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirmensagens == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="incluirmensagens" id="incluirmensagensSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.incluirmensagens != 1 ? true : false} />
                      <label for="incluirmensagensSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirmensagens == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="incluirmensagens" id="incluirmensagensNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.incluirmensagens == 1 ? true : false} />
                      <label for="incluirmensagensNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>ALTERAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarmensagens == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="alterarmensagens" id="alterarmensagensSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.alterarmensagens != 1 ? true : false} />
                      <label for="alterarmensagensSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarmensagens == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="alterarmensagens" id="alterarmensagensNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.alterarmensagens == 1 ? true : false} />
                      <label for="alterarmensagensNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>LISTAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarmensagens == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="visualizarmensagens" id="visualizarmensagensSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.visualizarmensagens != 1 ? true : false} />
                      <label for="visualizarmensagensSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarmensagens == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="visualizarmensagens" id="visualizarmensagensNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.visualizarmensagens == 1 ? true : false} />
                      <label for="visualizarmensagensNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>EXCLUIR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirmensagens == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="excluirmensagens" id="excluirmensagensSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.excluirmensagens != 1 ? true : false} />
                      <label for="excluirmensagensSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirmensagens == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="excluirmensagens" id="excluirmensagensNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.excluirmensagens == 1 ? true : false} />
                      <label for="excluirmensagensNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>
            </div>

            {/* ############## */}
            <div style={{ borderStyle: 'solid', borderWidth: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 10, marginTop: 30, flexGrow: 1, minWidth: 250, maxWidth: 250, borderRadius: 0, backgroundColor: '#f3f3f3' }}>
              <ContainerInput>
                <label style={{ color: '#174c4f', width: '100%', fontWeight: 'bold' }}>AVISOS</label>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>CRIAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluiravisos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="incluiravisos" id="incluiravisosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.incluiravisos != 1 ? true : false} />
                      <label for="incluiravisosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluiravisos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="incluiravisos" id="incluiravisosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.incluiravisos == 1 ? true : false} />
                      <label for="incluiravisosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>ALTERAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alteraravisos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="alteraravisos" id="alteraravisosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.alteraravisos != 1 ? true : false} />
                      <label for="alteraravisosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alteraravisos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="alteraravisos" id="alteraravisosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.alteraravisos == 1 ? true : false} />
                      <label for="alteraravisosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>LISTAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizaravisos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="visualizaravisos" id="visualizaravisosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.visualizaravisos != 1 ? true : false} />
                      <label for="visualizaravisosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizaravisos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="visualizaravisos" id="visualizaravisosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.visualizaravisos == 1 ? true : false} />
                      <label for="visualizaravisosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>EXCLUIR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluiravisos == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="excluiravisos" id="excluiravisosSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.excluiravisos != 1 ? true : false} />
                      <label for="excluiravisosSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluiravisos == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="excluiravisos" id="excluiravisosNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.excluiravisos == 1 ? true : false} />
                      <label for="excluiravisosNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>
            </div>

            {/* ############## */}
            <div style={{ borderStyle: 'solid', borderWidth: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 10, marginTop: 30, flexGrow: 1, minWidth: 250, maxWidth: 250, borderRadius: 0, backgroundColor: '#f3f3f3' }}>
              <ContainerInput>
                <label style={{ color: '#174c4f', width: '100%', fontWeight: 'bold' }}>FINANCEIRO</label>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>CRIAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirfinanceiro == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="incluirfinanceiro" id="incluirfinanceiroSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.incluirfinanceiro != 1 ? true : false} />
                      <label for="incluirfinanceiroSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.incluirfinanceiro == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="incluirfinanceiro" id="incluirfinanceiroNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.incluirfinanceiro == 1 ? true : false} />
                      <label for="incluirfinanceiroNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>ALTERAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarfinanceiro == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="alterarfinanceiro" id="alterarfinanceiroSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.alterarfinanceiro != 1 ? true : false} />
                      <label for="alterarfinanceiroSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.alterarfinanceiro == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="alterarfinanceiro" id="alterarfinanceiroNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.alterarfinanceiro == 1 ? true : false} />
                      <label for="alterarfinanceiroNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>LISTAR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarfinanceiro == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="visualizarfinanceiro" id="visualizarfinanceiroSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.visualizarfinanceiro != 1 ? true : false} />
                      <label for="visualizarfinanceiroSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.visualizarfinanceiro == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="visualizarfinanceiro" id="visualizarfinanceiroNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.visualizarfinanceiro == 1 ? true : false} />
                      <label for="visualizarfinanceiroNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>

              <ContainerInput>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderStyle: 'solid', borderWidth: 1, padding: 5, marginTop: 15, borderRadius: 0, backgroundColor: '#174c4f' }}>
                  <label style={{ borderStyle: 'solid', borderRightWidth: 1, padding: 5, width: '60%', color: '#fff' }}>EXCLUIR</label>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '40%', marginLeft: 20 }}>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirfinanceiro == 0 ? '#75b775' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderBottomWidth: 0 }}>
                      <input type="radio" name="excluirfinanceiro" id="excluirfinanceiroSim" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={0} checked={formValues.excluirfinanceiro != 1 ? true : false} />
                      <label for="excluirfinanceiroSim" style={{ cursor: 'pointer', color: '#fff' }}>Sim</label>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', backgroundColor: formValues.excluirfinanceiro == 1 ? '#f77d7d' : '#174c4f', width: '100%', borderRadius: 0, borderStyle: 'solid', borderWidth: 1, padding: 3, justifyContent: 'center', borderTopWidth: 0 }}>
                      <input type="radio" name="excluirfinanceiro" id="excluirfinanceiroNao" style={{ cursor: 'pointer', opacity: 0, position: 'absolute' }} onChange={handleInputChange} value={1} checked={formValues.excluirfinanceiro == 1 ? true : false} />
                      <label for="excluirfinanceiroNao" style={{ cursor: 'pointer', color: '#fff' }}>Não</label>
                    </span>
                  </div>
                </div>
              </ContainerInput>
            </div>
          </div>
          <Stack spacing={2} direction="row" className='mt-3'>
            <Button className='w-full' variant="contained" color="success" type='submit'>Salvar</Button>
          </Stack>
        </form>
      </div>
    );
  }
}
const ContainerInput = styled.div`
  display: flex;
  alignItems: center;
`