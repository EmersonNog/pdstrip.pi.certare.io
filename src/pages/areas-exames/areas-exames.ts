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

@IonicPage()
@Component({
  selector: 'page-areas-exames',
  templateUrl: 'areas-exames.html',
})
export class AreasExamesPage {

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
  static municipios = [];
  static bairros = [];
  static ufs = [
    {nome: "Acre", sigla: "AC"},
    {nome: "Alagoas", sigla: "AL"},
    {nome: "Amapá", sigla: "AP"},
    {nome: "Amazonas", sigla: "AM"},
    {nome: "Bahia", sigla: "BA"},
    {nome: "Ceará", sigla: "CE"},
    {nome: "Distrito Federal", sigla: "DF"},
    {nome: "Espírito Santo", sigla: "ES"},
    {nome: "Goiás", sigla: "GO"},
    {nome: "Maranhão", sigla: "MA"},
    {nome: "Mato Grosso", sigla: "MT"},
    {nome: "Mato Grosso do Sul", sigla: "MS"},
    {nome: "Minas Gerais", sigla: "MG"},
    {nome: "Pará", sigla: "PA"},
    {nome: "Paraíba", sigla: "PB"},
    {nome: "Paraná", sigla: "PR"},
    {nome: "Pernambuco", sigla: "PE"},
    {nome: "Piauí", sigla: "PI"},
    {nome: "Rio de Janeiro", sigla: "RJ"},
    {nome: "Rio Grande do Norte", sigla: "RN"},
    {nome: "Rio Grande do Sul", sigla: "RS"},
    {nome: "Rondônia", sigla: "RO"},
    {nome: "Roraima", sigla: "RR"},
    {nome: "Santa Catarina", sigla: "SC"},
    {nome: "São Paulo", sigla: "SP"},
    {nome: "Sergipe", sigla: "SE"},
    {nome: "Tocantins", sigla: "TO"}

]

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

  openFilterPage() {
    const filterPage = this.modalCtrl.create(Constants.FILTER_PAGE.name, {
      // user: this.user, map: this.map, users: this.users, groups: this.managerGroups
    });
    filterPage.onDidDismiss(_data => {
      console.log('filters', _data);
      if (_data) {
        console.log(_data.ativos.imoveis)
        const filtro = {
          estacoes : {ativo: _data.ativos.estacoes}, 
          imoveis: {ativo: _data.ativos.imoveis, 
            ufs: _data.ufs.length > 0 ? _data.ufs.map(item => item.sigla) : [], 
            municipios: _data.municipios.length > 0 ? _data.municipios.map(item => item.municipio) : [], 
            bairros: _data.bairros.length > 0 ? _data.bairros.map(item => item.bairro) : []}, 
          linhas: {ativo: _data.ativos.linhas}, 
          bufferEstacoes: {ativo: _data.ativos.bufferEstacoes}, 
          bufferLinhas: {ativo: _data.ativos.bufferLinhas}}
        this.filtrar(filtro)
      }
    });
    filterPage.present();
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
    
  filtrar(filtro = {estacoes : {ativo: true}, imoveis: {ativo: true, ufs: [], municipios: [], bairros: []}, linhas: {ativo: true}, bufferEstacoes: {ativo: false}, bufferLinhas: {ativo: false}}){

    this.mapUtil.cleanMarkers();
    this.mapUtil.cleanPolylines();
    this.mapUtil.cleanPolygons();

    console.log('munis', AreasExamesPage.municipios)
    console.log('bairros', AreasExamesPage.bairros)

    if(filtro.estacoes.ativo){
      this.mapUtil.showRodoviaPoints(this.estacoes.coordenadas, this.map, false, 'limite-municipio', false)
    }
    if(filtro.imoveis.ativo){
      this.imoveis.length > 0 && this.imoveis.forEach(imovel => {
        if(filtro.imoveis.ufs.length > 0){
          if(filtro.imoveis.municipios.length > 0){
            if(filtro.imoveis.bairros.length > 0){
             filtro.imoveis.ufs.forEach(uf => {
               if(uf === imovel.element.uf){
                filtro.imoveis.municipios.forEach(municipio => {
                  if(municipio === imovel.element.muni){
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
                   if(municipio === imovel.element.muni){                    
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
                if(municipio === imovel.element.muni){
                  filtro.imoveis.bairros.forEach(bairro => {
                    if(bairro === imovel.element.bairro){
                      this.mapUtil.addPolyline(imovel.polyline, this.map, imovel.cor, 'imovel', imovel.element)
                    }
                  })
                  
                }
              })
            }else{
              filtro.imoveis.municipios.forEach(municipio => {
                if(municipio === imovel.element.muni){
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
         
        arrayData.forEach(element => {
          let cor;
          if(!municipios.find(municipio => municipio.municipio === element.muni)){
            municipios.push({municipio: element.muni, uf: element.uf})
          }
          
          if(!bairros.find(item => item.bairro === element.bairro)){
            bairros.push({municipio: element.muni, uf: element.uf, bairro: element.bairro})
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

        AreasExamesPage.municipios = municipios;
        AreasExamesPage.bairros = bairros;
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
          const cor = '#E6E6E6';
        
        

          element.points.forEach(coordenadas => {
            
            
            coordenadas.forEach((singular, index) => {
              
              let polyline = []
              singular.forEach(coordenada => {
                const posicao = new Position({lat: coordenada[1], lng: coordenada[0]})
                polyline.push(posicao)
              });
              
              this.bufferLinhas.push({polyline, cor, element})
              // this.mapUtil.addPolyline(polyline,this.map, cor, 'bufferLinha', element)
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

    console.log(this.estacoes)
    
   
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
