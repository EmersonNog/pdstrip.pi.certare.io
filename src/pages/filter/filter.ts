import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Constants } from '../../environments/constants';
import { EstradaProvider } from '../../providers/estrada/estrada';
import { RodoviaProvider } from '../../providers/rodovia/rodovia';
import { SreProvider } from '../../providers/sre/sre';
import { UserService } from '../../providers/user/user.service';

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


  operacao;


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
  ufArr = [
    {info: "Minas Gerais", id: "MG"},
    {info: "Pernambuco", id: "PE"},
    {info: "Rio Grande do Sul", id: "RS"}
  ];

  municipio = [];
  municipioArr = [];
  municipioArrTotal = []

  bairro = [];
  bairroArr = [];
  bairroArrTotal = [];

  tiposOcupacoes = [];
  tiposOcupacoesArr = [];

  fontes = [];
  fontesArr = [];


  tiposSetores = [];
  tiposSetoresArr = [];

  categorias = [];
  categoriasArr = [
    {id: 'app', info: 'App'},
    {id: 'iso_10', info: 'Iso 10'},
    {id:  'iso_15', info: 'Iso 15'}
  ]

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

      const params = navParams.data;
    
      console.log('paramssss', params)
      this.uf = params.ufsSelecionadas;

      this.municipioArrTotal = params.municipios.map(item => {
        item.info = item.municipio
        item.id = item.uf + item.municipio
        return item
      })
      this.municipioArr = params.municipios.map(item => {
        item.info = item.municipio
        item.id = item.uf + item.municipio
        return item
      })
      this.municipio = params.municipiosSelecionados
      
      this.bairroArrTotal = params.bairros.map(item => {
        item.info = item.bairro
        item.id = item.uf + item.municipio + item.bairro
        return item
      })
      this.bairroArr = params.bairros.map(item => {
        item.info = item.bairro
        item.id = item.uf + item.municipio + item.bairro
        return item
      })
      this.bairro = params.bairrosSelecionados;

      this.imoveisAtivos = params.imoveisAtivos;
      this.linhasAtivas = params.linhasAtivas;
      this.estacoesAtivas = params.estacoesAtivas;
      this.bufferEstacoesAtivas = params.bufferEstacoesAtivas;
      this.bufferLinhasAtivas = params.bufferLinhasAtivas;

      this.tiposOcupacoes = params.tipoOcupacoesSelecionados;
      this.tiposOcupacoesArr = params.tiposOcupacoes.map(item => {
       return {id: item, info: item}
      })

      this.tiposSetores = params.tipoSetoresSelecionados;
      this.tiposSetoresArr = params.tiposSetores.map(item => {
        return {id: item, info: item}
      })

      this.fontes = params.fontesSelecionadas;
      this.fontesArr = params.fontes.map(item => {
        return {id: item, info: item}
      })

      this.categorias = params.categorias;
      this.categorizacao = params.categorizacao;

  }


  clearFields(){

    this.imoveisAtivos = true;
    this.linhasAtivas = true;
    this.estacoesAtivas = true;
    this.bufferEstacoesAtivas = false;
    this.bufferLinhasAtivas = false;
    
    this.uf = [];
    this.municipio = [];
    this.bairro = [];
    this.tiposOcupacoes = [];
    this.tiposSetores = [];
    this.fontes = [];
    this.categorias = [];
    this.categorizacao = {info: 'Tipo ocupação', id: 'tipo_ocup'};

  }


  ionViewDidLoad() {
  

    
    
  }

  changeCategorizacao(event) {
    const value = event.value;
    console.log(event);

  }

  changeCategorias(event){
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
    this.uf = value

    this.bairro = []
    this.municipio = []

    this.bairroArr = this.bairroArrTotal
    this.municipioArr = this.municipioArrTotal
    
    const siglasContidas = value.map(uf => uf.id)
    console.log(siglasContidas)

    if(value.length > 0){
      const municipioArr = this.municipioArrTotal
      .filter(municipio => siglasContidas.includes(municipio.uf))
      .map(values => {
        values['info'] = values.municipio;
        values['id'] = values.uf + values.municipio;
        return values;
      })
    console.log(municipioArr)
    this.municipioArr = municipioArr 
    }
     
  }

  changeMunicipio(event){
    this.bairro = []
    this.bairroArr = this.bairroArrTotal
    const value = event.value;
    this.municipio = value
    const bairroArr = this.bairroArrTotal
    const municipios = value.map(item => item.info)
    
    if(value.length > 0){
      this.bairroArr = bairroArr
      .filter(bairro => municipios.includes(bairro.municipio))
      .map(values => {
          values['info'] = values.bairro;
          values['id'] = values.uf + values.municipio + values.bairro;
          
          return values;
      })
    }
    
  }

  changeBairro(event){
    const value = event.value
    this.bairro = value
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
    
    const { log } = console

    console.log('uf', this.uf)
    log('muni', this.municipio)
    log('bairro', this.bairro)
    log('tipoOcuo', this.tiposOcupacoes)
    log('tipoSet', this.tiposSetores)
    log('font', this.fontes)
    log('categorias', this.categorias)
    log('categorizacao', this.categorizacao)
    

    const params = {
      ativos: {
        imoveis: this.imoveisAtivos,
        linhas: this.linhasAtivas,
        estacoes: this.estacoesAtivas,
        bufferLinhas: this.bufferLinhasAtivas,
        bufferEstacoes: this.bufferEstacoesAtivas,
      },
      ufs: this.uf.length > 0 ? this.uf : [] , 
      municipios: this.municipio.length > 0 ? this.municipio : [], 
      bairros: this.bairro.length > 0 ? this.bairro : [],
      tiposOcupacoes: this.tiposOcupacoes.length > 0 ? this.tiposOcupacoes : [],
      tiposSetores: this.tiposSetores.length > 0 ? this.tiposSetores : [],
      fontes: this.fontes.length > 0 ? this.fontes : [],
      categorias: this.categorias.length > 0 ? this.categorias : [],
      categorizacao: !!this.categorizacao ? this.categorizacao : null,
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
