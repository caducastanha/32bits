import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { LabelCategoriasErros } from 'src/app/model/errors/enum/labelCategoriasErro';

import { getLabelPorCategoriaNumero } from 'src/app/model/errors/enum/labelCategoriasErro';
import { EscapeHtmlPipe } from 'src/app/pipes/keep-html.pipe';
import ConsoleEditor from 'src/app/model/consoleEditor';
import Submissao from 'src/app/model/submissao';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css'],
  providers:[EscapeHtmlPipe]
})
export class ConsoleComponent{

  @Input()
  submissao:Submissao;

  @Input()
  consoleEditor:ConsoleEditor;

  constructor() { }

  getLabelCategoriaErro(categoria){
    return getLabelPorCategoriaNumero(categoria);
  }

  

}
