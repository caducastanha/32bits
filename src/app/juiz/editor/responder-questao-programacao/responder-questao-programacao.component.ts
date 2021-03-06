import { Component, OnInit, NgZone, ElementRef, Renderer, ChangeDetectorRef, ApplicationRef, AfterViewInit } from '@angular/core';
import Editor from 'src/app/model/editor';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import PedidoAjuda from 'src/app/model/pedidoAjuda';
import { Util } from 'src/app/model/util';
import { Assunto } from 'src/app/model/assunto';
import { LoginService } from '../../../login-module/login.service';

import ErroEditor from 'src/app/model/erroEditor';

import { FormBuilder } from '@angular/forms';
import Submissao from 'src/app/model/submissao';
import ConsoleEditor from 'src/app/model/consoleEditor';
import ErroServidor from 'src/app/model/errors/erroServidor';
import { ApresentacaoService } from 'src/app/geral-module/apresentacao.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'responder-questao-programacao',
  templateUrl: './responder-questao-programacao.component.html',
  styleUrls: ['./responder-questao-programacao.component.css']
})
export class ResponderQuestaoProgramacao implements OnInit, AfterViewInit {
  
  [x: string]: any;

  assunto;

  consoleEditor:ConsoleEditor;

  pausaIde;
  questao?;
  statusExecucao;
  modoVisualizacao: boolean = false;
  submissao;
  dialogPedirAjuda: boolean = false;
  duvida: string = "";

  observableQuestao:Observable<any>;

  // TODO: mover para um componente próprio
  traceExecucao;


  constructor(private route: ActivatedRoute, public login: LoginService, 
              private router: Router, private apresentacao:ApresentacaoService) {
    this.pausaIde = true;
    this.statusExecucao = "";
    this.consoleEditor = new ConsoleEditor();
    this.observableQuestao = new Observable(observer=>{
      observer.next();
      observer.complete();
    });

    // Para o editor colaborativo
    /*zone.runOutsideAngular(() => {

      window.document.addEventListener('change', this.change.bind(this));

    })*/ 

  }

  ngAfterViewInit(): void {
  
    
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      if (params["assuntoId"] != undefined && params["questaoId"] != undefined) {
        Assunto.get(params["assuntoId"]).subscribe(assunto => {
          this.assunto = assunto;

          if (assunto["questoesProgramacao"] != undefined && assunto["questoesProgramacao"].length > 0) {
            assunto["questoesProgramacao"].forEach(questao => {
              if (questao.id == params["questaoId"]) {
                this.questao = questao;

                
                
                if (this.login.getUsuarioLogado() != null) {
                  Submissao.getRecentePorQuestao(this.questao, this.login.getUsuarioLogado()).subscribe(submissao => {
                    if(submissao != null)
                      this.submissao = submissao;
                    //this.pausaIde = false;
                  })
            
            
                }
              }
            })

            if (this.questao == undefined) {
              throw new Error("Não é possível iniciar o editor sem uma questão.");
            } else {
              this.editorCodigo = Editor.getInstance();


            }
          }
        })
      } else {
        throw new Error("Não é possível iniciar o editor sem uma questão.");
      }
    })

    let estudante = this.login.getUsuarioLogado();
    if (estudante == null) {
      throw new Error("Não é possível executar o código, pois você não está logado."); // TODO: mudar para o message
    }

    //this.salvarAutomaticamente(); # desabilitado temporariamente por questões de performance.

  }

  onEditorError(submissao) {
    this.submissao = this.prepararSubmissao(submissao);
    this.consoleEditor.erroServidor = null;
    this.consoleEditor.submissao = this.submissao;
  }

  onEditorSubmit(submissao) {
    
    this.submissao = this.prepararSubmissao(submissao);
    this.consoleEditor.erroServidor = null;
    this.consoleEditor.submissao = this.submissao;
  }

  onServidorError(erroServidor){
    let erro = ErroServidor.construir(erroServidor);
    this.consoleEditor.erroServidor = erro;
  }

  onVisualization(visualizacao){
    this.modoVisualizacao = visualizacao.modoVisualizacao;
    this.traceExecucao = visualizacao.trace;
  }


  prepararStatus(status) {
    let textoStatus = "<span class='textoStatus'>Status</span> "
    if (!status)
      this.statusExecucao = textoStatus + "<span class='statusErro'>Erro</span>";
    else
      this.statusExecucao = textoStatus + "<span class='statusSucesso'>Sucesso</span>";
  }

  atualizarLinhaEditor(linha) {
    this.editorCodigo.limparCores();
    this.editorCodigo.destacarLinha(linha, "possivelSolucao");
  }

  

  voltarParaModoExecucao() {
    
    this.modoVisualizacao = false;
  }

  pedirAjuda() {
    this.dialogPedirAjuda = true;
  }

  enviarPedidoDeAjuda() {
    let pedidoAjuda = new PedidoAjuda(null, this.submissao, this.duvida, []);

    if (pedidoAjuda.validar()) {
      pedidoAjuda.save().subscribe(resultado => {
        // TODO: usar o message service para mensagem de sucesso
      }, err => {
        // TODO: usar o message service para mensagem de erro
      });
    } else {
      alert('Preencha todos os campos se quiser realizar salvar o planejamento'); // TODO: usar o message service
    }

  }

  listarSubmissao() {
    this.router.navigate(["main", { outlets: { principal: ['estudantes-questao', this.assunto.id, this.questao.id] } }]);
  }


  visualizarCodigoSimilar(questao) {
    this.router.navigate(["main", { outlets: { principal: ['exibir-codigo', questao.id] } }]);
  }

  /*enviarErroEditor() {
    let submissao = this.prepararSubmissao();
    submissao.save().subscribe(submissao => {
      let errorEditor = new ErroEditor(null, submissao.pk());
      errorEditor.save().subscribe(erro => {
        alert("Erro notificado com sucesso. Obrigado!");
      });
    });

  }*/

  /**
   * ngOnChanges é usado pelos child-components para receberem atualização da submissão. No entanto, seu comportamento (disparo de notificações de mudança) não funciona quando apenas um atributo do objeto é alterado.
   * Este método força uma clonagem do objeto, fazendo com que o ngOnChanges detecte que é um novo objeto e assim realize a atualização.
   * @param submissao 
   */
  prepararSubmissao(submissao){
    if(submissao != undefined){
      let _submissaoClone = new Submissao(submissao.pk(), submissao.codigo, submissao.estudante, submissao.questao);
      _submissaoClone["estudanteId"] = submissao.estudanteId;
      _submissaoClone["assuntoId"] = submissao.assuntoId;
      _submissaoClone.data = submissao.data;
      _submissaoClone.erro = submissao.erro;
      _submissaoClone.resultadosTestsCases = submissao.resultadosTestsCases;
      _submissaoClone.saida = submissao.saida;
      return _submissaoClone;
    }

    return null;
  }

  /*change(event){
    event.preventDefault();
    console.log("DOM value changed" ,event);
    console.log("component value", this.elementRef.nativeElement);
    this.zone.run(() => { console.log('Do change detection here');
    //this.cdr.detectChanges();
    if(this.elementRef.nativeElement.querySelectorAll('input')[0].outerHTML === event.target.outerHTML)
    {
        console.log('Inside value updation');
        
        this.customerForm.controls['name'].setValue(event.target.value);
    }
});
    setTimeout(() =>{
        this.cdr.markForCheck();
    })
}*/
}