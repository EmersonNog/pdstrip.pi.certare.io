import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../environments/constants';
import { User } from '../../models/user';
import { AssetsJsonProvider } from '../../providers/assets-json/assets-json';
import { RodoviaProvider } from '../../providers/rodovia/rodovia';
import { UserService } from '../../providers/user/user.service';
import { MapUtil, Position } from '../../util/map.util';
import { AngularFirestore } from "angularfire2/firestore";

import wkt from "wkt";
import { pureArrayDef } from '@angular/core/src/view';
import { elementAt } from 'rxjs/operator/elementAt';
import { truncateSync } from 'fs';

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

  rodovia;
  sre;
  estacoes = {coordenadas : []};
  linhas = [];
  bufferLinhas = [];
  bufferEstacoes = [];
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
  bufferEstacoesAtivas = false;
  bufferLinhasAtivas = false;

  legendaOcupacao = true;
  legendaGPriorizacao = false;
  legendaApp = false;
  legendaFonte = false;
  legendaIso10 = false;
  legendaIso15 = false;

  categorias = []
  categorizacao = {info: 'Tipo ocupação', id: 'tipo_ocup'}


cores = {
  terreno: '#CFF09E',
  consolidadoBaixaOcupacao: '#3B8686',
  imovelAbandonado: '#333333',
  verdadeiro: '#00FF00',
  falso: '#FF0000',
  valor1: '#FF0000',
  valor2: '#00FF00',
  valor3: '#0000FF',
  valor4: '#333333',
  SIAPA: '#FF0000',
  TRENSURB: '#00FF00',
  PREFEITURA_DE_BELO_HORIZONTE: '#0000FF',
  SPIUNET: '#333333'


}




  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController,
    private userService: UserService,
    private rodoviaService: RodoviaProvider,
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
    switch (tipoLegenda) {
      case 'tipo_ocup':
        this.legendaOcupacao = true;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        break;
      case 'g_priorizacao':
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = true;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        break;
      case 'app':
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = true;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        break;
      case 'fonte':
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = true;
        this.legendaIso10 = false;
        this.legendaIso15 = false;
        break;
      case 'iso_10':
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = true;
        this.legendaIso15 = false;
        break;
      case 'iso_15':
        this.legendaOcupacao = false;
        this.legendaGPriorizacao = false;
        this.legendaApp = false;
        this.legendaFonte = false;
        this.legendaIso10 = false;
        this.legendaIso15 = true;
        break;
      default:
        break;
    }
  }

  // converterTeste(){

    
  //   this.provider.getJsonTeste().subscribe(data => {
  //     let arr = []

  //     for(var i in data){
  //       arr.push(data[i]);
  //     }

  //     console.log(arr)
      

  //     arr.forEach((item, idx) => {
  //       console.log('enviando arquivo ' + idx);
  //       const id = this.afd.createId();
  //       item.id = id;
  //       this.afd.doc(Constants.PATH_DOCUMENTS_BUFFER_LINHAS + item.id).set(JSON.parse(JSON.stringify(item)));
  //     })
  //   })
  // }

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
      categorizacao: this.categorizacao


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
            categorizacao: !!_data.categorizacao ? _data.categorizacao : null
          },       
          linhas: {ativo: _data.ativos.linhas}, 
          bufferEstacoes: {ativo: _data.ativos.bufferEstacoes}, 
          bufferLinhas: {ativo: _data.ativos.bufferLinhas}
        }

        this.estacoesAtivas = _data.ativos.estacoes;
        this.imoveisAtivos = _data.ativos.imoveis;
        this.linhasAtivas = _data.ativos.linhas;
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

        this.filtrar(filtro)
        
       

      }
    });
    filterPage.present();
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  filtraApp(){

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
      categorizacao: null
    }, 
    linhas: {ativo: true}, 
    bufferEstacoes: {ativo: false}, 
    bufferLinhas: {ativo: false}
  }
  ){

    this.mapUtil.cleanMarkers();
    this.mapUtil.cleanPolylines();
    this.mapUtil.cleanPolygons();

    if(filtro.estacoes.ativo){
      this.mapUtil.showRodoviaPoints(this.estacoes.coordenadas, this.map, false, 'limite-municipio', false)
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

          
          if(filtro.imoveis.categorizacao){
            switch (filtro.imoveis.categorizacao.id) {
              case 'tipo_ocup':
                this.mudarLegenda('tipo_ocup')
                switch (imovel.element.tipo_ocup.toLowerCase()) {
                  case 'terreno':
                    imovel.cor = '#CFF09E';
                    break;
                  case 'consolidado de baixa ocupação':
                    imovel.cor = '#3B8686';
                    break;
                  case 'imóvel abandonado':
                    imovel.cor = '#333333';
                    break; 
                  default:
                    imovel.cor = '#B15928';
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
                    imovel.cor = '#B15928';
                    break;
                }
              break;
              default:
                this.mudarLegenda('tipo_ocup')
                switch (imovel.element.tipo_ocup.toLowerCase()) {
                  case 'terreno':
                    imovel.cor = '#CFF09E';
                    break;
                  case 'consolidado de baixa ocupação':
                    imovel.cor = '#3B8686';
                    break;
                  case 'imóvel abandonado':
                    imovel.cor = '#333333';
                    break; 
                  default:
                    imovel.cor = '#B15928';
                    break;
                }
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
                          
                          this.mapUtil.addPolyline(imovel.polyline, this.map, imovel.cor, 'imovel', imovel.element)
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
                      this.mapUtil.addPolyline(imovel.polyline, this.map, imovel.cor, 'imovel', imovel.element)                                                               
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
                        this.mapUtil.addPolyline(imovel.polyline, this.map, imovel.cor, 'imovel', imovel.element)
                      }
                    })
                  }
                })
              }else{
                filtro.imoveis.ufs.forEach(uf => {
                  if(uf === imovel.element.uf){
                    this.mapUtil.addPolyline(imovel.polyline, this.map, imovel.cor, 'imovel', imovel.element)
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
                        this.mapUtil.addPolyline(imovel.polyline, this.map, imovel.cor, 'imovel', imovel.element)
                      }
                    })
                    
                  }
                })
              }else{
                filtro.imoveis.municipios.forEach(municipio => {
                  if(municipio === imovel.element.municipio){
                    this.mapUtil.addPolyline(imovel.polyline, this.map, imovel.cor, 'imovel', imovel.element)
                  }
                })
              }
            }else{
              if(filtro.imoveis.bairros.length > 0){
                filtro.imoveis.bairros.forEach(bairro => {
                  if(imovel.element.bairro === bairro){
                    this.mapUtil.addPolyline(imovel.polyline, this.map, imovel.cor, 'imovel', imovel.element)
                  }
                })
              }else{
                this.mapUtil.addPolyline(imovel.polyline, this.map, imovel.cor, 'imovel', imovel.element)
              }
            }
          }
          
        
      
      })
      
    }
    if(filtro.linhas.ativo){
      this.linhas.length > 0 && this.linhas.forEach(linha => {
        
        this.mapUtil.addPolyline(linha.polyline, this.map, linha.cor, 'linha', linha.element)
      })
    }
    if(filtro.bufferEstacoes.ativo){
      this.bufferEstacoes.length > 0 && this.bufferEstacoes.forEach(buffer => {
        this.mapUtil.addPolyline(buffer.polyline, this.map, buffer.cor, 'bufferEstacao', buffer.element)
      })

    }
    if(filtro.bufferLinhas.ativo){
     
      this.bufferLinhas.length > 0 && this.bufferLinhas.forEach(buffer => {
       
        this.mapUtil.addPolyline(buffer.polyline, this.map, buffer.cor, 'bufferLinha', buffer.element)
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

          


         
        
          // switch (element.tipo_imovel) {
          //   case 'TERRENO':
          //     cor = '#33A02C';
          //     break;
          //   case 'MUSEU':
          //     cor = '#6A3D9A';
          //     break;
          //   case 'REPRESA':
          //     cor = '#1F78B4';
          //     break;
          //   case 'GALPÃO':
          //     cor = '#FF7F00';
          //     break;
          //   case 'PÁTIO FERROVIÁRIO':
          //     cor = '#CAB2D6';
          //     break;
          //   case 'EDIFÍCIO / PRÉDIO':
          //     cor = '#33A02C';
          //     break;
          //   case 'REPRESA':
          //     cor = '#1F78B4';
          //     break;
          //   default:
          //     cor = '#B15928';
          //     break;
          // }

          const tipoOcupacao = element.tipo_ocup.toLowerCase()

          switch (tipoOcupacao) {
            case 'terreno':
              cor = '#CFF09E';
              break;
            case 'consolidado de baixa ocupação':
              cor = '#3B8686';
              break;
            case 'imóvel abandonado':
              cor = '#333333';
              break; 
            default:
              cor = '#B15928';
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
              this.mapUtil.addPolyline(polyline,this.map, cor, 'imovel', element)
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
          const cor = '#D9D9D9';
        
        

          element.points.forEach((coordenadas, i) => {
            
            let polyline = []
            coordenadas.forEach((singular, index) => {
              
              
              
                const posicao = new Position({lat: singular[1], lng: singular[0]})
                polyline.push(posicao)
              
              
              
              // this.mapUtil.addPolyline(polyline,this.map, cor, 'bufferLinha', element)
            });
              if(i === 0){
                this.bufferLinhas.push({polyline, cor, element})
              }
              
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

        this.mapUtil.showRodoviaPoints(coordenadasTotais, this.map, false, 'limite-municipio', false)
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
            this.mapUtil.addPolyline(polyline, this.map, '#9B1C04', 'linha', linha)
          });
        })
      }
    });

    
    // this.filtrar()
    this.mapUtil.setCenter('MG', this.map)

    
   
  }

  openImagensPage(event) {

    let button = document.getElementById('btn-show-estacionar-page-2');
    let levantamentoId = button.getAttribute("levantamentoId");
    let key = button.getAttribute("key");
    let name = button.getAttribute("name");
    let lat = button.getAttribute("lat");
    let lng = button.getAttribute("lng");
    let distance = button.getAttribute("distance");
    let sre_inic = button.getAttribute("sre_inic");
    let sre_fim = button.getAttribute("sre_fim");
    let sre_sit = button.getAttribute("sre_sit");
    let ce = button.getAttribute("ce");
    let rodovia = button.getAttribute("rodovia");
    let sre = button.getAttribute("sre");

    const params = { name: name, lat: lat, lng: lng, distance: distance,
      ce: ce, pathImage: rodovia, key: key, levantamentoId: 'areas_de_exames', type: 'exames' };

    this.modalCtrl.create('ImagensTrechoPage', params)
      .present();
  }

}
