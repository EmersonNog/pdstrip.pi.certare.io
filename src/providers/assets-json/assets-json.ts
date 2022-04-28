import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHelperProvider } from '../http-helper/http-helper';
import { AngularFireDatabase } from 'angularfire2/database';
import { Constants } from '../../environments/constants';

@Injectable()
export class AssetsJsonProvider {

  folder = 'assets/json';

  // fotossensoresData = require("../assets/json/Pontos_FE_2021.json");
  // faixaDeDominioData = require("../assets/json/faixaDeDominio.json");
  // sinalizacaoHorizontalData = require('../assets/json/CE152_02_130521.json');
  // limMunicipioData = require('../assets/json/limMunicipios.json');
  // acidentesData = require('../assets/json/acidentes2020.json');

  constructor(public httpHelperProvider: HttpHelperProvider, private http: HttpClient, public afd: AngularFireDatabase) {
  }

  // getFotos(){
  //   return this.http.get(`${this.folder}/fotos.json`);
  // }

  // getExames(){
  //   return this.http.get(`${this.folder}/areas_exames.json`);
  // }

  // getJsonTeste(){
  //   return this.http.get(`${this.folder}/jsonteste.json`);
  // }

 

  // getSemiportico(){
  //   // return this.http.get(`${this.folder}/semiportico-ce085.json`);
  //   return this.http.get(`${this.folder}/SEMIPORTICOS_ESTADO.json`);
  // }

  // getPorticos(){
  //   // return this.http.get(`${this.folder}/porticos-ce085.json`);
  //   return this.http.get(`${this.folder}/PORTICOS_ESTADO.json`);
  // }

  // getDefensas(){
  //   // return this.http.get(`${this.folder}/defensas-ce085.json`);
  //   return this.http.get(`${this.folder}/DEFENSAS_ESTADO.json`);
  // }

  // getPontes(){
  //   // return this.http.get(`${this.folder}/defensas-ce085.json`);
  //   return this.http.get(`${this.folder}/PONTES_ESTADO.json`);
  // }

  // getAcidentes(){
  //   return this.http.get(`${this.folder}/acidentes-geolocalizados-2018.json`);
  // }
  
  // getSreListAll(){
  //   return this.http.get(`${this.folder}/SRE_2018.json`);
  // }

  adjustContent(_data: any[]) {
    let arrayTemp = [];

    _data.forEach(_item => {
      let objTemp = {};

      for(var _key in _item) {
        const key = _key.toLocaleLowerCase();
        const value = _item[_key];
        objTemp[key] = value;
      }

      arrayTemp.push(objTemp);
    });

    return arrayTemp;
  }
  
  // saveExames(arr: any[]) {
  //   this.saveFirebase(arr, Constants.PATH_DOCUMENTS_RODOVIA_EXAMES);
  // }
  
  // savePontes(arr: any[]) {
  //   this.saveFirebase(arr, Constants.PATH_DOCUMENTS_RODOVIA_PONTES);
  // }

  // saveSemiporticos(arr: any[]) {
  //   this.saveFirebase(arr, Constants.PATH_DOCUMENTS_RODOVIA_SEMIPORTICO);
  // }

  // savePorticos(arr: any[]) {
  //   this.saveFirebase(arr, Constants.PATH_DOCUMENTS_RODOVIA_PORTICOS);
  // }

  // saveAcidentes(arr: any[]) {
  //   this.saveFirebase(arr, Constants.PATH_DOCUMENTS_RODOVIA_ACIDENTES);
  // }

  // saveDefensas(arr: any[]) {
  //   this.saveFirebase(arr, Constants.PATH_DOCUMENTS_RODOVIA_DEFENSAS);
  // }

  // saveSre(arr: any[]) {
  //   this.saveFirebase(arr, Constants.PATH_DOCUMENTS_RODOVIA_SRE);
  // }

  private saveFirebase(arr: any[], entity: string) {
    arr.forEach(_item => {
      // console.log(_item.id);
      this.afd.object(entity + _item.id).update(_item)
        .then(_data => {})
        .catch(err => console.log(_item.id, err));
    })
  }
  
  replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }

  // getFotossensores(event) {
  //   //  .child('rodovia/').child('fotossensores/').child('Me6Y9tJ87eHGt1rUcvs').

  //   // retornando o array de fotossensores corretamente
  //   if(event.checked){
  //     this.afd.list('/rodovia/fotossensores/')
  //       .valueChanges()
  //       .subscribe((data) => {
  //         console.log(data);
  //       });
  //   } else {
  //     console.log("desligou")
  //   }
  // }

  // sendFaixasDeDominio(){
  //     this.afd.database.ref('/')
  //     .child('rodovia/')
  //     .child('faixaDeDominio/')
  //     .push(this.faixaDeDominioData);
  // }

  // getFaixasDeDominio(){
  //   // if(event.checked){
  //   //   this.afd.list('')
  //   // }
  //   // console.log(this.faixaDeDominioData.length);
  //   // console.log(this.faixaDeDominioData.length / 500);
  //   // for (let index = 0; index < (this.faixaDeDominioData.length / 500); index++) {
  //   //   const element = this.faixaDeDominioData[index];
  //   //   console.log(element);
  //   // }
  //   this.afd.list('rodovia/faixaDeDominio')
  //   .valueChanges()
  //   .subscribe(data => {
  //     console.log(data)
  //   })
  // }

  // sendSinHorizontal(){
  //   this.afd.database.ref("/")
  //   .child("rodovia/")
  //   .child('sinalizacaohorizontal/')
  //   .push(this.sinalizacaoHorizontalData);
  // }
  
  // sendLimMunicipio(){
  //   this.afd.database.ref("/")
  //   .child("rodovia/")
  //   .child('limiteMunicipio/')
  //   .child('-MefnJp2H5A1xtT52LGY/').remove();
    // .push(this.limMunicipioData);
  // }
  // sendAcidentes(){
  //   this.afd.database.ref("/")
  //   .child("rodovia/")
  //   .child('acidentes_2020/')
  //   // .remove()
  //   .set(this.acidentesData);
  //   console.log(this.acidentesData);
  // }

  // getAcidentes2020(){
  //   this.afd.list('rodovia/acidentes_2020')
  //   .valueChanges()
  //   .subscribe(data => {
  //     console.log(data);
  //   });
  // }

  // getSinHorizontal() {
  //   //  .child('rodovia/').child('fotossensores/').child('Me6Y9tJ87eHGt1rUcvs').

  //   // retornando o array de fotossensores corretamente
    
  //     this.afd.list('/rodovia/sinalizacaohorizontal/')
  //       .valueChanges()
  //       .subscribe((data) => {
  //         console.log(data);
  //       });
    
  // }

  migrate() {

    // this.getDefensas().take(1).subscribe((_data: any[]) => {
    //   console.log('defensas', _data);
    //   let arrayTemp = this.adjustContent(_data);

    //   arrayTemp = arrayTemp.map(_item => {
    //     if(_item.name) {
    //       let split = _item.name.split('.');
    //       let name = split[0];
    //       let ext = split[1];
    //       ext = ext.toLocaleLowerCase();
          
    //       _item.name = name + '.' + ext;
    //     }

    //     return _item;
    //   });

    //   console.log('defensas', arrayTemp);

    //   this.saveDefensas(arrayTemp);
    // });

    // this.getPorticos().take(1).subscribe((_data: any[]) => {
    //   // console.log('porticos', _data);
    //   let arrayTemp = this.adjustContent(_data);
    //   arrayTemp = arrayTemp.map(_item => {
    //     _item.id = _item.codigo;
        
    //     if(_item.name) {
    //       let split = _item.name.split('.');
    //       let name = split[0];
    //       let ext = split[1];
    //       if(ext) {
    //         ext = ext.toLocaleLowerCase();
    //       } else {
    //         ext = '';
    //       }

    //       _item.name = name + '.' + ext;
    //     }

    //     return _item;
    //   });

    //   console.log('porticos', arrayTemp);

    //   this.savePorticos(arrayTemp);
    // });

    // this.getSemiportico().take(1).subscribe((_data: any[]) => {
    //   // console.log('semiportico', _data);
    //   let arrayTemp = this.adjustContent(_data);
    //   arrayTemp = arrayTemp.map(_item => {
    //     _item.id = _item.codigo;

    //     if(_item.name) {
    //       let split = _item.name.split('.');
    //       let name = split[0];
    //       let ext = split[1];
    //       ext = ext.toLocaleLowerCase();

    //       _item.name = name + '.' + ext;
    //     }

    //     return _item;
    //   });
    //   console.log('semiportico', arrayTemp);

    //   this.saveSemiporticos(arrayTemp);
    // });

    // this.getPontes().take(1).subscribe((_data: any[]) => {
    //   // console.log('semiportico', _data);
    //   let arrayTemp = this.adjustContent(_data);
    //   arrayTemp = arrayTemp.map((_item, index, arr) => {
    //     _item.id = index;

    //     if(_item.name) {
    //       let split = _item.name.split('.');
    //       let name = split[0];
    //       let ext = split[1];
    //       ext = ext.toLocaleLowerCase();

    //       _item.name = name + '.' + ext;
    //     }

    //     return _item;
    //   });
    //   console.log('pontes', arrayTemp);

    //   this.savePontes(arrayTemp);
    // });

    // this.getAcidentes().take(1).subscribe((_data: any[]) => {
    //   // console.log('acidentes', _data);
    //   let arrayTemp = this.adjustContent(_data);

    //   arrayTemp = arrayTemp.map(_item => {
    //     _item.id = _item.acidente_i;
    //     _item.ce = this.replaceAll(_item.logradouro, '-', '');

    //     return _item;
    //   });

    //   console.log('acidentes', arrayTemp);

    //   this.saveAcidentes(arrayTemp);
    // });

    // this.getSreListAll().take(1).subscribe((_data: any[]) => {
    //   // console.log('sre', _data);
    //   let arrayTemp = this.adjustContent(_data);
    //   arrayTemp = arrayTemp.map(_item => {
    //     _item.id = _item.rodovia_codigo;

    //     return _item;
    //   });
    //   console.log('sre', arrayTemp);

    //   this.saveSre(arrayTemp);
    // });

    // this.getExames().take(1).subscribe((_data: any[]) => {
    //   let arrayTemp = this.adjustContent(_data);
    //   console.log('exames', arrayTemp);

    //   this.saveExames(arrayTemp);
    // });
  }

}
