import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import Usuario from '../model/usuario';
import { containsElement } from '@angular/animations/browser/src/render/shared';
import { LoginService } from '../login-module/login.service';
import Turma from '../model/turma';


@Injectable({
    providedIn: 'root'
  })

export class AuthGuard implements CanActivate {
    
    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;

  constructor(
    private router: Router,
    private login:LoginService
  ) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<boolean> | boolean{

    
    return this.verificarAcesso();
  }


  verificarAcesso() {
    if (this.login.isUsuarioLogado()) {
      return true;
    }
      this.router.navigate([""]);
      return false;
  }
  
}