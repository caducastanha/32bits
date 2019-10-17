
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Turma from 'src/app/model/turma';
import EstudanteTurma from 'src/app/model/estudanteTurma';
import { LoginService } from 'src/app/login-module/login.service';
import Query from 'src/app/model/firestore/query';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-visualizar-turma',
  templateUrl: './visualizar-turma.component.html',
  styleUrls: ['./visualizar-turma.component.css']
})
export class VisualizarTurmaComponent implements OnInit {

  turma$?;

  constructor(private route:ActivatedRoute, private router:Router, private login:LoginService){
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      
      if(params["turmaId"] != null){
        this.turma$ = Turma.get(params["turmaId"])
      }else{
        EstudanteTurma.getAll(new Query("estudanteId", "==", this.login.getUsuarioLogado().pk())).subscribe(resultado=>{
          if( resultado.length > 0)
            Turma.getAll(new Query("codigo", "==", resultado[0]["turmaId"])).subscribe(turma=>{
              if(turma.length > 0){
                this.turma$ = new Observable(observer=>{
                  observer.next(turma[0]);
                  observer.complete();
                })
              }
            });
        })
      }
      

    });

  }

  visualizarEstudantes(turma){
    this.router.navigate(["main", { outlets: { principal: ['listagem-estudantes', turma.codigo] } }]);
  }

  
}