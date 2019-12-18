import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import Turma from '../model/turma';
import EstudanteTurma from '../model/estudanteTurma';
import Query from '../model/firestore/query';
import { Component } from '@angular/core';
import { Message } from 'primeng//api';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login-module/login.service';
import { PerfilUsuario } from '../model/enums/perfilUsuario';

@Injectable({
  providedIn: 'root'
})

export class TurmaGuard implements CanActivate, CanLoad {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;
  turmaId;
  resultado;

  constructor(private router: Router, private login: LoginService, private messageService: MessageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log("acesso a turma");
    console.log(this.router.url);


    this.turmaId = route.params['turmaId'];

    return new Observable(observer => {
      this.acessoTurma().subscribe(
        retorno => {
          this.resultado = retorno;
          console.log(retorno);
          observer.next(this.resultado);
          observer.complete();
        }
      )
    });
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    console.log('verificando se o usuario pode acessar o modulo!');
    return new Observable(observer => {
      this.acessoTurma().subscribe(
        retorno => {
          this.resultado = retorno;
          console.log(retorno)
        }
      )
    });
  }

  acessoTurma() {
    return new Observable(observer => {
      let usuario = this.login.getUsuarioLogado();
      if (usuario != null && this.turmaId != null) {
        if(usuario.perfil == PerfilUsuario.estudante){
          EstudanteTurma.getAll([new Query("estudanteId", "==", usuario.pk()), new Query("turmaId", "==", this.turmaId)]).subscribe(resultado => {

            if (resultado.length === 0) {
              this.messageService.add({ severity: 'warning', summary: 'Não autorizado', detail: "Apenas pessoas dessa turma tem permissão!" });
  
              observer.next(false);
            } else {
              observer.next(true);
            }
            observer.complete();
          });
        }else{
          Turma.get(this.turmaId).subscribe(turma=>{
            if(turma != undefined){
              if(turma["professorId"] == usuario.pk()){
                observer.next(true);
                
              }else{
                this.messageService.add({ severity: 'warning', summary: 'Não autorizado', detail: "Apenas o professor dessa turma tem permissão!" });
                observer.next(false);
              }
              observer.complete();
            }
          })
        }
        
      } else {
        
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Erro no estudante ou na turma.." });
      }
    });
  }


}