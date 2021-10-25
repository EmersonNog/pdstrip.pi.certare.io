import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Constants } from '../../environments/constants';
import { EstradaProvider } from '../../providers/estrada/estrada';
import { RodoviaProvider } from '../../providers/rodovia/rodovia';
import { SreProvider } from '../../providers/sre/sre';
import { UserService } from '../../providers/user/user.service';
import { AreasExamesPage } from '../areas-exames/areas-exames';

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {

  estradaArr = [];
  estrada;
  sreArr = [];
  sre;

  uf;
  ufArr = [];
  municipio;
  municipioArr = [];
  bairro;
  bairroArr = [];

  imoveisAtivos = true;
  linhasAtivas = true;
  estacoesAtivas = true;
  bufferLinhasAtivas = false;
  bufferEstacoesAtivas = false;

  @ViewChild("rodoviaField") rodoviaField:ElementRef;
  @ViewChild("dataLevantamentoField") dataLevantamentoField:ElementRef;
  @ViewChild("horaRegistroField") horaRegistroField:ElementRef;
  @ViewChild("sreField") sreField:ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    public userService: UserService,
    private rodoviaService: RodoviaProvider,
    private estradaService: EstradaProvider,
    private sreService: SreProvider,
    ) {
  }


  clearFields(){
    // this.rodoviaField.nativeElement.value="";
    // this.dataLevantamentoField.nativeElement.value="";
    // this.horaRegistroField.nativeElement.value="";
    // this.sreField.nativeElement.value="";
    console.log('teste')
  }
  ionViewDidLoad() {
    // this.rodoviaService.listSRE().take(1).subscribe(_data => {
    //   // console.log(_data);
    //   this.sreArr = _data.map(item => {
    //     let values = item.values;
    //     values.info = values.id + ' | ' + values.inicio + ' - ' + values.fim;
    //     return values;
    //   });
    // });

    this.sreService.list().take(1).subscribe(_data => {
      console.log('[SRE]', _data);
      this.sreArr = _data.map(values => {
        values['info'] = values.codigo + ' | ' + values.inicio_desc + ' - ' + values.fim_desc;
        return values;
      });
    });

    this.estradaService.list().take(1).subscribe(_data => {
      console.log('[ESTRADAS]', _data);
      this.estradaArr = _data.map(values => {
          values['info'] = values.rodovia;
          return values;
      });
    });

    this.ufArr = AreasExamesPage.ufs.map(values => {
      values['info'] = values.nome;
      values['id'] = values.sigla;
      return values;
    });

    
  }

  changeSre(event) {
    const value = event.value;
    console.log(event);

  }

  changeAtivos(tipo, event){
    console.log(tipo, this.imoveisAtivos, this.estacoesAtivas, this.linhasAtivas)
    switch (tipo) {
      case 'imovel':
        this.imoveisAtivos = event.value
        break;
      case 'estacoes':
        this.estacoesAtivas = event.value
        break;
      case 'linhas':
        this.linhasAtivas = event.value
        break;
      case 'bufferLinhas':
        this.bufferLinhasAtivas = event.value
        break;
      case 'bufferEstacoes':
        this.bufferEstacoesAtivas = event.value
        break;
    
      default:
        break;
    }
  }

  changeUf(event){
    
    
    const value = event.value;
    console.log('changeUF', value)
    console.log(AreasExamesPage.municipios)
    const municipioArr = AreasExamesPage.municipios
      .filter(municipio => municipio.uf === value.id)
      .map(values => {
        values['info'] = values.municipio;
        values['id'] = values.municipio;
        return values;
      })
    console.log(municipioArr)
    this.municipioArr = municipioArr  
  }

  changeMunicipio(event){
    const value = event.value;
    console.log('munichange', value)
    const bairroArr = AreasExamesPage.bairros
    this.bairroArr = bairroArr
    .filter(bairro => bairro.municipio === value.info)
    .map(values => {
        values['info'] = values.bairro;
        values['id'] = values.bairro;
        return values;
    })
  }

  changeBairro(event){
    const value = event.value
    this.bairroArr = value
  }

  ionViewCanEnter() {
    this.userService.getUserLocal().then(userID => {
        if (userID) {
            return true;
        }
        if (userID === null) {
            this.navCtrl.setRoot(Constants.LOGIN_PAGE.name)
        }
    });
  }

  submit() {
    const params = {
      ativos: {
        imoveis: this.imoveisAtivos,
        linhas: this.linhasAtivas,
        estacoes: this.estacoesAtivas,
        bufferLinhas: this.bufferLinhasAtivas,
        bufferEstacoes: this.bufferEstacoesAtivas
      },
      ufs: this.uf ? [this.uf] : [], 
      municipios: this.municipio ? [this.municipio] : [], 
      bairros: this.bairroArr
    };
    // console.log('params', params);
    this.closeFilter(params);
  }

  clear() {
    this.closeFilter();
  }

  closeFilter(params=undefined) {
    this.viewCtrl.dismiss(params);
  }

}
