import { Component } from "@angular/core";
import { DateTime, IonicPage, NavController, NavParams } from "ionic-angular";
import { Constants } from "../../environments/constants";
import { User } from "../../models/user";
import { UserService } from "../../providers/user/user.service";
import * as Papa from "papaparse";
import { DateUtil } from "../../util/date.util";
import { GenericComponentsProvider } from "../../providers/generic-components/generic-components";
import { Estrada } from "../../models/estrada";
import { EstradaProvider } from "../../providers/estrada/estrada";
import { AcidentesProvider } from "../../providers/acidentes/acidentes";
import { RotasProvider } from "../../providers/rotas/rotas";
import { PontoSecaoProvider } from "../../providers/ponto-secao/ponto-secao";

export interface Rota {
  ROUTE_ID: string;
  ORIGEM: string;
  DESTINO: string;
  LIGACAO: string;
  SENTIDO: string;
  ROTA_ID_SI: string;
  TNW_CC: number;
  TNW_C1: number;
  NV_DU_CC: number;
  NV_DU_C1: number;
  HEADWAY_CC: number;
  HEADWAY_C1: number;
  TARIFA_CHE: number;
  HIERARQUIA: string;
  PROPOSTA_1: string;
  PROPOSTA_2: string;
  ID_DIMEN: string;
  N_SECOES: number;
  DEMANDA_CC: number;
  DEMANDA_C1: number;
  EXT_KM: number;
  Servico: string;
  wkt?: string;
}

@IonicPage()
@Component({
  selector: "page-import-csv",
  templateUrl: "import-csv.html",
})
export class ImportCsvPage {
  static TYPES = {
    ROTAS: "rotas",
    PONTO_SECAO: "pontoSecao",
    ACIDENTES: "acidentes",

    DEFENSAS: "defensas",
    FAIXA_DOMINIO: "faixaDeDominio",
    FISCALIZACAO_ELETRONICA: "fiscalizacaoEletronica",
    LIMITE_MUNICIPIO: "limiteMunicipio",
    PONTE: "ponte",
    PORTICO: "portico",
    SEMIPORTICO: "semiPortico",
    SINALIZACAO_HORIZONTAL: "sinalizacaoHorizontal",
    SRE: "sre",
    ESTRADAS: "estradas",
  };

