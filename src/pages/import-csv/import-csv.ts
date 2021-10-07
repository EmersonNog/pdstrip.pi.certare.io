import { Component } from '@angular/core';
import { DateTime, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../environments/constants';
import { User } from '../../models/user';
import { UserService } from '../../providers/user/user.service';

import * as Papa from 'papaparse';
import { DateUtil } from '../../util/date.util';
import { GenericComponentsProvider } from '../../providers/generic-components/generic-components';
import { Estrada } from '../../models/estrada';
import { EstradaProvider } from '../../providers/estrada/estrada';

@IonicPage()
@Component({
  selector: 'page-import-csv',
  templateUrl: 'import-csv.html',
})
export class ImportCsvPage {

  static TYPES = {
    ACIDENTES: 'acidentes',
    DEFENSAS: 'defensas',
    FAIXA_DOMINIO: 'faixaDeDominio',
    FISCALIZACAO_ELETRONICA: 'fiscalizacaoEletronica',
    LIMITE_MUNICIPIO: 'limiteMunicipio',
    PONTE: 'ponte',
    PORTICO: 'portico',
    SEMIPORTICO: 'semiPortico',
    SINALIZACAO_HORIZONTAL: 'sinalizacaoHorizontal',
    SRE: 'sre',
    ESTRADAS: 'estradas',
  };

  list: any[];
  isCarregado = false;
  filename;
  type;
  // dateTime_ = new Date();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private genericComponents: GenericComponentsProvider,
    private estradaProvider: EstradaProvider,
    private userService: UserService,) {
      console.log(this.type);
  }

  ionViewCanEnter() {
    this.userService.getUserLocal().then(userID => {
      this.userService.byId(userID).take(1).subscribe(_user => {
        let user = new User(_user);

        if (user.isAdmin()) {
          return true;
        } else {
          this.navCtrl.setRoot(Constants.HOME_PAGE.name)
        }
      });

      if (userID === null) {
        this.navCtrl.setRoot(Constants.LOGIN_PAGE.name)
      }
    });
  }

  ionViewDidLoad() {
  }

  saveFirebase() {
    this.genericComponents.showConfirm('Enviar para o banco', 'Deseja fazer o upload do arquivo ' + this.filename.name + ' para o banco de dados?',
      () => {
        console.log('sim');

        console.log(this.filename);
        console.log(this.type);
        console.log(this.list);

        // if(this.type && (this.list && this.list.length > 0)) {
        //   switch (this.type) {
        //     case ImportCsvPage.TYPES.ACIDENTES:
        //       this.acidentesProvider.save(this.list);
        //       break;

        //     case ImportCsvPage.TYPES.DEFENSAS:
        //       this.defensasProvider.save(this.list);
        //       break;

        //     case ImportCsvPage.TYPES.FAIXA_DOMINIO:
        //       this.faixaDominioProvider.save(this.list);
        //       break;

        //     case ImportCsvPage.TYPES.FISCALIZACAO_ELETRONICA:
        //       this.fiscalizacaoEletronicaProvider.save(this.list);
        //       break;

        //     case ImportCsvPage.TYPES.LIMITE_MUNICIPIO:
        //       this.limiteProvider.save(this.list);
        //       break;

        //     case ImportCsvPage.TYPES.PONTE:
        //       this.ponteProvider.save(this.list);
        //       break;

        //     case ImportCsvPage.TYPES.PORTICO:
        //       this.porticosProvider.save(this.list);
        //       break;

        //     case ImportCsvPage.TYPES.SEMIPORTICO:
        //       this.semiPorticoProvider.save(this.list);
        //       break;

        //     case ImportCsvPage.TYPES.SINALIZACAO_HORIZONTAL:
        //       this.sinalizcaoProvider.save(this.list);
        //       break;

        //     case ImportCsvPage.TYPES.SRE:
        //       this.sreProvider.save(this.list);
        //       break;

        //     case ImportCsvPage.TYPES.ESTRADAS:
        //       this.estradaProvider.save(this.list);
        //       break;
          
        //     default:
        //       break;
        //   }
        // }

      }).present();
  }

  uploadFile(files, type: string) {
    this.type = type;
    // let fileContent: any = '';
    const fileInput = files[0]
    const fullName = fileInput.name.split(".")

    let step: number = 0;
    let arr = [];

    if (fullName[fullName.length - 1] === 'csv') {
      this.isCarregado = false;

      Papa.parse(fileInput, {

        encoding: 'utf-8',
        newline: '\n',
        delimiter: ";",


        step: (results, parser) => {

          // fileContent += results.data.toString() + "\n";
          // console.log('fileContent: ', fileContent);

          if (step && type === ImportCsvPage.TYPES.ESTRADAS) {
            console.log('estradas');
            const linha = results.data[0];
            const estrada = this.generateRodovia(linha);
            arr.push(estrada);
          }

          step++;
          // console.log("Row data:", results.data);
          // console.log("Row errors:", results.errors);

        },

        complete: (results, _file) => {
          this.filename = _file;
          console.log('file to upload: ', _file);
          console.log('type: ', type);
          console.log('arr', arr[0]);

          this.list = arr;
          this.isCarregado = true;
        }
      });
    }
  }

  generateRodovia(linha): Estrada {

    let objJson = {
      rodovia: this.getColumn(linha, 0),
      uf: this.getColumn(linha, 1),
    };

    let item = new Estrada(objJson);

    return item;
  }


  getColumn(linha: string[], index: number) {
    if (linha && index < linha.length) {
      return linha[index].trim();
    }

    return '';
  }

  convertDate(data: string, hora: string) {
    let date: Date = undefined;

    if (this.isDateAmerican(data)) {
      const split = data.split('/');

      const anoStr = split[0];
      const mesStr = split[1];
      const diaStr = split[2];

      const ano = parseInt(anoStr);
      const mes = parseInt(mesStr) - 1;
      const dia = parseInt(diaStr);

      date = new Date(ano, mes, dia);

    } else if (this.isDateBrazil(data)) {
      const split = data.split('/');

      const diaStr = split[0];
      const mesStr = split[1];
      const anoStr = split[2];

      const dia = parseInt(diaStr);
      const mes = parseInt(mesStr) - 1;
      const ano = parseInt(anoStr);

      date = new Date(ano, mes, dia);
    }

    if (date) {
      const split = hora.split(':');
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
    let valorUS = valor.split(',').join('.');
    return parseFloat(valorUS);
  }

}
