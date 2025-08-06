import { Component } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { IonicPage, ViewController, NavParams } from "ionic-angular";
import { map, take } from "rxjs/operators";

@IonicPage()
@Component({
  selector: "page-modal-filtros",
  templateUrl: "modal-filtros.html",
})
export class ModalFiltrosPage {
  rotasAtivas: boolean;
  pontosSecaoAtivos: boolean;
  acidentesAtivos: boolean;
  cidadeSelecionada: string;
  origemSelecionada: string;
  origensDisponiveis: string[] = [];
  carregandoOrigens: boolean = true;
  cidadesDisponiveis: string[] = [];
  carregandoCidades: boolean = false;

  onCidadeChangeCallback: (cidade: string) => void;
  onOrigemChangeCallback: (origem: string) => void;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private afd: AngularFirestore
  ) {
    this.rotasAtivas = navParams.get("rotasAtivas");
    this.pontosSecaoAtivos = navParams.get("pontosSecaoAtivos");
    this.acidentesAtivos = navParams.get("acidentesAtivos");
    this.cidadeSelecionada = navParams.get("cidadeSelecionada");
    this.origemSelecionada = navParams.get("origemSelecionada");
    this.onCidadeChangeCallback = navParams.get("onCidadeChange");
    this.onOrigemChangeCallback = navParams.get("onOrigemChange");
    this.carregarOrigensRotas();
  }

  ionViewDidLoad() {
    this.carregarOrigensRotas();
    if (this.pontosSecaoAtivos) {
      this.carregarCidadesPontoSecao();
    }
  }

  carregarCidadesPontoSecao() {
    this.carregandoCidades = true;
    this.afd
      .collection("pontoSecao")
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) =>
          Array.from(
            new Set(
              actions
                .map((_data) => _data.payload.doc.data().nm_mun || "")
                .filter((cidade) => cidade && cidade.trim() !== "")
            )
          )
        )
      )
      .subscribe((cidades) => {
        this.cidadesDisponiveis = [...cidades];
        this.carregandoCidades = false;
      });
  }

  carregarOrigensRotas() {
    this.carregandoOrigens = true;
    this.afd
      .collection("rotas")
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) =>
          Array.from(
            new Set(
              actions
                .map((_data) => _data.payload.doc.data().ORIGEM || "")
                .filter((origem) => origem && origem.trim() !== "")
            )
          )
        )
      )
      .subscribe((origens) => {
        this.origensDisponiveis = [...origens];
        this.carregandoOrigens = false;
      });
  }

  onOrigemChange() {
    if (this.onOrigemChangeCallback) {
      this.onOrigemChangeCallback(this.origemSelecionada);
    }
  }

  onCidadeChange() {
    if (this.pontosSecaoAtivos && this.onCidadeChangeCallback) {
      this.onCidadeChangeCallback(this.cidadeSelecionada);
    }
  }

  onTogglePontosSecao() {
    if (this.pontosSecaoAtivos) {
      this.carregarCidadesPontoSecao();
    }
    if (this.onCidadeChangeCallback) {
      if (!this.pontosSecaoAtivos) {
        this.onCidadeChangeCallback("");
      } else {
        this.onCidadeChangeCallback(this.cidadeSelecionada);
      }
    }
  }

  dismiss() {
    this.viewCtrl.dismiss({
      rotasAtivas: this.rotasAtivas,
      pontosSecaoAtivos: this.pontosSecaoAtivos,
      acidentesAtivos: this.acidentesAtivos,
      cidadeSelecionada: this.cidadeSelecionada,
      origemSelecionada: this.origemSelecionada,
    });
  }
}
