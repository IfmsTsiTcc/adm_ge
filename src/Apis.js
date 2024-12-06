const URL_BASE = 'https://gesuportelogico.com.br/admin/api/';
const Apis = {
      // LISTAGEM

      // listar permissoes
      urlPermissoes: `${URL_BASE}/Permissoes/read_one`,

      // listar natureza
      urlListarNatureza: `${URL_BASE}natureza/read/`,

      //lista uma conta caixa
      urlListarOneCaixa: `${URL_BASE}conta_caixa/read_one`,

      // listar um representante
      urlListarOnRepresentante: `${URL_BASE}Representantes/Read_one/`,

      // listar clientes
      urlListarClientes: `${URL_BASE}Clientes/Read`,

      // listar mensagens
      urlListarMensagens: `${URL_BASE}mensagens/read`,

      // listar bancos
      urlListarBancos: `${URL_BASE}conta_caixa/read`,

      // listar usuário
      urlListarUser: `${URL_BASE}Usuarios/Read`,

      // listar representantes
      urlListarRepresentantes: `${URL_BASE}Representantes/Read`,

      // listar formas de pagamentos
      urlListarFormasPagamentos: `${URL_BASE}Formaspagamento/Read`,

      // listar sistemas
      urlListarProdutos: `${URL_BASE}Produtos/Read`,

      //listar contratos
      urlListarContratos: `${URL_BASE}Contratos/Read`,

      //listar mensalidades
      urlListarMensalidades: `${URL_BASE}faturamentos/listing`,

      //listar contas a receber
      urlListarContasReceber: `${URL_BASE}faturamentos/receivables`,

      //criar contratos
      urlCadContratos: `${URL_BASE}Contratos/Create`,

      //criar contratos
      urlCadNatureza: `${URL_BASE}Natureza/Create`,

      //criar mensalidade
      urlCadMensalidade: `${URL_BASE}faturamentos/create_mensalidade`,

      //listar ponto
      urlListarPonto: `${URL_BASE}pontoeletronico/read`,

      //listar ponto
      urlListarUsoSistemas: `${URL_BASE}uso_sistemas/search`,

      //listar 1 ponto
      urlListarOnePonto: `${URL_BASE}pontoeletronico/read_one`,

      //listar ponto por usuario
      urlListarPontoUser: `${URL_BASE}pontoeletronico/listing`,

      //listar colaborador
      urlListarColaborador: `${URL_BASE}Colaboradores/read`,


      //listar colaborador
      urlListarOneColaborador: `${URL_BASE}Colaboradores/read_one`,

      //cadastrar baixa
      urlCadBaixa: `${URL_BASE}faturamentos/baixa_parcela`,

      //cadastrar conta caixa
      urlCadContaCaixa: `${URL_BASE}conta_caixa/create`,

      //cadastrar ponto
      urlCadPonto: `${URL_BASE}pontoeletronico/create`,

      //listar um contrato
      urlListarOneContrato: `${URL_BASE}Contratos/Read_one/`,

      // listar cliente por id
      urlListarClienteId: `${URL_BASE}Clientes/Read_one/`,

      // CADASTROS
      // cadastrar clientes
      urlCadCliente: `${URL_BASE}Clientes/Create`,

      // cadastrar usuário
      urlCadUser: `${URL_BASE}Usuarios/Create`,

      // cadastrar cobranca
      urlCadCobranca: `${URL_BASE}faturamentos/create_incomes`,

      // cadastrar produto
      urlCadProduto: `${URL_BASE}Produtos/Create`,

      // cadastrar sistema
      urlCadRepresentante: `${URL_BASE}Representantes/Create`,

      // cadastrar cobrança asaas
      urlCadCobrancaAssas: `${URL_BASE}cobranca/customer_create`,

      // cadastrar colaborador
      urlCadColaborador: `${URL_BASE}Colaboradores/Create`,

      // ALTERAÇÃO
      // alterar permissoes
      urlAlterarPermissoes: `${URL_BASE}/Permissoes/create`,

      // alterar valor do contrato
      urlAjusteValorContrato: `${URL_BASE}/contratos/readjustment`,

      // alterar senha
      urlAlterarSenha: `${URL_BASE}/usuarios/email_change_pw`,

      // alterar senha email
      urlAlterarSenhaEmail: `${URL_BASE}/usuarios/change_pw`,

      // alterar usuário
      urlAlterarUser: `${URL_BASE}Usuarios/Read_one`,

      // alterar clientes
      urlAlterarCcliente: `${URL_BASE}Clientes/Update/`,

      // alterar natureza
      urlAlterarNatureza: `${URL_BASE}Natureza/Update/`,

      // alterar atualização sistemas
      urlAtualizaSistema: `${URL_BASE}atualizacao_sistemas/create`,

      urlAlterarRepresentante: `${URL_BASE}Representantes/Update`,

      // alterar produto
      urlAlterarProduto: `${URL_BASE}Produtos/Update/`,

      // alterar colaborador
      urlAlterarColaborador: `${URL_BASE}Colaboradores/Update`,

      //alterar uma conta caixa
      urlAlterarCaixa: `${URL_BASE}conta_caixa/update`,

      // deletar usuário
      urlDeleteUser: `${URL_BASE}Usuarios/Delete/`,

      //deletar representante
      urlDeleteRepresentante: `${URL_BASE}Representantes/Delete/`,

      // deletar contrato
      urlDeleteContrato: `${URL_BASE}Contratos/Delete/`,

      // alterar contrato
      urlAlterarContrato: `${URL_BASE}Contratos/Update`,

      // deletar cliente
      urlDeleteCliente: `${URL_BASE}Clientes/Delete/`,

      // deletar produto
      urlDeleteProduto: `${URL_BASE}Produtos/Delete/`,

      // deletar produto
      urlDeleteProduto: `${URL_BASE}Produtos/Delete/`,

      // deletar natureza
      urlDeleteNatureza: `${URL_BASE}Natureza/Delete/`,

      //deletar uma conta caixa
      urlDeleteConta: `${URL_BASE}conta_caixa/delete`,

      // deletar colaboradores
      urlDeleteColaboradores: `${URL_BASE}Colaboradores/Delete/`,

      //login
      urlLogin: `${URL_BASE}/Usuarios/login`,

      // BLOQUEIO
      // bloqueio de contrato
      urlBloquearContrato: `${URL_BASE}/contratos/lock`,

      // VERIFICA BLOQUEIO
      urlCheckLock: `${URL_BASE}/contratos/check_lock`,
}
export default Apis;