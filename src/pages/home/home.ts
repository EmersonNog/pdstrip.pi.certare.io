import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../environments/constants';
import { User } from '../../models/user';
import { AssetsJsonProvider } from '../../providers/assets-json/assets-json';
import { UserService } from '../../providers/user/user.service';
import { MapUtil, Position } from '../../util/map.util';
import { AngularFirestore } from "angularfire2/firestore";
import wkt from "wkt";
import * as _ from 'lodash';
import { _ParseAST } from '@angular/compiler';
import { _getAngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  selected: string = 'map';

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  mapUtil = new MapUtil();

  user: User = new User();

  estacoes = {coordenadas : []};
  linhas = [];
  linhasPlanejadas = [];
  bufferLinhas = [];
  bufferEstacoes = [];
  areaCaminhavel = [];
  imoveis = [];
  ufsImoveis = [];
  municipiosImoveis = [];
  bairrosImoveis = []
  municipios = [];
  bairros = [];
  ufs = [
    {nome: "Minas Gerais", sigla: "MG"},
    {nome: "Pernambuco", sigla: "PE"},
    {nome: "Rio Grande do Sul", sigla: "RS"},
  ]
  tiposOcupacoes = [];
  tiposOcupacoesSelecionados = [];

  tiposSetores = [];
  tiposSetoresSelecionados = [];

  fontes = [];
  fontesSelecionadas = [];

  imoveisAtivos = true;
  estacoesAtivas = true;
  linhasAtivas = true;
  linhasPlanejadasAtivas = true;
  areaCaminhavelAtiva = false; 
  bufferEstacoesAtivas = false;
  bufferLinhasAtivas = false;
  

  blocoLegenda = true;
  legendaOcupacao = true;
  legendaGPriorizacao = false;
  legendaApp = false;
  legendaFonte = false;
  legendaIso10 = false;
  legendaIso15 = false;
  legendaEmbaraco = false;
  legendaPotencialAdd = false;

  categorias = []
  categorizacao = {info: 'Tipo ocupação', id: 'tipo_ocup'}
  graduacao = null;
  area = {valor1: null, valor2: null, operacao: 'entre'}


  cores = {
    terreno: '#00A3EE',
    consolidadoBaixaOcupacao: '#D80351',
    imovelAbandonado: '#3F3F3F',
    naoClassificado: '#F5D908',
    baixa_complexidade: '#00A3EE',
    media_complexidade: '#D80351',
    alta_complexidade: '#3F3F3F',
    sem_embaraco: '#F5D908',
    verdadeiro: '#00FF00',
    falso: '#FF0000',
    valor1: '#FF0000',
    valor2: '#00FF00',
    valor3: '#0000FF',
    valor4: '#333333',
    SIAPA: '#FF0000',
    TRENSURB: '#00FF00',
    PREFEITURA_DE_BELO_HORIZONTE: '#0000FF',
    SPIUNET: '#333333',
    linhaPlanejada: '#800080',
    linha: '#9B1C04',
    estacao: '#E91D63',
    faixa1: '#f9a656',
    faixa2: '#b59e73',
    faixa3: '#7d978b',
    faixa4: '#368eaa',
    faixa5: '#0187c0',
    src: '../../assets/icon/iconEstacao.svg'
   
  }

  

  graduacaoMinima;
  graduacaoMaxima;
  colunaGraduacao;

  faixasSetadas = false;

  app;
  iso10;
  iso15;

  faixas = {
    faixa1: '',
    faixa2: '',
    faixa3: '',
    faixa4: '',
    faixa5: ''
  }




  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController,
    private userService: UserService,
    private provider: AssetsJsonProvider,
    public afd: AngularFirestore) {
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

  ionViewWillLeave() {
    this.mapUtil.destroy();
  }

  
  ionViewDidLoad() {
    this.initMap();
   
  }

  mudarLegenda(tipoLegenda){
    this.blocoLegenda = true;
    switch (tipoLegenda) {
      case 'tipo_ocup':
        this.legendaOcupacao = true;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
      case 'g_priorizacao':
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = true;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
      case 'app':
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = true;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
      case 'fonte':
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = true;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
      case 'iso_10':
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = true;
        this.legendaIso15 = false;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
      case 'iso_15':
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = true;
        this.legendaEmbaraco = false;
        this.legendaPotencialAdd = false;
        break;
        case 'comp_emb':
          this.legendaOcupacao = false;
          this.legendaGPriorizacao = false;
          this.legendaApp = false;
          this.legendaFonte = false;
          this.legendaIso10 = false;
          this.legendaIso15 = false;
          this.legendaEmbaraco = true;
          this.legendaPotencialAdd = false;
          break;
        case 'potencial_add':
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

  converterTeste(){

    
    this.provider.getJsonTeste().subscribe(data => {
      let arr = []

      for(var i in data){
        arr.push(data[i]);
      }

      console.log(arr)
      

      arr.forEach((item, idx) => {
        console.log('enviando arquivo ' + idx);
        const id = this.afd.createId();
        item.id = id;
        this.afd.doc(Constants.PATH_DOCUMENTS_BUFFER_LINHAS + item.id).set(JSON.parse(JSON.stringify(item)));
      })
    })
  }

  calcularGraduacao(imovel, coluna){


   
    
    if(coluna !== this.colunaGraduacao){
      this.colunaGraduacao = coluna
      this.graduacaoMaxima = null
      this.graduacaoMinima = null
      this.faixasSetadas = false
      this.imoveis.forEach(item => {
            
            if(!_.get(item.element, coluna)){
              _.set(item.element, coluna, 0)
            }
            if(!this.graduacaoMinima || _.get(item.element, coluna) < this.graduacaoMinima){
              this.graduacaoMinima = _.get(item.element, coluna)
            }
            if(!this.graduacaoMaxima || _.get(item.element, coluna) > this.graduacaoMaxima){
              this.graduacaoMaxima = _.get(item.element, coluna)
            }
          
        })
    }
     
    
    if(!_.get(imovel, coluna)){
      _.set(imovel, coluna, 0)
    }

    const diferencaFator = (this.graduacaoMaxima - this.graduacaoMinima) / 5
   

    const fator = _.get(imovel, coluna)/this.graduacaoMaxima

    if(!this.faixasSetadas){
      this.faixasSetadas = true;
      this.faixas = {
        faixa1: this.graduacaoMinima.toFixed(0) + ' ~ ' + (this.graduacaoMinima + diferencaFator).toFixed(0),
        faixa2: (this.graduacaoMinima + diferencaFator).toFixed(0) + ' ~ ' + (this.graduacaoMinima + diferencaFator * 2).toFixed(0),
        faixa3: (this.graduacaoMinima + diferencaFator * 2).toFixed(0) + ' ~ ' + (this.graduacaoMinima + diferencaFator * 3).toFixed(0),
        faixa4: (this.graduacaoMinima + diferencaFator * 3).toFixed(0) + ' ~ ' + (this.graduacaoMinima + diferencaFator * 4).toFixed(0),
        faixa5: (this.graduacaoMinima + diferencaFator * 4).toFixed(0) + ' ~ ' + this.graduacaoMaxima.toFixed(0)
      }
    }

    const valor = _.get(imovel, coluna)
    
    if(valor < this.graduacaoMinima + diferencaFator){
      return '#f9a656'
    }else if(valor < this.graduacaoMinima + (2 * diferencaFator)){
      return '#b59e73'
    }else if(valor < this.graduacaoMinima + (3 * diferencaFator)){
      return '#7d978b'
    }else if(valor < this.graduacaoMinima + (4 * diferencaFator)){
      return '#368eaa'
    }else{
      return '#0187c0'
    }

    

    // if(fator <= 0.1){
    //  return '#FFD5D5'
    // }else if(fator <= 0.2){
    //   return '#FFCCCC'
    // }else if(fator <= 0.3){
    //   return '#FFA5A5'
    // }else if(fator <= 0.4){
    //   return '#FF9090'
    // }else if(fator <= 0.5){
    //   return '#FF7575'
    // }else if(fator <= 0.6){
    //   return '#FF6060'
    // }else if(fator <= 0.7){
    //   return '#FF4545'
    // }else if(fator <= 0.8){
    //   return '#FF3030'
    // }else if(fator <= 0.9){
    //   return '#FF1515'
    // }else{
    //   return '#FF0000'
    // }
  }

  openFilterPage() {
    const filterPage = this.modalCtrl.create(Constants.FILTER_PAGE.name, {
      municipios: this.municipios, 
      bairros: this.bairros, 
      fontes: this.fontes,
      tiposOcupacoes: this.tiposOcupacoes,
      tiposSetores: this.tiposSetores,
      imoveisAtivos: this.imoveisAtivos,
      estacoesAtivas: this.estacoesAtivas,
      linhasAtivas: this.linhasAtivas,
      bufferEstacoesAtivas: this.bufferEstacoesAtivas,
      bufferLinhasAtivas: this.bufferLinhasAtivas,
      ufsSelecionadas: this.ufsImoveis,
      municipiosSelecionados: this.municipiosImoveis,
      bairrosSelecionados: this.bairrosImoveis,
      fontesSelecionadas: this.fontesSelecionadas,
      tipoOcupacoesSelecionados: this.tiposOcupacoesSelecionados,
      tipoSetoresSelecionados: this.tiposSetoresSelecionados,
      categorias: this.categorias,
      categorizacao: this.categorizacao,
      graduacao: this.graduacao,
      area: this.area,
      areaCaminhavelAtiva: this.areaCaminhavelAtiva,
      app: this.app,
      iso10: this.iso10,
      iso15: this.iso15,
      linhasPlanejadasAtivas: this.linhasPlanejadasAtivas


    });
    filterPage.onDidDismiss(_data => {
     
      if (_data) {
        console.log('datazinha' , _data)
       
        const filtro = {
          estacoes : {ativo: _data.ativos.estacoes}, 
          imoveis: {ativo: _data.ativos.imoveis, 
            ufs: _data.ufs.length > 0 ? _data.ufs.map(item => item.id) : [], 
            municipios: _data.municipios.length > 0 ? _data.municipios.map(item => item.info) : [], 
            bairros: _data.bairros.length > 0 ? _data.bairros.map(item => item.info) : [],
            tiposOcupacoes: _data.tiposOcupacoes.length > 0 ? _data.tiposOcupacoes.map(item => item.info) : [],
            tiposSetores: _data.tiposSetores.length > 0 ? _data.tiposSetores.map(item => item.info) : [],
            fontes: _data.fontes.length > 0 ? _data.fontes.map(item => item.info) : [],
            categorias: _data.categorias.length > 0 ? _data.categorias.map(item => item.id) : [],
            categorizacao: !!_data.categorizacao ? _data.categorizacao : null,
            graduacao: !!_data.graduacao ? _data.graduacao : null,
            area: _data.area,
            app: !!_data.app ? _data.app : null,
            iso10: !!_data.iso10 ? _data.iso10 : null,
            iso15: !!_data.iso15 ? _data.iso15 : null
          },       
          linhas: {ativo: _data.ativos.linhas},
          linhasPlanejadas: {ativo: _data.ativos.linhasPlanejadas},
          bufferEstacoes: {ativo: _data.ativos.bufferEstacoes}, 
          bufferLinhas: {ativo: _data.ativos.bufferLinhas},
          areaCaminhavel: {ativo: _data.ativos.areaCaminhavel}
        }

        this.estacoesAtivas = _data.ativos.estacoes;
        this.imoveisAtivos = _data.ativos.imoveis;
        this.linhasAtivas = _data.ativos.linhas;
        this.linhasPlanejadasAtivas = _data.ativos.linhasPlanejadas;
        this.areaCaminhavelAtiva = _data.ativos.areaCaminhavel;
        this.bufferLinhasAtivas = _data.ativos.bufferLinhas;
        this.bufferEstacoesAtivas = _data.ativos.bufferEstacoes;

        this.ufsImoveis = _data.ufs;
        this.municipiosImoveis = _data.municipios;
        this.bairrosImoveis = _data.bairros;
        this.tiposOcupacoesSelecionados = _data.tiposOcupacoes;
        this.tiposSetoresSelecionados = _data.tiposSetores,
        this.fontesSelecionadas = _data.fontes,
        this.categorias = _data.categorias,
        this.categorizacao = !!_data.categorizacao ? _data.categorizacao : null;
        this.graduacao = !!_data.graduacao ? _data.graduacao : null;
        this.area = _data.area
        this.app = !!_data.app ? _data.app : null
        this.iso10 = !!_data.iso10 ? _data.iso10 : null
        this.iso15 = !!_data.iso15 ? _data.iso15 : null

        this.filtrar(filtro)
        
       

      }
    });
    filterPage.present();
  }

  filtrar(filtro = {
    estacoes : {ativo: true}, 
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
        operacao: null
      },
      app: null,
      iso10: null,
      iso15: null
    }, 
    linhas: {ativo: true},
    linhasPlanejadas: {ativo: true},
    bufferEstacoes: {ativo: false}, 
    bufferLinhas: {ativo: false},
    areaCaminhavel: {ativo: false},
  }
  ){

    this.mapUtil.cleanMarkers();
    this.mapUtil.cleanPolylines();
    this.mapUtil.cleanPolygons();

    if(filtro.estacoes.ativo){
      // this.mapUtil.showRodoviaPoints(this.estacoes.coordenadas, this.map, false, 'limite-municipio', false)
      this.mapUtil.addEstacao(this.estacoes.coordenadas, this.map)
      console.log('filtro ')
    }

    if(filtro.areaCaminhavel.ativo){
      this.areaCaminhavel.length > 0 && this.areaCaminhavel.forEach(area => {
        this.mapUtil.addAreaCaminhavel(area.polyline, this.map, area.cor,area.element)
        // this.mapUtil.addPolyline(linha.polyline, this.map, linha.cor, 'linha', linha.element)
      })
    }

    if(filtro.linhasPlanejadas.ativo){
      this.linhasPlanejadas.length > 0 && this.linhasPlanejadas.forEach(linhaPlanejada => {
        this.mapUtil.addLinha(linhaPlanejada.polyline, this.map, linhaPlanejada.cor, linhaPlanejada.element)

      })
    }
    if(filtro.linhas.ativo){
      this.linhas.length > 0 && this.linhas.forEach(linha => {
        this.mapUtil.addLinha(linha.polyline, this.map, linha.cor, linha.element)
        // this.mapUtil.addPolyline(linha.polyline, this.map, linha.cor, 'linha', linha.element)
      })
    }
    if(filtro.bufferEstacoes.ativo){
      this.bufferEstacoes.length > 0 && this.bufferEstacoes.forEach(buffer => {
        this.mapUtil.addBufferEstacao(buffer.polyline, this.map, buffer.cor, buffer.element)
        // this.mapUtil.addPolyline(buffer.polyline, this.map, buffer.cor, 'bufferEstacao', buffer.element)
      })

    }
    if(filtro.bufferLinhas.ativo){
     
      this.bufferLinhas.length > 0 && this.bufferLinhas.forEach(bufferLinha => {
        this.mapUtil.addBufferLinha(bufferLinha.polyline, this.map, bufferLinha.cor, bufferLinha.strokeColor, bufferLinha.element)
        // this.mapUtil.addPolyline(buffer.polyline, this.map, buffer.cor, 'bufferLinha', buffer.element)
      })
    }

    if(filtro.imoveis.ativo){
      
      this.imoveis.length > 0 && this.imoveis.forEach(imovel => {

          if(filtro.imoveis.tiposSetores.length  > 0 && !filtro.imoveis.tiposSetores.includes(imovel.element.tipo_setor)){
            return;
          }
          if(filtro.imoveis.tiposOcupacoes.length > 0 && !filtro.imoveis.tiposOcupacoes.includes(imovel.element.tipo_ocup)){
            return;
          }

          if(filtro.imoveis.fontes.length > 0 && !filtro.imoveis.fontes.includes(imovel.element.fonte)){
            return;
          }

          if(filtro.imoveis.app){
            if(filtro.imoveis.app.id === 'true' && imovel.element.app === 'FALSE'){
              return;
            }else if(filtro.imoveis.app.id === 'false' && imovel.element.app === 'TRUE'){
              return;
            }
          }


          if(filtro.imoveis.iso10){
            if(filtro.imoveis.iso10.id === 'true' && imovel.element.iso_10 === 'FALSE'){
              return;
            }else if(filtro.imoveis.iso10.id === 'false' && imovel.element.iso_10 === 'TRUE'){
              return;
            }
          }

          if(filtro.imoveis.iso15){
            console.log('caiu')

            if(filtro.imoveis.iso15.id === 'true' && imovel.element.iso_15 === 'FALSE'){
              return;
            }else if(filtro.imoveis.iso15.id === 'false' && imovel.element.iso_15 === 'TRUE'){
              return;
            }
          }

          if(filtro.imoveis.area.operacao){
            const valor1 = filtro.imoveis.area.valor1
            const valor2 = filtro.imoveis.area.valor2
            if(valor1 && valor2){

              let minimo = 0
              let maximo = 0

              if(valor1 < valor2){
                minimo = valor1
                maximo = valor2
              }else{
                minimo = valor2
                maximo = valor1
              }
              
              if(filtro.imoveis.area.operacao === 'entre'){
                if(minimo > imovel.element.area_tot || maximo < imovel.element.area_tot ){
                  return;
                }
              }
              
            }else if(valor1){
              if(filtro.imoveis.area.operacao === 'entre'){
                if(valor1 > imovel.element.area_tot){
                  return;
                }
              }
            }else if(valor2){
              if(filtro.imoveis.area.operacao === 'entre'){
                if(valor2 < imovel.element.area_tot){
                  return;
                }
              }
            }
          }

          
          if(filtro.imoveis.categorizacao){
            switch (filtro.imoveis.categorizacao.id) {
              case 'tipo_ocup':
                this.mudarLegenda('tipo_ocup')
                switch (imovel.element.tipo_ocup.toLowerCase()) {
                  case 'terreno':
                    imovel.cor = '#00A3EE';
                    break;
                  case 'consolidado de baixa ocupação':
                    imovel.cor = '#D80351';
                    break;
                  case 'imóvel abandonado':
                    imovel.cor = '#3F3F3F';
                    break; 
                  default:
                    imovel.cor = '#F5D908';
                    break;
                }
                break;
              case 'g_priorizacao':
                this.mudarLegenda('g_priorizacao')
                switch (imovel.element.g_priorizacao.toString()) {
                  case '1':
                    imovel.cor = '#FF0000';
                    break;
                  case '2':
                    imovel.cor = '#00FF00';
                    break;
                  case '3':
                    imovel.cor = '#0000FF';
                    break;
                  case '4':
                    imovel.cor = '#333333';
                    break;  
                  default:
                    imovel.cor = '#B15928';
                    break;
                }
                break;
              case 'app':
                this.mudarLegenda('app')
                switch (imovel.element.app.toLowerCase()) {
                  case 'true':
                    imovel.cor = '#00FF00';
                    break;
                  case 'false':
                    imovel.cor = '#FF0000';
                    break;
                  default:
                    imovel.cor = '#B15928';
                    break;
                }
                break;
              case 'iso_10':
                this.mudarLegenda('iso_10')
                switch (imovel.element.iso_10.toLowerCase()) {
                  case 'true':
                    imovel.cor = '#00FF00';
                    break;
                  case 'false':
                    imovel.cor = '#FF0000';
                    break;
                  default:
                    imovel.cor = '#B15928';
                    break;
                }
              break;
              case 'iso_15':
                this.mudarLegenda('iso_15')
                switch (imovel.element.iso_15.toLowerCase()) {
                  case 'true':
                    imovel.cor = '#00FF00';
                    break;
                  case 'false':
                    imovel.cor = '#FF0000';
                    break;
                  default:
                    imovel.cor = '#B15928';
                    break;
                }
              break;
              case 'comp_emb':
                this.mudarLegenda('comp_emb')
                switch (imovel.element.comp_emb.toLowerCase()) {
                  case 'baixa complexidade':
                    imovel.cor = '#00A3EE';
                    break;
                  case 'média complexidade':
                    imovel.cor = '#D80351';
                    break;
                  case 'alta complexidade':
                    imovel.cor = '#3F3F3F';
                    break; 
                  default:
                    imovel.cor = '#F5D908';
                    break;
                }
              break;
              case 'potencial_add':
                this.mudarLegenda('potencial_add')
                switch (imovel.element.potencial_add.toLowerCase()) {
                  case 'true':
                    imovel.cor = '#00FF00';
                    break;
                  case 'false':
                    imovel.cor = '#FF0000';
                    break;
                  default:
                    imovel.cor = '#B15928';
                    break;
                }
              break;
              case 'fonte':
                this.mudarLegenda('fonte')
                switch (imovel.element.fonte.toUpperCase()) {
                  case 'TRENSURB':
                    imovel.cor = '#00FF00';
                    break;
                  case 'SIAPA':
                    imovel.cor = '#FF0000';
                    break;
                  case 'PREFEITURA DE BELO HORIZONTE':
                    imovel.cor = '#0000FF';
                    break;
                  case 'SPIUNET':
                    imovel.cor = '#657199';
                    break; 
                  default:
                    imovel.cor = '#F5D908';
                    break;
                }
              break;
              default:
                this.mudarLegenda('tipo_ocup')
                switch (imovel.element.tipo_ocup.toLowerCase()) {
                  case 'terreno':
                    imovel.cor = '#00A3EE';
                    break;
                  case 'consolidado de baixa ocupação':
                    imovel.cor = '#D80351';
                    break;
                  case 'imóvel abandonado':
                    imovel.cor = '#3F3F3F';
                    break; 
                  default:
                    imovel.cor = '#F5D908';
                    break;
                }
                break;
            }
          }


          if(filtro.imoveis.graduacao){


            this.mudarLegenda('')
            
              switch (filtro.imoveis.graduacao.id) {
                case 'dist_centro':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'dist_centro')
                  break;
                case 'preco_m2':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'preco_m2')
                  break;
                case 'area_tot':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'area_tot')
                  break;
                case 'den_est':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'den_est')
                  break;
                case 'renda_est':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'renda_est')
                  break;
                case 'ivs_atlas':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'ivs_atlas')
                  break;
                case 'ivs_renda':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'ivs_renda')
                  break;
                case 'ivs_infra':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'ivs_infra')
                  break;
                case 't_vulner_mais1h':
                  imovel.cor = this.calcularGraduacao(imovel.element, 't_vulner_mais1h')
                  break;
                case 'declividade':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'declividade')
                  break;
                case 'pois_com':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'pois_com')
                  break;
                case 'pois_saude':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'pois_saude')
                  break;
                case 'pois_edu':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'pois_edu')
                  break;
                case 'i_priorizacao':
                  imovel.cor = this.calcularGraduacao(imovel.element, 'i_priorizacao')
                  break;
                default:
                  imovel.cor = this.calcularGraduacao(imovel.element, 'dist_centro')
                  break;
              }
            
            
          }

          let isValido = true
          if(filtro.imoveis.categorias.length > 0){
            filtro.imoveis.categorias.forEach(categoria => {
              if(categoria === 'app'){
                if(imovel.element.app !== 'TRUE'){
                  isValido = false
                }
              }
              if(categoria === 'iso_10'){
                if(imovel.element.iso_10 !== 'TRUE'){
                  isValido = false
                }
              }
              if(categoria === 'iso_15'){
                if(imovel.element.iso_15 !== 'TRUE'){
                  isValido = false
                }
              }
            })
          }

          if(!isValido){
            return;
          }


          if(filtro.imoveis.ufs.length > 0){
            if(filtro.imoveis.municipios.length > 0){
              if(filtro.imoveis.bairros.length > 0){
              filtro.imoveis.ufs.forEach(uf => {
                if(uf === imovel.element.uf){
                  filtro.imoveis.municipios.forEach(municipio => {
                    if(municipio === imovel.element.municipio){
                      filtro.imoveis.bairros.forEach(bairro => {
                        if(bairro === imovel.element.bairro){
                          
                          this.mapUtil.addImovel(imovel.polyline, this.map, imovel.cor, imovel.element)
                        }
                      })
                      
                    }
                  })
                }
              })
              }else{
                filtro.imoveis.ufs.forEach(uf => {
                  if(uf === imovel.element.uf){
                  filtro.imoveis.municipios.forEach(municipio => {
                    if(municipio === imovel.element.municipio){                    
                      this.mapUtil.addImovel(imovel.polyline, this.map, imovel.cor, imovel.element)                                                               
                    }
                  })
                  }
                })
              }
            }else{
              if(filtro.imoveis.bairros.length > 0){
                filtro.imoveis.ufs.forEach(uf => {
                  if(uf === imovel.element.uf){
                    filtro.imoveis.bairros.forEach(bairro => {
                      if(bairro === imovel.element.bairro){
                        this.mapUtil.addImovel(imovel.polyline, this.map, imovel.cor, imovel.element)
                      }
                    })
                  }
                })
              }else{
                filtro.imoveis.ufs.forEach(uf => {
                  if(uf === imovel.element.uf){
                    this.mapUtil.addImovel(imovel.polyline, this.map, imovel.cor, imovel.element)
                  }
                })
              }
            }
          } else {
            if(filtro.imoveis.municipios.length > 0){
              if(filtro.imoveis.bairros.length > 0){
                filtro.imoveis.municipios.forEach(municipio => {
                  if(municipio === imovel.element.municipio){
                    filtro.imoveis.bairros.forEach(bairro => {
                      if(bairro === imovel.element.bairro){
                        this.mapUtil.addImovel(imovel.polyline, this.map, imovel.cor, imovel.element)
                      }
                    })
                    
                  }
                })
              }else{
                filtro.imoveis.municipios.forEach(municipio => {
                  if(municipio === imovel.element.municipio){
                    this.mapUtil.addImovel(imovel.polyline, this.map, imovel.cor, imovel.element)
                  }
                })
              }
            }else{
              if(filtro.imoveis.bairros.length > 0){
                filtro.imoveis.bairros.forEach(bairro => {
                  if(imovel.element.bairro === bairro){
                    this.mapUtil.addImovel(imovel.polyline, this.map, imovel.cor, imovel.element)
                  }
                })
              }else{
                this.mapUtil.addImovel(imovel.polyline, this.map, imovel.cor, imovel.element)
              }
            }
          }
          
        
      
      })
      
    }
    
  }

  private initMap(route = undefined) {
    
    if (!this.map) {
      this.map = this.mapUtil.createMap(this.mapElement);
    }

    this.mapUtil.cleanMarkers();
    this.mapUtil.cleanPolylines();
    
    let data = [];
    this.afd.collection(Constants.PATH_DOCUMENTS_IMOVEIS,
      ref => ref
              // .where('ano', '==', ano)
              // .orderBy('numero')
    )
    .snapshotChanges()
    .map(actions => actions.map(_data => {
      const data = _data.payload.doc.data();
      const id = _data.payload.doc.id;

      const obj = { id, ...data };
      return obj;
    })).take(1).subscribe(_data => {
      
      const data2 = _data.map(_item => {
        
        _item['points'] = wkt.parse(_item['wkt']).coordinates;
        
        return _item;
      });

      if(data2){
        let arrayData = []
          for(let i in data2){
                
                arrayData.push(data2[i]);
              
          }
        
          let municipios = []
          let bairros = []
          let tiposOcupacoes = []
          let tiposSetores = []
          let fontes = []
         
        arrayData.forEach(element => {


          if(this.imoveis.find(imovel => imovel.element.id_gen.slice(0,8) === element.id_gen.slice(0,8))){
            return;
          }

          let cor;
          if(!municipios.find(municipio => municipio.municipio === element.municipio) && !!element.municipio){
            municipios.push({municipio: element.municipio, uf: element.uf})
          }
          
          if(!bairros.find(item => item.bairro === element.bairro) && !!element.bairro){
            bairros.push({municipio: element.municipio, uf: element.uf, bairro: element.bairro})
          }

          if(!tiposOcupacoes.find(item => item === element.tipo_ocup) && !!element.tipo_ocup){
            tiposOcupacoes.push(element.tipo_ocup)
          }

          if(!tiposSetores.find(item => item === element.tipo_setor) && !! element.tipo_setor){
            tiposSetores.push(element.tipo_setor)
          }

          if(!fontes.find(item => item === element.fonte) && !!element.fonte){
            fontes.push(element.fonte)
          }


          const tipoOcupacao = element.tipo_ocup.toLowerCase()

          switch (tipoOcupacao) {
            case 'terreno':
              cor = '#00A3EE';
              break;
            case 'consolidado de baixa ocupação':
              cor = '#D80351';
              break;
            case 'imóvel abandonado':
              cor = '#3F3F3F';
              break; 
            default:
              cor = '#F5D908';
              break;
          }



          element.points.forEach(coordenadas => {
          
            
            coordenadas.forEach((singular, index) => {
              
              let polyline = []
              singular.forEach(coordenada => {
                const posicao = new Position({lat: coordenada[1], lng: coordenada[0]})
                polyline.push(posicao)
              });
              
              this.imoveis.push({polyline, cor, element})
              this.mapUtil.addImovel(polyline, this.map,cor, element)
            });
          })
        });

        this.municipios = municipios;
        this.bairros = bairros;
        this.tiposOcupacoes = tiposOcupacoes;
        this.tiposSetores = tiposSetores;
        this.fontes = fontes;
        
      }
        
       
    });

    this.afd.collection(Constants.PATH_DOCUMENTS_BUFFER_ESTACOES,
      ref => ref
              // .where('ano', '==', ano)
              // .orderBy('numero')
    )
    .snapshotChanges()
    .map(actions => actions.map(_data => {
      const data = _data.payload.doc.data();
      const id = _data.payload.doc.id;

      const obj = { id, ...data };
      return obj;
    })).take(1).subscribe(_data => {
      
      const data2 = _data.map(_item => {
        
        _item['points'] = wkt.parse(_item['wkt']).coordinates;
        
        return _item;
      });

      if(data2){
        let arrayData = []
          for(let i in data2){
                
                arrayData.push(data2[i]);
              
          }
        
       
       
        arrayData.forEach(element => {
          const cor = '#FA5555';
        
          

          element.points.forEach(coordenadas => {
            
            
            coordenadas.forEach((singular, index) => {
              
              let polyline = []
              singular.forEach(coordenada => {
                const posicao = new Position({lat: coordenada[1], lng: coordenada[0]})
                polyline.push(posicao)
              });
              
              this.bufferEstacoes.push({polyline, cor, element})
              // this.mapUtil.addPolyline(polyline, this.map, cor, 'bufferEstacao', element)
            });
          })
        });

        
      }
        
       
    });

    this.afd.collection(Constants.PATH_DOCUMENTS_AREA_CAMINHAVEL,
      ref => ref
              // .where('ano', '==', ano)
              // .orderBy('numero')
    )
    .snapshotChanges()
    .map(actions => actions.map(_data => {
      const data = _data.payload.doc.data();
      const id = _data.payload.doc.id;

      const obj = { id, ...data };
      return obj;
    })).take(1).subscribe(_data => {
      
      const data2 = _data.map(_item => {
        
        _item['points'] = wkt.parse(_item['wkt']).coordinates;
       
        
        return _item;
      });

      if(data2){
        let arrayData = []
          for(let i in data2){
                
                arrayData.push(data2[i]);
              
          }
        
       
       
          arrayData.forEach(element => {
            const cor = '#FA5555';
          
            
  
            element.points.forEach(coordenadas => {
              
              
              coordenadas.forEach((singular, index) => {
                
                let polyline = []
                singular.forEach(coordenada => {
                  const posicao = new Position({lat: coordenada[1], lng: coordenada[0]})
                  polyline.push(posicao)
                });
                
                console.log('pusharea', polyline)
                this.areaCaminhavel.push({polyline, cor, element})
                // this.mapUtil.addPolyline(polyline, this.map, cor, 'bufferEstacao', element)
              });
            })
          });

        
      }
        
       
    });

    this.afd.collection(Constants.PATH_DOCUMENTS_BUFFER_LINHAS,
      ref => ref
              // .where('ano', '==', ano)
              // .orderBy('numero')
    )
    .snapshotChanges()
    .map(actions => actions.map(_data => {
      const data = _data.payload.doc.data();
      const id = _data.payload.doc.id;

      const obj = { id, ...data };
      return obj;
    })).take(1).subscribe(_data => {
      
      const data2 = _data.map(_item => {
        
        _item['points'] = wkt.parse(_item['wkt']).coordinates;
        
        
        return _item;
      });

      if(data2){
        let arrayData = []
          for(let i in data2){
                
                arrayData.push(data2[i]);
              
          }
        
       
       
          arrayData.forEach(element => {
            const cor = '#DDBBBB';
            const strokeColor = '#F9F11B'
          
            element.points.forEach(coordenadas => {
              
              
              coordenadas.forEach((singular, index) => {
                
                let polyline = []
                singular.forEach(coordenada => {

                  const posicao = new Position({lat: coordenada[1], lng: coordenada[0]})
                  polyline.push(posicao)
                });
                
                console.log('push', polyline)
                this.bufferLinhas.push({polyline, cor, strokeColor, element})
                // this.mapUtil.addPolyline(polyline, this.map, cor, 'bufferEstacao', element)
              });
            })
          });
  

        
      }
        
       
    });

    this.afd.collection(Constants.PATH_DOCUMENTS_ESTACOES,
      ref => ref
              // .where('ano', '==', ano)
              // .orderBy('numero')
    )
    .snapshotChanges()
    .map(actions => actions.map(_data => {
      const data = _data.payload.doc.data();
      const id = _data.payload.doc.id;

      const obj = { id, ...data };
      return obj;
    })).take(1).subscribe(_data => {
      
      const data2 = _data.map(_item => {
        return _item;
      });

      if(data2){
        let arrayData = []
        for(let i in data2){
            arrayData.push(data2[i]);
        }

        let coordenadasTotais = []
        arrayData.length > 0 && arrayData.forEach(estacao => {
          const coordenadas = wkt.parse(estacao.wkt).coordinates
          coordenadasTotais.push({lat: coordenadas[1], lng: coordenadas[0], name: estacao.name})
        })

        // this.mapUtil.showRodoviaPoints(coordenadasTotais, this.map, false, 'limite-municipio', false)
        this.mapUtil.addEstacao(coordenadasTotais, this.map)

        this.estacoes = {coordenadas: coordenadasTotais}

      }
    });

    this.afd.collection(Constants.PATH_DOCUMENTS_LINHAS,
      ref => ref
              // .where('ano', '==', ano)
              // .orderBy('numero')
    )
    .snapshotChanges()
    .map(actions => actions.map(_data => {
      const data = _data.payload.doc.data();
      const id = _data.payload.doc.id;

      const obj = { id, ...data };
      return obj;
    })).take(1).subscribe(_data => {
      
      const data2 = _data.map(_item => {
        return _item;
      });

      
      if(data2){
        let arrayData = []
        for(let i in data2){
            arrayData.push(data2[i]);
        }

        arrayData.length > 0 && arrayData.forEach(linha => {
          const coordenadas = wkt.parse(linha.wkt).coordinates
          coordenadas.forEach((singular, index) => {
              
            let polyline = []
            singular.forEach(coordenada => {
              const posicao = new Position({lat: coordenada[1], lng: coordenada[0]})
              polyline.push(posicao)
            });
            
            this.linhas.push({polyline, cor: '#9B1C04', element: linha})
            // this.mapUtil.addPolyline(polyline, this.map, '#9B1C04', 'linha', linha)
            this.mapUtil.addLinha(polyline, this.map, '#9B1C04', linha)
          });
        })
      }
    });

    this.afd.collection(Constants.PATH_DOCUMENTS_LINHAS_PLANEJADAS,
      ref => ref
              // .where('ano', '==', ano)
              // .orderBy('numero')
    )
    .snapshotChanges()
    .map(actions => actions.map(_data => {
      const data = _data.payload.doc.data();
      const id = _data.payload.doc.id;

      const obj = { id, ...data };
      return obj;
    })).take(1).subscribe(_data => {
      
      const data2 = _data.map(_item => {
        return _item;
      });

      
      if(data2){
        let arrayData = []
        for(let i in data2){
            arrayData.push(data2[i]);
        }

        arrayData.length > 0 && arrayData.forEach(linha => {
          const coordenadas = wkt.parse(linha.wkt).coordinates
          coordenadas.forEach((singular, index) => {
              
            let polyline = []
            singular.forEach(coordenada => {
              const posicao = new Position({lat: coordenada[1], lng: coordenada[0]})
              polyline.push(posicao)
            });
            
            this.linhasPlanejadas.push({polyline, cor: '#800080', element: linha})
            // this.mapUtil.addPolyline(polyline, this.map, '#9B1C04', 'linha', linha)
            this.mapUtil.addLinha(polyline, this.map, '#800080', linha)
          });
        })
      }
    });

    this.mapUtil.setCenter('MG', this.map)

  }

 

}
