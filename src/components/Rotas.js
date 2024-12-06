import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AlterarRepresentante from "./alterar/representante/AlterarRepresentante";
import AlterarCliente from "./alterar/cliente/AlterarCliente";
import AlterarSistema from "./alterar/sistema/AlterarSistema";
import AlterarColaborador from "./alterar/colaborador/AlterarColaborador";
import AlterarContrato from "./alterar/contrato/AlterarContrato";
import CadastrarCliente from "./cadastros/cliente/CadastrarCliente";
import CadastrarColaborador from "./cadastros/colaborador/CadastrarColaborador";
import CadastrarSistema from "./cadastros/sistemas/CadastrarSistema";
import CadastrarRepresentante from "./cadastros/representante/CadastrarRepresentante";
import CadastrarUser from "./cadastros/usuarios/CadastrarUser";
import ListarClientes from "./listar/clientes/ListarClientes";
import ListarUser from "./listar/usuario/ListarUser";
import ListarRepresentantes from "./listar/representantes/ListarRepresentantes";
import ListarSistemas from "./listar/sistemas/ListarSistemas";
import ListarColaborador from "./listar/colaboradores/ListarColaborador";
import ListarContratos from "./listar/contratos/ListarContratos";
import ExcluirCliente from "./exclusao/cliente/ExcluirCliente";
import ExcluirUser from "./exclusao/usuario/ExcluirUser";
import ExcluirRepresentante from "./exclusao/representante/ExcluirRepresentante";
import ExcluirContrato from "./exclusao/contrato/ExcluirContrato";
import Contrato from "./cadastros/contrato/Contrato";
import NotFound from "./NotFound";
import Redirect from "./exclusao/redirect/Redirect";
import Permissoes from "./permissoes/Permissoes";
import Ponto from "./cadastros/ponto/Ponto";
import Home from "./home/Home";
import UsoSistemas from "./listar/usoSistema/UsoSistemas";
import { alertaErro } from "./alertas/Alertas";
import Apis from "../Apis";
import ContratoPdf from "./pdf/contrato/ContratoPdf";
import Notificacoes from "./listar/notificacoes/Notificacoes";
import Natureza from "./listar/natureza/Natureza";
import CadastrarNatureza from "./cadastros/natureza/CadastrarNatureza";
import AlterarNatureza from "./alterar/natureza/AlterarNatureza";
import ContasReceber from "./listar/contasReceber/ContasReceber";
import Cobranca from "./cadastros/cobrança/Cobranca";
import UploadSistemas from "./alterar/uploadSistemas/UploadSistemas";
import Mensalidades from "./listar/mensalidades/Mensalidades";
import ListarReajuste from "./listar/reajuste/ListarReajuste";
import ListaBancos from "./listar/bancos/ListarBancos";
import CadastrarContas from "./cadastros/contas/CadastrarContas";
import AlterarConta from "./alterar/contas/AlterarConta";
import ListarPontos from "./listar/pontos/ListarPontos";
import ListarColaboradorPonto from "./listar/colaboradoresPonto/ListarColaboradorPonto";
import ListarLeads from "./listar/leads/ListarLeads";
import AlterarLead from "./alterar/lead/AlterarLead";
export default function Rotas() {
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
    return (
        // ROTAS
        <Routes>
            {/* pagina não encontrada */}
            <Route path="*" element={<NotFound />} />
            {/* fim pagina não encontrada */}

            {/* alterações */}
            <Route path="/permissoes-user/:id&:nome" element={<Permissoes />} />
            {permissoes[0]?.clientes.alterar == 0 &&
                <Route path="/alterar-cliente/:id" element={<AlterarCliente />} />
            }
            {permissoes[0]?.clientes.alterar == 0 &&
                <Route path="/alterar-lead/:id" element={<AlterarLead />} />
            }
            {permissoes[0]?.colaboradores.alterar == 0 &&
                <Route path="/alterar-colaborador/:id" element={<AlterarColaborador />} />
            }
            <Route path="/alterar-natureza/:id&:descricao&:RD&:conta" element={<AlterarNatureza />} />
            {permissoes[0]?.produtos.alterar == 0 &&
                <Route path="/alterar-sistema/:id&:nome&:versao" element={<AlterarSistema />} />
            }
            {permissoes[0]?.produtos.incluir == 0 &&
                <Route path="/upload-sistemas" element={<UploadSistemas />} />
            }
            {permissoes[0]?.contratos.alterar == 0 &&
                <Route path="/alterar-contrato/:id" element={<AlterarContrato />} />
            }
            {permissoes[0]?.contratos.alterar == 0 &&
                <Route path="/alterar-conta/:id" element={<AlterarConta />} />
            }
            {permissoes[0]?.representantes.alterar == 0 &&
                <Route path="/alterar-representante/:id" element={<AlterarRepresentante />} />
            }
            {/* fim alterações */}

            {/* listagem */}

            <Route path="/contrato-pdf/:id" element={<ContratoPdf />} />

            {permissoes[0]?.contratos.visualizar == 0 &&
                <Route path="/listar-contratos" element={<ListarContratos />} />
            }

            {/* {permissoes[0]?.contratos.visualizar == 0 && */}
            <Route path="/listar-reajuste" element={<ListarReajuste />} />
            {/* } */}

            {permissoes[0]?.contratos.visualizar == 0 &&
                <Route path="/listar-contas-receber" element={<ContasReceber />} />
            }
            {permissoes[0]?.contratos.visualizar == 0 &&
                <Route path="/listar-contas" element={<ListaBancos />} />
            }
            {permissoes[0]?.contratos.visualizar == 0 &&
                <Route path="/listar-mensalidades" element={<Mensalidades />} />
            }
            <Route path="/utilizacao-sistemas" element={<UsoSistemas />} />
            {permissoes[0]?.representantes.visualizar == 0 &&
                <Route path="/listar-representantes" element={<ListarRepresentantes />} />
            }
            {permissoes[0]?.clientes.visualizar == 0 &&
                <Route path="/listar-clientes" element={<ListarClientes />} />
            }
            {permissoes[0]?.colaboradores.visualizar == 0 &&
                <Route path="/listar-user" element={<ListarUser />} />
            }
            {permissoes[0]?.produtos.visualizar == 0 &&
                <Route path="listar-sistemas" element={<ListarSistemas />} />
            }
            {permissoes[0]?.colaboradores.visualizar == 0 &&
                <Route path="/listar-colaboradores" element={<ListarColaborador />} />
            }
            {permissoes[0]?.colaboradores.visualizar == 0 &&
                <Route path="/listar-colaboradores-pronto" element={<ListarColaboradorPonto />} />
            }
            {permissoes[0]?.colaboradores.visualizar == 0 &&
                <Route path="/listar-ponto-colaborador/:id" element={<ListarPontos />} />
            }
            {permissoes[0]?.avisos.visualizar == 0 &&
                <Route path="/listar-avisos" element={<Notificacoes />} />
            }
            
            {permissoes[0]?.avisos.visualizar == 0 &&
                <Route path="/listar-leads" element={<ListarLeads />} />
            }
            <Route path="/listar-natureza" element={<Natureza />} />
            {/* fim listagem */}

            {/* cadastros  */}
            <Route path="/cadastrar-natureza" element={<CadastrarNatureza />} />
            {permissoes[0]?.representantes.incluir == 0 &&
                <Route path="/cadastrar-representantes" element={<CadastrarRepresentante />} />
            }
            {permissoes[0]?.clientes.incluir == 0 &&
                <Route path="/cadastrar-cliente" element={<CadastrarCliente />} />
            }
            {permissoes[0]?.colaboradores.incluir == 0 &&
                <Route path="/cadastrar-user" element={<CadastrarUser />} />
            }
            {permissoes[0]?.produtos.incluir == 0 &&
                <Route path="cadastrar-sistema" element={<CadastrarSistema />} />
            }
            {permissoes[0]?.contratos.incluir == 0 &&
                <Route path="/cadastrar-contrato" element={<Contrato />} />
            }
            {permissoes[0]?.contratos.incluir == 0 &&
                <Route path="/cadastrar-cobranca" element={<Cobranca />} />
            }
            {permissoes[0]?.contratos.incluir == 0 &&
                <Route path="/cadastrar-conta" element={<CadastrarContas />} />
            }
            {permissoes[0]?.colaboradores.incluir == 0 &&
                <Route path="/cadastrar-ponto/:colaborador_id" element={<Ponto />} />
            }
            {permissoes[0]?.colaboradores.incluir == 0 &&
                <Route path="/cadastrar-colaborador" element={<CadastrarColaborador />} />
            }
            {/* fim cadastros  */}

            {/* Home */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* fim home */}

            {/* redirecionar após realizar uma exclusão */}
            <Route path="/excluir-redirect/:url" element={<Redirect />} />
            {/* fim redirecionar após realizar uma exclusão */}
        </Routes>
        // FIM ROTAS
    )
}