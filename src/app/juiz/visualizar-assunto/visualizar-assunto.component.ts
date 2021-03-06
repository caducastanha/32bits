import { Component, OnInit, Input } from '@angular/core';
import { Assunto } from 'src/app/model/assunto';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../login-module/login.service';

@Component({
  selector: 'app-visualizar-assunto',
  templateUrl: './visualizar-assunto.component.html',
  styleUrls: ['./visualizar-assunto.component.css']
})
export class VisualizarAssuntoComponent implements OnInit {

  @Input()
  assunto;

  constructor(private route: ActivatedRoute, private messageService: MessageService, private router: Router, public login: LoginService) {
    this.assunto = new Assunto(null, null);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] != null) {
        Assunto.get(params['id']).subscribe(resultado => {
          this.assunto = resultado
        });
      }
    });
  }

  cadastrar() {
    this.router.navigate(["main", { outlets: { principal: ['escolher-questao', this.assunto.pk()] } }]);
  }




}
