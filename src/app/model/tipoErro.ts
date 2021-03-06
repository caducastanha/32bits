export enum TipoErro {
  numeroDecimalComVirgula = 1,
  declaracaoVariavelComDoisIguais = 2,
  espacoNoNomeVariavel = 3,
  variavelNaoDeclarada = 4,
  faltaParentesis = 5,
  faltaVirgulaParametros = 6,
  parDadosComparacao = 7,
  comparacaoApenasUmaIgualdade = 8,
  faltaDoisPontosCondicao = 9,
  faltaDoisPontosFuncao = 10,
  numeroDecimalComVirgulaTexto = "Número decimal com vírgula",
  declaracaoVariavelComDoisIguaisTexto = "Declaração de variável com ==",
  espacoNoNomeVariavelTexto = "Variável com espaço no nome",
  variavelNaoDeclaradaTexto = "Uso de variável não declarada",
  faltaParentesisTexto = "Falta de parêntesis em funções",
  faltaVirgulaParametrosTexto = "Falta de vírgula nos parâmetros",
  parDadosComparacaoTexto = "IF sem um par de dados",
  comparacaoApenasUmaIgualdadeTexto = "IF com apenas um =",
  faltaDoisPontosCondicaoTexto = "Falta dois pontos no IF",
  faltaDoisPontosFuncaoTexto = "Falta dois pontos na função",
  erroServidor = "Problema no servidor."
  
}