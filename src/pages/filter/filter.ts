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
  iso10Ativos = false;
  iso15Ativos = false;
  appAtivos = true;

  categorizacao = {info: 'Tipo ocupação', id: 'tipo_ocup'}
  categorizacaoArr = [
    {info: 'Tipo ocupação', id: 'tipo_ocup'},
    {info: 'G priorização', id: 'g_priorizacao'},
    {info: 'App', id: 'app'},
    {info: 'Fonte', id: 'fonte'},
    {info: 'Iso 15', id: 'iso_15'},
    {info: 'Iso 10', id: 'iso_10'}
  ]

  graduacao;
  graduacaoArr = [
    {info: 'Distancia do centro', id: 'dist_centro'},
    {info: 'Preço por metro quadrado', id: 'preco_m2'},
    {info: 'Área Total', id: 'area_tot'},
    {info: 'Densidade Estimada', id: 'den_est'},
    {info: 'Renda Estimada', id: 'renda_est'},
    {info: 'Ivs Atlas', id: 'ivs_atlas'},
    {info: 'Ivs Renda', id: 'ivs_renda'},
    {info: 'Ivs Infra', id: 'ivs_infra'},
    {info: 'T Vulner Mais 1h', id: 't_vulner_mais1h'},
    {info: 'Declividade', id: 'declividade'},
    {info: 'Pois Com', id: 'pois_com'},
    {info: 'Pois Saúde', id: 'pois_saude'},
    {info: 'Pois Edu', id: 'pois_edu'},
    {info: 'I Priorização', id: 'i_priorizacao'},
    
  ]

  uf = [];
  ufArr = AreasExamesPage.ufs.length > 0  ? AreasExamesPage.ufs.map(uf => {
    uf['info'] = uf.nome
    uf['id'] = uf.sigla
    return uf 
  }) : [];
  municipio = [];
  municipioArr = AreasExamesPage.municipios.length > 0  ? !!AreasExamesPage.municipios[0].info ? AreasExamesPage.municipios : AreasExamesPage.municipios.map(item => {
    
    return {info: item.municipio, id: item.municipio}
  }) : [];
  bairro = [];
  bairroArr = AreasExamesPage.bairros.length > 0  ? !!AreasExamesPage.bairros[0].info ? AreasExamesPage.bairros : AreasExamesPage.bairros.map(item => {
    
    return {info: item.bairro, id: item.bairro}
  }) : [];

  tiposOcupacoes = [];
  tiposOcupacoesArr = AreasExamesPage.tiposOcupacoes.length > 0 ? AreasExamesPage.tiposOcupacoes.map(ocupacao => {
    return {id: ocupacao, info: ocupacao}
  }) : [];

  fontes = [];
  fontesArr = AreasExamesPage.fontes.length > 0 ? AreasExamesPage.fontes.map(fonte => {
    return {id: fonte, info: fonte}
  }) : [];;

  tiposSetores = [];
  tiposSetoresArr = AreasExamesPage.tiposSetores.length > 0 ? AreasExamesPage.tiposSetores.map(setor => {
    return {id: setor, info: setor}
  }) : [];

  categorias = [];
  categoriasArr = [
    {id: 'app', info: 'App'},
    {id: 'iso_10', info: 'Iso 10'},
    {id:  'iso_15', info: 'Iso 15'}
  ]

  imoveisAtivos = AreasExamesPage.imoveisAtivos;
  linhasAtivas = AreasExamesPage.linhasAtivas;
  estacoesAtivas = AreasExamesPage.estacoesAtivas;
  bufferLinhasAtivas = AreasExamesPage.bufferLinhasAtivas;
  bufferEstacoesAtivas = AreasExamesPage.bufferEstacoesAtivas;

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
  
    
    this.ufArr = AreasExamesPage.ufs.map(values => {
      values['info'] = values.nome;
      values['id'] = values.sigla;
      return values;
    });

    
  }

  changeCategorizacao(event) {
    const value = event.value;
    console.log(event);

  }

  changeGraduacao(event) {
    const value = event.value;
    console.log(event);

  }

  changeFontes(event){
    const value = event.value;
    console.log(event)
  }

  changeTipoSetores(event){
    const value = event.value;
    console.log(value)
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
      case 'iso_10':
        this.iso10Ativos = event.value
        break;
      case 'iso_15':
        this.iso15Ativos = event.value
        break;
      case 'app':
        this.appAtivos = event.value
        break;
      default:
        break;
    }
  }

  changeUf(event){
    
    
    const value = event.value;
    console.log(AreasExamesPage.municipios)
    const siglasContidas = value.map(uf => uf.sigla)
    console.log(siglasContidas)
    const municipioArr = AreasExamesPage.municipios
      .filter(municipio => siglasContidas.includes(municipio.uf))
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
    const bairroArr = AreasExamesPage.bairros
    const municipios = value.map(item => item.municipio)
    console.log(bairroArr
      .filter(bairro => {
        console.log('bairro', bairro)
        return municipios.includes(bairro.municipio)
      })
    )

    
    this.bairroArr = bairroArr
    .filter(bairro => municipios.includes(bairro.municipio))
    .map(values => {
        values['info'] = values.bairro;
        values['id'] = values.bairro;
        console.log(values)
        return values;
    })
    console.log(this.bairroArr)
  }

  changeBairro(event){
    const value = event.value
    this.bairroArr = value
  }

  changeTipoOcupacoes(event){
    console.log(event.value)
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
        bufferEstacoes: this.bufferEstacoesAtivas,
        app: this.appAtivos,
        iso15: this.iso15Ativos,
        iso10: this.iso10Ativos,
        
      },
      ufs: this.uf , 
      municipios: this.municipio, 
      bairros: this.bairro,
      tiposOcupacoes: this.tiposOcupacoes,
      tiposSetores: this.tiposSetores.length > 0 ? this.tiposSetores.map(setor => setor.info) : [],
      fontes: this.fontes.length > 0 ? this.fontes.map(fonte => fonte.info) : [],
      categorias: this.categorias.length > 0 ? this.categorias.map(categoria => categoria.id) : [],
      categorizacao: this.categorizacao ? this.categorizacao.id : null
    };
    console.log('params', params);
    this.closeFilter(params);
  }

  clear() {
    this.closeFilter();
  }

  closeFilter(params=undefined) {
    this.viewCtrl.dismiss(params);
  }

}
