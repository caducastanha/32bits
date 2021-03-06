import { Document, Collection, date } from './firestore/document';
import { Observable } from 'rxjs';
import Query from './firestore/query';
import { PerfilUsuario } from './enums/perfilUsuario';
import { sha256 } from 'js-sha256';
import Experiment from './experimento/experiment';
import { Groups } from './experimento/groups';
import EstudanteTurma from './estudanteTurma';
import Turma from './turma';


@Collection("usuarios")
export default class Usuario extends Document {


    @date()
    data;
    nome;
    minutos;
    genero;
    conhecimentoPrevioProgramacao;
    faixaEtaria;
    turma;

    constructor(id, public email, public senha, public perfil: PerfilUsuario, public grupoExperimento: Groups) {
        super(id);

    }

    static getAllEstudantesByTurma(codigoTurma: any) {
        return new Observable<Usuario[]>(observer=>{
            if(codigoTurma != null){

                Usuario.getAll(new Query("codigoTurma", "==", codigoTurma)).subscribe(estudantes=>{
                    if(Array.isArray(estudantes)){
                        estudantes = estudantes.filter(estudante=>{
                            return estudante.perfil == PerfilUsuario.estudante;
                        })

                        observer.next(estudantes);
                        observer.complete();
                    }
                })
            }else{
                observer.error(new Error("É preciso informar o código da turma"));
            }

        })
        
    }

    objectToDocument() {
        let document = super.objectToDocument();
        document["senha"] = sha256(this.senha);

        if (this.turma != undefined && this.turma.codigo != undefined)
            document["codigoTurma"] = this.turma.codigo;

        return document;
    }

    stringfiy() {
        return { id: this.pk(), email: this.email, senha: this.senha, perfil: this.perfil, minutos: this.minutos, grupoExperimento: this.grupoExperimento }
    }

    save(perfil=PerfilUsuario.estudante): Observable<Usuario> {

        return new Observable(observer => {
            Usuario.count().subscribe(contagem => {
                this.grupoExperimento = Experiment.assignToGroup(contagem);
                this.perfil = perfil;
                super.save().subscribe(result => {
                    observer.next(result);
                    observer.complete();
                })
            }, err => {
                observer.error(err);
            })
        })
    }

    /*atualizarTempo(){
        return new Observable(observer=>{
            Usuario.get(this.pk()).subscribe(usuarioLogado=>{
                this.minutos = usuarioLogado["minutos"] + this.minutos;
                this.save().subscribe(resultado=>{
                    observer.next(true);
                    observer.complete();
                }, err=>{
                    observer.error(err);
                })
            }, err=>{
                observer.error(err);
            })
        })
    }*/

    validarLogin() {
        if (this.email != null && this.email != "" && this.senha != null && this.senha != "") {
            return true;
        } else {
            return false;
        }
    }

    validar() {

        return new Observable(observer => {
            this.isEmailCadastrado().subscribe(resultado => {
                if (!resultado) {
                    if (this.email == null || this.email == "" ||
                        this.nome == null || this.nome == "" ||
                        this.senha == null || this.senha == "" ||
                        this.perfil == null || this.perfil <= 0 ||
                        this.conhecimentoPrevioProgramacao == null || this.genero == null ||
                        this.faixaEtaria == null) {
                        observer.error(new Error("É preciso informar todos os dados para efetuar o cadastro."))
                    } else {
                        observer.next(true);
                        observer.complete();
                    }
                } else {
                    observer.error(new Error("Já existe um usuário cadastrado com este e-mail."))
                }
            }, err => {
                observer.error(err);
            })
        })
    }

    static logar(query): Observable<Usuario> {
        return new Observable(observer => {
            let usuario = null;
            Usuario.getAll(query).subscribe(usuarios => {
                if (usuarios.length > 0) {
                    usuario = new Usuario(usuarios[0].id, usuarios[0].email, usuarios[0].senha, usuarios[0].perfil, usuarios[0].grupoExperimento);
                    usuario.minutos = 0;

                    observer.next(usuario);
                } else {
                    observer.next(null);

                }
                observer.complete();
            }, err => {
                observer.error(err);
            })
        })
    }


    isEmailCadastrado() {
        return new Observable(observer => {
            if (this.email != null) {
                Usuario.getAll(new Query("email", "==", this.email)).subscribe(usuarios => {
                    if (usuarios.length == 1) {
                        observer.next(true);
                    } else {
                        observer.next(false);
                    }

                    observer.complete();
                });
            } else {
                observer.error(new Error("É preciso informar um e-mail válido."))
            }

        })

    }







}