  list: any[];
  isCarregado = false;
  filename;
  type;
  // dateTime_ = new Date();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private genericComponents: GenericComponentsProvider,
    private estradaProvider: EstradaProvider,
    private userService: UserService,
    private acidentesProvider: AcidentesProvider,
    private rotasProvider: RotasProvider,
    private pontoSecaoProvider: PontoSecaoProvider
  ) {
    console.log(this.type);
  }

  ionViewCanEnter() {
    this.userService.getUserLocal().then((userID) => {
      this.userService
        .byId(userID)
        .take(1)
        .subscribe((_user) => {
          let user = new User(_user);

          if (user.isAdmin()) {
            return true;
          } else {
            this.navCtrl.setRoot(Constants.HOME_PAGE.name);
          }
        });

      if (userID === null) {
        this.navCtrl.setRoot(Constants.LOGIN_PAGE.name);
      }
    });
  }

  ionViewDidLoad() {}

  saveFirebase() {
    this.genericComponents
      .showConfirm(
        "Enviar para o banco",
        "Deseja fazer o upload do arquivo " +
          this.filename.name +
          " para o banco de dados?",
        () => {
          console.log("sim");

          console.log(this.filename);
          console.log(this.type);
          console.log(this.list);

          if (this.type && this.list && this.list.length > 0) {
            switch (this.type) {
              case ImportCsvPage.TYPES.ROTAS:
                this.rotasProvider.save(this.list);
                break;

              case ImportCsvPage.TYPES.PONTO_SECAO:
                this.pontoSecaoProvider.save(this.list);
                break;

              case ImportCsvPage.TYPES.ACIDENTES:
                this.acidentesProvider.save(this.list);
                break;

              default:
                break;
            }
          }
        }
      )
      .present();
  }

  uploadFile(files, type: string) {
    this.type = type;
    // let fileContent: any = '';
    const fileInput = files[0];
    const fullName = fileInput.name.split(".");

    let step: number = 0;
    let arr = [];

    if (fullName[fullName.length - 1] === "csv") {
      this.isCarregado = false;

      Papa.parse(fileInput, {
        encoding: "utf-8",
        newline: "\n",
        delimiter: ";",

        step: (results, parser) => {
          if (step && type === ImportCsvPage.TYPES.PONTO_SECAO) {
            const linha = results.data[0];
            const pontoSecao = this.generatePontoSecao(linha);
            arr.push(pontoSecao);
          }

          if (step && type === ImportCsvPage.TYPES.ROTAS) {
            const linha = results.data[0];
            const rota = this.generateRota(linha);
            arr.push(rota);
          }

          if (step && type === ImportCsvPage.TYPES.ACIDENTES) {
            const linha = results.data[0];
            const acidente = this.generateAcidente(linha);
            arr.push(acidente);
          }

          step++;
        },

        complete: (results, _file) => {
          this.filename = _file;
          console.log("file to upload: ", _file);
          console.log("type: ", type);
          console.log("arr", arr[0]);

          this.list = arr;
          this.isCarregado = true;
        },
      });
    }
  }

  generatePontoSecao(linha): any {
    return {
      id: this.getColumn(linha, 0),
      route_id: this.getColumn(linha, 1),
      milepost: this.getColumn(linha, 2),
      stop_name: this.getColumn(linha, 3),
      terminal: this.getColumn(linha, 4),
      hierarquia: this.getColumn(linha, 5),
      demanda_cc: this.convertStrBrToNumber(this.getColumn(linha, 6)),
      demanda_c1: this.convertStrBrToNumber(this.getColumn(linha, 7)),
      wkt: this.getColumn(linha, 8),
      nm_mun: this.getColumn(linha, 9),
    };
  }

  generateAcidente(linha): any {
    return {
      data: this.getColumn(linha, 0),
      hora: this.getColumn(linha, 1),
      rodovia: this.getColumn(linha, 2),
      km: this.convertStrBrToNumber(this.getColumn(linha, 3)),
      sentido: this.getColumn(linha, 4),
      tipo: this.getColumn(linha, 5),
      descricao: this.getColumn(linha, 6),
      wkt: this.getColumn(linha, 7), // exemplo: "POINT(-42.78 -5.10)"
    };
  }

  generateRota(linha): Rota {
    return {
      ROUTE_ID: this.getColumn(linha, 0),
      ORIGEM: this.getColumn(linha, 1),
      DESTINO: this.getColumn(linha, 2),
      LIGACAO: this.getColumn(linha, 3),
      SENTIDO: this.getColumn(linha, 4),
      ROTA_ID_SI: this.getColumn(linha, 5),
      TNW_CC: this.convertStrBrToNumber(this.getColumn(linha, 6)),
      TNW_C1: this.convertStrBrToNumber(this.getColumn(linha, 7)),
      NV_DU_CC: this.convertStrBrToNumber(this.getColumn(linha, 8)),
      NV_DU_C1: this.convertStrBrToNumber(this.getColumn(linha, 9)),
      HEADWAY_CC: this.convertStrBrToNumber(this.getColumn(linha, 10)),
      HEADWAY_C1: this.convertStrBrToNumber(this.getColumn(linha, 11)),
      TARIFA_CHE: this.convertStrBrToNumber(this.getColumn(linha, 12)),
      HIERARQUIA: this.getColumn(linha, 13),
      PROPOSTA_1: this.getColumn(linha, 14),
      PROPOSTA_2: this.getColumn(linha, 15),
      ID_DIMEN: this.getColumn(linha, 16),
      N_SECOES: this.convertStrBrToNumber(this.getColumn(linha, 17)),
      DEMANDA_CC: this.convertStrBrToNumber(this.getColumn(linha, 18)),
      DEMANDA_C1: this.convertStrBrToNumber(this.getColumn(linha, 19)),
      EXT_KM: this.convertStrBrToNumber(this.getColumn(linha, 20)),
      Servico: this.getColumn(linha, 21),
      wkt: this.getColumn(linha, 22),
    };
  }

  getColumn(linha: string[], index: number) {
    if (linha && index < linha.length) {
      return linha[index].trim();
    }

    return "";
  }

  convertDate(data: string, hora: string) {
    let date: Date = undefined;

    if (this.isDateAmerican(data)) {
      const split = data.split("/");

      const anoStr = split[0];
      const mesStr = split[1];
      const diaStr = split[2];

      const ano = parseInt(anoStr);
      const mes = parseInt(mesStr) - 1;
      const dia = parseInt(diaStr);

      date = new Date(ano, mes, dia);
    } else if (this.isDateBrazil(data)) {
      const split = data.split("/");

      const diaStr = split[0];
      const mesStr = split[1];
      const anoStr = split[2];

      const dia = parseInt(diaStr);
      const mes = parseInt(mesStr) - 1;
      const ano = parseInt(anoStr);

      date = new Date(ano, mes, dia);
    }

    if (date) {
      const split = hora.split(":");
      const _hhStr = split[0];
      const _mmStr = split[1];
      const _ssStr = split[2];

      const _hh = parseInt(_hhStr);
      const _mm = parseInt(_mmStr);
      const _ss = parseInt(_ssStr);

      date.setHours(_hh);
      date.setMinutes(_mm);
      date.setSeconds(_ss);
    }

    return date;
  }

  isDateAmerican(dateString) {
    var regEx = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;
    return dateString.match(regEx) != null;
  }

  isDateBrazil(dateString) {
    var regEx = /^(\d{2})(\/|-)(\d{1,2})(\/|-)(\d{1,4})$/;
    return dateString.match(regEx) != null;
  }

  convertStrBrToNumber(valor: string) {
    let valorUS = valor.split(",").join(".");
    return parseFloat(valorUS);
  }
}
