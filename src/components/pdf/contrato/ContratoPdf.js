import {
  Document,
  Font,
  Page,
  Text,
  Image,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";

import { Download, VpnKeyOff } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import Printer, { print } from "react-pdf-print";
import imagemLogoGe from "../../../img/teste.png";
import Apis from "../../../Apis";
import { useNavigate, useParams } from "react-router-dom";
import { alertaErro } from "../../alertas/Alertas";
const meses = [
  { id: "01", nome: "Janeiro" },
  { id: "02", nome: "Fevereiro" },
  { id: "03", nome: "Março" },
  { id: "04", nome: "Abril" },
  { id: "05", nome: "Maio" },
  { id: "06", nome: "Junho" },
  { id: "07", nome: "Julho" },
  { id: "08", nome: "Agosto" },
  { id: "09", nome: "Setembro" },
  { id: "10", nome: "Outubro" },
  { id: "11", nome: "Novembro" },
  { id: "12", nome: "Dezembro" },
];

const styles = StyleSheet.create({
  body: {
    padding: 40,
  },
  text: {
    fontSize: 12,
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "justify",
  },
  cabecalho: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cabecalhoCard1: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "auto",
    borderColor: "#bfbfbf",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  containerRow: {
    flexDirection: "row",
  },
});

function ContratoPdf() {
  const [contrato, setContrato] = useState();
  const [MesAtualString, setMesAtualString] = useState([]);
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const redirect = useNavigate();
  const parametro = useParams();
  useEffect(() => {
    const handleDados = async () => {
      setMesAtualString(meses.filter((dados) => dados.id == mes));
      setContrato(JSON.parse(localStorage.getItem("contratoPdf")));
      Font.register({
        family: "Times-Roman",
        fontStyle: "normal",
        fontWeight: "normal",
      });
      Font.register({
        family: "Times-Bold",
        fontStyle: "normal",
        fontWeight: "normal",
      });

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id: parametro.id }),
      };

      fetch(Apis.urlListarOneContrato, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setContrato(result.registros[0]);
        })
        .catch((erro) => {
          alertaErro(
            "Falha na requisição, verifique sua conexão e tente novamente!"
          );
          redirect("/");
          console.log(erro);
        });
    };
    handleDados();
  }, []);

  return (
    <PDFViewer
      style={{ width: "100%", maxHeight: "100vh", minHeight: "100vh" }}
    >
      <Document>
        <Page style={styles.body} wrap>
          <View style={styles.cabecalho} fixed>
            <View style={styles.cabecalhoCard1}>
              <Image src={imagemLogoGe} style={{ width: 150 }} />
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 12,
                    fontFamily: "Times-Bold",
                    marginTop: -10,
                  },
                ]}
              >
                WWW.GESISTEMAS.COM
              </Text>
              <Text style={[styles.text, { fontSize: 12 }]}>
                CONTRATO DE LOCAÇÃO
              </Text>
              <Text style={[styles.text, { fontSize: 12 }]}>
                COD {contrato?.numero_contrato}. CLIENTE:{" "}
                {contrato?.cliente.nome}
              </Text>
            </View>
          </View>

          <View
            style={{ position: "absolute", bottom: 20, display: 'flex', justifyContent: 'center', textAlign: "center", width: "100%" }}
            fixed
          >
            <Text
              style={[
                styles.text,
                { fontSize: 9, textAlign: "center", width: "100%" },
              ]}
            >
              Site: www.gesistemas.com - Fone: (67) 3306-9554 / 3306-9557
            </Text>
          </View>

          <View style={styles.container}>
            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Contratante
                </Text>
                : Pessoa Jurídica de direito privado, inscrita no CNPJ nº{" "}
                {contrato?.cliente?.cnpj_cpf} com
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  {" "}
                  sede em {contrato?.cliente?.logradouro},{" "}
                  {contrato?.cliente?.numero} Bairro {contrato?.cliente?.bairro}{" "}
                  CEP {contrato?.cliente?.cep}
                </Text>{" "}
                na Cidade de {contrato?.cliente?.cidade}, Estado do{" "}
                {contrato?.cliente?.uf}, tendo como telefones de contato{" "}
                {contrato?.cliente?.telefone}.
              </Text>
            </View>
            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Contratada: GE SUPORTE LOGICO LTDA - ME
                </Text>{" "}
                pessoa jurídica de direito privado, inscrita no CNPJ nº{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  22.714.341/0001-61
                </Text>
                , representado pelo sócio/gerente{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  ANDRÉ ANDRADE DE CONTI
                </Text>
                inscrito no CPF{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  025.900.241-00
                </Text>
                , com sede na{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Rua Paissandu
                </Text>
                , nº
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  537
                </Text>{" "}
                – Bairro{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Amambaí
                </Text>{" "}
                - CEP:{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  79.005-070
                </Text>{" "}
                – na Cidade de{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Campo Grande
                </Text>
                , Estado de{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Mato Grosso do Sul
                </Text>
                .
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                Os Contratantes têm entre si, justos e Contratados o acordo com
                as cláusulas e condições seguintes:
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  CLÁUSULA PRIMEIRA - DO OBJETO
                </Text>
                o objeto do seguinte contrato é a prestação de serviços por
                parte da CONTRATADA, sendo exclusivos de assistência técnica dos
                softwares por ela instalados nas dependências da CONTRATANTE
                conforme endereço estipulado neste contrato, que incluem a
                liberação da licença de uso, atualizações tecnológicas e fiscais
                do software , assim como treinamento de colaboradores.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={[styles.text, { marginLeft: 30 }]}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Primeiro:
                </Text>
                Este contrato terá duração de meses, iniciando-se em e
                terminando em .
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Segundo
                </Text>
                : Após o término do prazo que se refere este contrato, se houver
                interesse de ambas as partes, o presente contrato se renovará
                automaticamente a cada meses. Caso não haja interesse, a parte
                que quiser rescindir deverá anunciar por escrito com
                antecedência de{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  60 (sessenta)
                </Text>{" "}
                dias do término do contrato, caso seja realizada a quebra do
                contrato independente do motivo o software permanecerá instalado
                nas dependências do CONTRATANTE afim do mesmo poder realizar
                consulta dos seus arquivos e o mesmo fica ciente que o software
                ficará{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  bloqueado
                </Text>{" "}
                para emissão de vendas, ordens de serviços, documentos fiscais
                isentando a CONTRATADA de quaisquer responsabilidades com
                suporte técnico ou responsabilidades fiscais.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Terceiro:
                </Text>
                Caso houver rescisão antecipada de contrato, a parte que
                resolver rescindir o contrato deverá remunerar no valor de 02
                (duas) mensalidades a outra parte a título de multa rescisória.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Cláusula II - da instalação do software:
                </Text>
                a CONTRATANTE está ciente que é de sua inteira responsabilidade
                fornecer e manter em perfeito estado de funcionamento os
                equipamentos, software dos mesmos, impressoras, rede de
                computadores, linha de comunicação com internet e telefone,
                ponto de energia (preferencialmente com no-break) no servidor e
                todos os terminais onde será instalado o software afim da
                CONTRATADA poder executar a instalação e dar suporte técnico.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Primeiro:
                </Text>
                quando a CONTRATANTE solicitar instalação do software em alguma
                de suas filiais, a mesma será tratada como um novo contrato,
                sendo necessário executar todos os processos de instalação,
                treinamento e manutenções, bem como os valores de instalações e
                suporte técnico.
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Cláusula III – da taxa de instalação
                </Text>
                : a CONTRATANTE pagará o valor de referente à taxa de
                instalação, para instalação e treinamento do sistema do sistema
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Cláusula IV - treinamento funcionários / usuários:
                </Text>
                o mesmo será feito nas dependências da CONTRATANTE sendo que a
                mesma deverá designar individuo com maior grau de conhecimento
                em informática sendo o mesmo maior de 18 (dezoito) anos, nos
                horários agendados para receber as instruções de como utilizar o
                software afim do mesmo depois poder transmitir os conhecimentos
                aos seus colegas de trabalho, gerentes e proprietários que não
                participarem do treinamento dado pela CONTRATADA no dia
                combinado por ambas às partes.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Primeiro:
                </Text>
                caso seja necessário a CONTRATADA fornecer um novo treinamento o
                mesmo deve ser solicitado pela CONTRATANTE com tempo hábil de no
                mínimo 05 (cinco) dias úteis e despesas tais como deslocamento,
                hospedagem (com serviço de café da manhã) alimentação (almoço e
                janta), transporte local, ficará por conta da CONTRATANTE caso o
                deslocamento seja mais de 50 km.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Cláusula V - Suporte técnico:
                </Text>
                a CONTRATANTE solicitará a CONTRATADA serviço de suporte técnico
                no horário comercial de segunda a sexta das 08:00hs as 18:00hs e
                aos sábados das 08:00hs as 12:00hs em caso de dúvidas ou
                quaisquer tipo de problemas relacionados ao software em questão,
                sendo que estes atendimentos podem ser via telefone, acesso
                remoto(obrigatório internet funcionar no local da
                instalação),e-mail e quando necessário atendimento presencial no
                local da instalação.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Primeiro:
                </Text>
                as possíveis correções do sistema serão realizadas sem custos
                adicionais.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Segundo:
                </Text>
                desenvolvimentos adicionais serão analisados em sua viabilidade
                técnica com os programadores, assim a CONTRATADA informando a
                CONTRATANTE a viabilidade técnica e quando necessário materiais
                adicionais que deverão ser adquiridos, pois este contrato
                contempla somente o software e não equipamentos e outros
                materiais que venham ser necessários para seu perfeito
                funcionamento.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Terceiro:
                </Text>
                de acordo com as modificações exigidas pelo CONTRATANTE, poderá
                haver custos adicionais a serem combinados, assim como prazo de
                entrega conforme grau de dificuldade da ferramenta a ser
                desenvolvida.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Cláusula VI - dos pagamentos mensais / reajustes / cobranças:
                </Text>
                O valor mensal a ser pago à contratada pela contratante será de
                R$ (Reais), valor este referente a suporte técnico, atualizações
                fiscais, melhorias de sistema, com vencimento no dia 15 (Quinze)
                de cada mês ou o primeiro dia útil imediatamente subseqüente a
                este. A 1º Mensalidade terá vencimento no dia{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  04/4/2023
                </Text>
                .
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Primeiro:
                </Text>
                ficando a CONTRATANTE inadimplente por um período superior a
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  15
                </Text>{" "}
                dias sem previa comunicação ou acordo com a gerência da
                CONTRATADA fica bloqueado o atendimento presencial, liberando
                apenas atendimento de suporte técnico por telefone ou internet.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                Se corridos mais de{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  30 (trinta)
                </Text>{" "}
                dias de inadimplência o sistema será bloqueado por completo até
                a devida quitação das mensalidades em aberto, decorridos mais de{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  60 (sessenta)
                </Text>{" "}
                dias de atraso a CONTRATADA poderá suspender a licença de uso
                deixando o sistema bloqueado apenas para consulta dos arquivos
                da CONTRATANTE a mesma estando ciente que não conseguirá efetuar
                lançamentos tais como vendas, ordens de serviços, documentos
                fiscais, sendo que a CONTRATADA em momento algum tem por
                obrigação efetuar devoluções de pagamentos com instalação ou
                mensalidades até a presente data. Após débitos quitados, (caso
                pagamento sejacom cheque ou boleto é necessário realizar a
                compensação do mesmo) a CONTRATADA tem o prazo de{" "}
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  24 (vinte quatro)
                </Text>{" "}
                horas para liberação do software.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Segundo:
                </Text>
                a mensalidade será devida a partir do 1º vencimento,
                independente da utilização do software por parte da CONTRATANTE.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Terceiro:
                </Text>
                O valor da mensalidade acima referida será reajustado
                anualmente, sempre no mês de maio, Fica instituído o Índice
                Geral de Preço de Mercado – Fundação Getúlio Vargas (IGPM-FGV),
                no caso da impossibilidade do uso do referido índice, o cálculo
                será feito pelos indicadores que vierem a ser adotados pelo
                governo.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Quarto:
                </Text>
                O meio de pagamento será através de boleto bancário
                disponibilizado pela CONTRATANTE ao CONTRATADO em tempo hábil.
                Caso não seja possível fazer o pagamento pelo boleto bancário a
                mensalidade poderá ser feito através de depósito bancário ou
                transferência de numerário na conta da CONTRATADA.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo Quinto:
                </Text>
                As mensalidades em atrasos sofrerão multas e juros de atraso.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Cláusula VII - cópia segurança dos arquivos fiscais e
                  software:
                </Text>
                é de inteira responsabilidade da CONTRATANTE a realização da
                cópia de segurança do software diariamente em pen-drive ou HD
                externo.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Parágrafo primeiro:
                </Text>
                a CONTRATADA cede direito apenas para o uso do sistema no
                endereço acima mencionado, com a liberação de uma cópia por
                estabelecimento, o uso em outro estabelecimento pertencente à
                contratante ou à terceiros, sem a permissão da contratada,
                constituirá crime de PIRATARIA conforme lei de direitos autorais
                lei nº 7646/87.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                <Text style={[styles.text, { fontFamily: "Times-Bold" }]}>
                  Cláusula VIII -
                </Text>
                a CONTRATADA em nenhuma hipótese tem como responsabilidade dar
                manutenção ou qualquer tipo de reparos nos equipamentos de
                informática tais como (CPUs, mouses, teclados, monitores,
                nobreaks, impressoras),assim como linhas telefônicas, redes de
                informática, redes elétricas e assemelhados, sendo de total
                responsabilidade da CONTRATANTE em manter tais equipamentos em
                perfeito funcionamento afim da CONTRATADA poder executar suas
                obrigações.
              </Text>
            </View>

            <View style={styles.containerRow}>
              <Text style={styles.text}>
                Estando assim justas e contratadas as partes, de acordo com as
                cláusulas e condições acima estabelecidas, elegem o foro da
                cidade de Campo Grande para a resolução de quaisquer dúvidas que
                pairam a respeito deste contrato. Assim sendo, assinam o
                presente as partes em duas vias de igual teor.
              </Text>
            </View>

            <View
              style={[
                styles.containerRow,
                { justifyContent: "space-between", marginTop: 50 },
              ]}
            >
              <View
                style={{ border: "dashed", borderTopWidth: 1, width: "35%" }}
              >
                <Text style={[styles.text, { textAlign: "center" }]}>
                  ANDRE ANDRADE DE CONTI
                </Text>
              </View>

              <View
                style={{ border: "dashed", borderTopWidth: 1, width: "50%" }}
              >
                <Text style={[styles.text, { textAlign: "center" }]}>
                  Campo Grande MS, 10 de Março de 2023.
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default ContratoPdf;
