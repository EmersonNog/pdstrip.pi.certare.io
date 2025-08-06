import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  IonicPage,
  ModalController,
  NavController,
  NavParams,
} from "ionic-angular";
import { Constants } from "../../environments/constants";
import { User } from "../../models/user";
import { AssetsJsonProvider } from "../../providers/assets-json/assets-json";
import { UserService } from "../../providers/user/user.service";
import { MapUtil, Position } from "../../util/map.util";
import { AngularFirestore } from "angularfire2/firestore";
import wkt from "wkt";
import * as _ from "lodash";
import { _ParseAST } from "@angular/compiler";
import { _getAngularFireAuth } from "angularfire2/auth";
import { take, map } from "rxjs/operators";
import { ModalFiltrosPage } from "../modal-filtros/modal-filtros";
import { AngularFireDatabase } from "angularfire2/database";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  selected: string = "map";

  @ViewChild("map") mapElement: ElementRef;
  map: any;
  mapUtil: MapUtil;

  user: User = new User();

  acidentes = [];
  pontosSecoes = [];
  rotas = [];

  legendaAcidentes = false;
  legendaRotas = false;

  cidadePontosSecaoSelecionada: string = "Teresina";
  origemSelecionada: string = "";
  origensDisponiveis: string[] = [];

  blocoLegenda = true;
  legendaOcupacao = true;
  legendaGPriorizacao = false;
  legendaApp = false;
  legendaFonte = false;
  legendaIso10 = false;
  legendaIso15 = false;
  legendaEmbaraco = false;
  legendaPotencialAdd = false;

  categorias = [];
  categorizacao = { info: "Tipo ocupação", id: "tipo_ocup" };
  graduacao = null;
  area = { valor1: null, valor2: null, operacao: "entre" };

  cores = {
    terreno: "#00A3EE",
    consolidadoBaixaOcupacao: "#D80351",
    imovelAbandonado: "#3F3F3F",
    naoClassificado: "#F5D908",
    baixa_complexidade: "#00A3EE",
    media_complexidade: "#D80351",
    alta_complexidade: "#3F3F3F",
    sem_embaraco: "#F5D908",
    verdadeiro: "#00FF00",
    falso: "#FF0000",
    valor1: "#FF0000",
    valor2: "#00FF00",
    valor3: "#0000FF",
    valor4: "#333333",
    SIAPA: "#FF0000",
    TRENSURB: "#00FF00",
    PREFEITURA_DE_BELO_HORIZONTE: "#0000FF",
    SPIUNET: "#333333",
    linhaPlanejada: "#929292",
    linha: "#3F3F3F",
    estacao: "#E91D63",
    faixa1: "#f9a656",
    faixa2: "#b59e73",
    faixa3: "#7d978b",
    faixa4: "#368eaa",
    faixa5: "#0187c0",
    src: "../../assets/icon/noun-metro-station.svg",
  };

  graduacaoMinima;
  graduacaoMaxima;
  colunaGraduacao;

  faixasSetadas = false;

  app;
  iso10;
  iso15;

  faixas = {
    faixa1: "",
    faixa2: "",
    faixa3: "",
    faixa4: "",
    faixa5: "",
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private userService: UserService,
    private provider: AssetsJsonProvider,
    public afd: AngularFirestore,
    private db: AngularFireDatabase
  ) {}

  ionViewCanEnter() {
    this.userService.getUserLocal().then((userID) => {
      if (userID) {
        return true;
      }
      if (userID === null) {
        this.navCtrl.setRoot(Constants.LOGIN_PAGE.name);
      }
    });
  }

  ionViewWillLeave() {
    this.mapUtil.destroy();
  }

  ionViewDidLoad() {
    this.userService.getUserLocal().then((userID) => {
      if (userID) {
        this.db
          .object(`users/${userID}`)
          .valueChanges()
          .pipe(take(1))
          .subscribe((user: any) => {
            this.user = user;
            this.initMap();
          });
      } else {
        this.navCtrl.setRoot(Constants.LOGIN_PAGE.name);
      }
    });
  }

  limiteEstadualAtivo: boolean = false;
  pontosSecaoAtivos: boolean = false;
  rotasAtivas: boolean = false;
  acidentesAtivos: boolean = false;

  togglePontosSecao() {
    if (this.pontosSecaoAtivos) {
      this.carregarPontosSecao();
    } else {
      this.mapUtil.cleanPontosSecao();
    }
  }

  toggleAcidentes() {
    if (this.acidentesAtivos) {
      this.carregarAcidentes();
    } else {
      this.mapUtil.cleanAcidentes();
    }
  }

  toggleRotas() {
    if (this.rotasAtivas) {
      this.carregarRotas();
    } else {
      this.mapUtil.cleanRotas();
    }
  }

  carregarPontosSecao() {
    if (!this.user || !this.user.profile) {
      console.error("Perfil do usuário não carregado corretamente!");
      return;
    }

    const isAdmin = this.user.profile === "admin";

    this.afd
      .collection("pontoSecao")
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) =>
          actions.map((_data) => {
            const data = _data.payload.doc.data();
            const id = _data.payload.doc.id;
            return { ...data, id };
          })
        )
      )
      .subscribe((pontos: any[]) => {
        const lista = pontos
          .filter((p) => !!p.wkt && p.wkt.includes("POINT("))
          .map((p) => {
            try {
              const parsed = wkt.parse(p.wkt);
              if (!parsed || !parsed.coordinates) return null;
              const [lng, lat] = parsed.coordinates;

              return {
                id: p.id,
                lat,
                lng,
                nm_mun: p.nm_mun, // importante!
                title: `Terminal ${p.terminal || "-"}`,
                hierarquia: p.hierarquia,
                terminal: p.terminal,
                demanda_cc: p.demanda_cc,
                demanda_c1: p.demanda_c1,
                route_id: p.route_id,
                stop_name: p.stop_name,
                milepost: p.milepost,
              };
            } catch (e) {
              console.warn("WKT inválido:", p.wkt, e);
              return null;
            }
          })
          .filter(
            (item) =>
              item !== null &&
              (!this.cidadePontosSecaoSelecionada ||
                item.nm_mun === this.cidadePontosSecaoSelecionada)
          );

        this.pontosSecoes = lista;

        this.mapUtil.showPontosSecao(
          this.pontosSecoes,
          this.map,
          this.afd,
          isAdmin
        );
      });
  }

  carregarAcidentes() {
    this.afd
      .collection("acidentes")
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) =>
          actions.map((_data) => {
            const data = _data.payload.doc.data();
            const id = _data.payload.doc.id;
            return { id, ...data };
          })
        )
      )
      .subscribe((acidentes: any[]) => {
        const lista = acidentes
          .filter(
            (acidente) => !!acidente.wkt && acidente.wkt.includes("POINT(")
          )
          .map((acidente) => {
            try {
              const parsed = wkt.parse(acidente.wkt);
              if (!parsed || !parsed.coordinates) return null;
              const [lng, lat] = parsed.coordinates;

              return {
                lat,
                lng,
                name: `Acidente: ${acidente.tipo}`,
                title: `Acidente em ${acidente.rodovia}`,
                icon: "marker-red.png",
                descricao: acidente.descricao,
                data: acidente.data,
                hora: acidente.hora,
                km: acidente.km,
                rodovia: acidente.rodovia,
                sentido: acidente.sentido,
              };
            } catch (e) {
              console.warn("WKT inválido:", acidente.wkt, e);
              return null;
            }
          })
          .filter((item) => item !== null);

        this.acidentes = lista;
        this.mapUtil.showAcidentes(this.acidentes, this.map);
      });
  }

  carregarOrigensRotas(): Promise<string[]> {
    return this.afd
      .collection("rotas")
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) => {
          const origens = actions
            .map((_data) => {
              const data = _data.payload.doc.data();
              return data.ORIGEM || "";
            })
            .filter((origem) => origem && origem.trim() !== "");
          // Remove duplicadas
          return Array.from(new Set(origens));
        })
      )
      .toPromise(); // Se der erro aqui, o modal não abre!
  }

  carregarRotas() {
    const isAdmin = this.user.profile === "admin";

    this.afd
      .collection("rotas")
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) =>
          actions.map((_data) => {
            const data = _data.payload.doc.data();
            const id = _data.payload.doc.id;
            return { id, ...data };
          })
        )
      )
      .subscribe((rotas: any[]) => {
        const lista = rotas
          .filter((r) => !!r.wkt && r.wkt.includes("LINESTRING"))
          .map((r) => {
            try {
              const parsed = wkt.parse(r.wkt);
              if (
                !parsed ||
                !parsed.coordinates ||
                parsed.type !== "LineString"
              )
                return null;
              const path = parsed.coordinates.map((coord) => ({
                lat: coord[1],
                lng: coord[0],
              }));
              return { ...r, path };
            } catch (e) {
              console.warn("WKT inválido:", r.wkt, e);
              return null;
            }
          })
          .filter((item) => item !== null);

        this.rotas = lista;

        const origensSet = new Set<string>();

        this.rotas.forEach((r) => {
          if (r.ORIGEM && r.ORIGEM.trim()) origensSet.add(r.ORIGEM.trim());
        });
        this.origensDisponiveis = Array.from(origensSet).sort();

        // --- O PULO DO GATO: Filtra pelas rotas da origem selecionada
        let rotasParaDesenhar = this.rotas;
        if (this.origemSelecionada && this.origemSelecionada.trim() !== "") {
          rotasParaDesenhar = rotasParaDesenhar.filter(
            (rota) => rota.ORIGEM === this.origemSelecionada
          );
        }

        // Limpa as linhas antigas antes de desenhar as novas
        this.mapUtil.cleanRotas();

        // Desenha as rotas filtradas no mapa
        rotasParaDesenhar.forEach((rota) =>
          this.mapUtil.addLinha(
            rota.path,
            this.map,
            rota.color || "#009688",
            rota,
            this.afd,
            isAdmin
          )
        );
      });
  }

  filtrarRotasPorOrigem() {
    const isAdmin = this.user.profile === "admin";
    this.mapUtil.cleanRotas();

    let rotasFiltradas = this.rotas;
    if (this.origemSelecionada && this.origemSelecionada !== "") {
      rotasFiltradas = this.rotas.filter(
        (r) => r.ORIGEM === this.origemSelecionada
      );
    }

    rotasFiltradas.forEach((rota) =>
      this.mapUtil.addLinha(
        rota.path,
        this.map,
        rota.color || "#009688",
        rota,
        this.afd,
        isAdmin
      )
    );
  }

  resetarLegendas() {
    this.legendaOcupacao = false;
    this.legendaGPriorizacao = false;
    this.legendaApp = false;
    this.legendaFonte = false;
    this.legendaIso10 = false;
    this.legendaIso15 = false;
    this.legendaEmbaraco = false;
    this.legendaPotencialAdd = false;
    this.legendaAcidentes = false;
    this.legendaRotas = false;
  }

  mudarLegenda(tipoLegenda) {
    this.blocoLegenda = true;
    switch (tipoLegenda) {
      case "acidentes":
        this.resetarLegendas();
        this.legendaAcidentes = true;
        break;

      case "rotas":
        this.resetarLegendas();
        this.legendaRotas = true;
        break;

      case "tipo_ocup":
        this.legendaOcupacao = true;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
      case "g_priorizacao":
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = true;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
      case "app":
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = true;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
      case "fonte":
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = true;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
      case "iso_10":
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = true;
        this.legendaIso15 = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
      case "iso_15":
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = true;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
      case "comp_emb":
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        this.legendaEmbaraco = true;
        this.legendaPotencialAdd = false;
        break;
      case "potencial_add":
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = true;
        break;
      default:
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        this.blocoLegenda = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
    }
  }

  converterTeste() {
    this.provider.getJsonTeste().subscribe((data) => {
      let arr = [];

      for (var i in data) {
        arr.push(data[i]);
      }

      console.log(arr);

      arr.forEach((item, idx) => {
        console.log("enviando arquivo " + idx);
        const id = this.afd.createId();
        item.id = id;
        this.afd
          .doc(Constants.PATH_DOCUMENTS_BUFFER_LINHAS + item.id)
          .set(JSON.parse(JSON.stringify(item)));
      });
    });
  }

  calcularGraduacao(imovel, coluna) {
    if (coluna !== this.colunaGraduacao) {
      this.colunaGraduacao = coluna;
      this.graduacaoMaxima = null;
      this.graduacaoMinima = null;
      this.faixasSetadas = false;
    }

    if (!_.get(imovel, coluna)) {
      _.set(imovel, coluna, 0);
    }

    const diferencaFator = (this.graduacaoMaxima - this.graduacaoMinima) / 5;

    const fator = _.get(imovel, coluna) / this.graduacaoMaxima;

    if (!this.faixasSetadas) {
      this.faixasSetadas = true;
      this.faixas = {
        faixa1:
          this.graduacaoMinima.toFixed(0) +
          " ~ " +
          (this.graduacaoMinima + diferencaFator).toFixed(0),
        faixa2:
          (this.graduacaoMinima + diferencaFator).toFixed(0) +
          " ~ " +
          (this.graduacaoMinima + diferencaFator * 2).toFixed(0),
        faixa3:
          (this.graduacaoMinima + diferencaFator * 2).toFixed(0) +
          " ~ " +
          (this.graduacaoMinima + diferencaFator * 3).toFixed(0),
        faixa4:
          (this.graduacaoMinima + diferencaFator * 3).toFixed(0) +
          " ~ " +
          (this.graduacaoMinima + diferencaFator * 4).toFixed(0),
        faixa5:
          (this.graduacaoMinima + diferencaFator * 4).toFixed(0) +
          " ~ " +
          this.graduacaoMaxima.toFixed(0),
      };
    }

    const valor = _.get(imovel, coluna);

    if (valor < this.graduacaoMinima + diferencaFator) {
      return "#f9a656";
    } else if (valor < this.graduacaoMinima + 2 * diferencaFator) {
      return "#b59e73";
    } else if (valor < this.graduacaoMinima + 3 * diferencaFator) {
      return "#7d978b";
    } else if (valor < this.graduacaoMinima + 4 * diferencaFator) {
      return "#368eaa";
    } else {
      return "#0187c0";
    }
  }

  async openModalFiltros() {
    try {
      const modal = this.modalCtrl.create(ModalFiltrosPage, {
        rotasAtivas: this.rotasAtivas,
        pontosSecaoAtivos: this.pontosSecaoAtivos,
        acidentesAtivos: this.acidentesAtivos,
        cidadeSelecionada: this.cidadePontosSecaoSelecionada,
        origemSelecionada: this.origemSelecionada || "",
        onCidadeChange: (novaCidade) => {
          this.cidadePontosSecaoSelecionada = novaCidade;
          this.mapUtil.cleanPontosSecao();
          if (this.pontosSecaoAtivos && novaCidade) {
            this.carregarPontosSecao();
          }
        },
        onOrigemChange: (novaOrigem) => {
          this.origemSelecionada = novaOrigem;
          this.mapUtil.cleanRotas();
          if (this.rotasAtivas) {
            this.carregarRotas();
          }
        },
      });

      modal.onDidDismiss((data) => {
        if (data) {
          this.rotasAtivas = data.rotasAtivas;
          this.pontosSecaoAtivos = data.pontosSecaoAtivos;
          this.acidentesAtivos = data.acidentesAtivos;
          this.cidadePontosSecaoSelecionada = data.cidadeSelecionada;
          this.origemSelecionada = data.origemSelecionada;
          this.toggleRotas();
          this.togglePontosSecao();
          this.toggleAcidentes();
        }
      });

      modal.present();
    } catch (e) {
      console.error("Erro ao carregar origens:", e);
      alert("Erro ao carregar as opções de origem. Tente novamente.");
    }
  }

  filtrar(
    filtro = {
      estacoes: { ativo: true },
      imoveis: {
        ativo: true,
        ufs: [],
        municipios: [],
        bairros: [],
        tiposOcupacoes: [],
        tiposSetores: [],
        fontes: [],
        categorias: [],
        categorizacao: null,
        graduacao: null,
        area: {
          valor1: null,
          valor2: null,
          operacao: null,
        },
        app: null,
        iso10: null,
        iso15: null,
      },
      linhas: { ativo: true },
      linhasPlanejadas: { ativo: true },
      bufferEstacoes: { ativo: false },
      bufferLinhas: { ativo: false },
      areaCaminhavel: { ativo: false },
    }
  ) {
    this.mapUtil.cleanMarkers();
    this.mapUtil.cleanPolylines();
    this.mapUtil.cleanPolygons();
  }

  private initMap(route = undefined) {
    const mapInstance = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: -19.9, lng: -43.9 },
      zoom: 7,
    });

    this.map = mapInstance;
    this.mapUtil = new MapUtil(mapInstance);

    this.mapUtil.cleanMarkers();
    this.mapUtil.cleanPolylines();

    let data = [];
    this.afd
      .collection("piaui")
      .doc("piaui")
      .valueChanges()
      .pipe(take(1))
      .subscribe((data: any) => {
        if (!data || !data.wkt) return;

        try {
          const parsed = wkt.parse(data.wkt);

          if (parsed.type !== "Polygon") {
            console.warn("Tipo de geometria não suportado:", parsed.type);
            return;
          }

          const polygonCoords = parsed.coordinates[0].map(
            (coord: number[]) => ({
              lat: coord[1],
              lng: coord[0],
            })
          );

          const polygon = new google.maps.Polygon({
            paths: polygonCoords,
            strokeColor: "red",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillOpacity: 0,
          });

          polygon.setMap(this.map);
          this.limiteEstadualAtivo = true;
          const bounds = new google.maps.LatLngBounds();
          polygonCoords.forEach((c) => bounds.extend(c));
          this.map.fitBounds(bounds);
        } catch (e) {
          console.error("Erro ao interpretar WKT do Piauí:", e);
        }
      });

    this.mapUtil.setCenter("MG", this.map);
  }
}
