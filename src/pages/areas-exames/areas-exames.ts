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
        this.afd.doc(Constants.PATH_DOCUMENTS_ESTACOES + item.id).set(JSON.parse(JSON.stringify(item)));
      })
    })
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
                if(data2[i]['uf'] === 'MG'){
                arrayData.push(data2[i]);
              }
          }
        
        console.log(arrayData)
         
        arrayData.forEach(element => {
          let cor = '#1F78B4'
        
          if(element.ocupacao === 'Consolidado de baixa ocupação'){
            cor = '#0000FF'
          }else if(element.ocupacao === 'Imóvel abandonado'){
            cor = '#000000'
          }else if(element.ocupacao === 'Terreno'){
            cor = '#FF0000'
          }

          element.points.forEach(coordenadas => {
            
            
            coordenadas.forEach((singular, index) => {
              
              let polyline = []
              singular.forEach(coordenada => {
                const posicao = new Position({lat: coordenada[1], lng: coordenada[0]})
                polyline.push(posicao)
              });
              
              this.mapUtil.addPolyline(polyline, this.map, cor)
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
          coordenadasTotais.push({lat: coordenadas[1], lng: coordenadas[0]})
        })

        this.mapUtil.showRodoviaPoints(coordenadasTotais, this.map, false, 'limite-municipio', false)
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
            
            this.mapUtil.addPolyline(polyline, this.map, '#9B1C04')
          });
        })
      }
    });

    

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
