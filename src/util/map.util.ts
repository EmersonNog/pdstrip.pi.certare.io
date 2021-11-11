// import { Rodovia } from '../models/rodovia';
import { DateUtil } from './date.util';
import { MapUtil2 } from './map.util2';

declare var google: any;

export class MapUtil {

  static classificacaoNome = 'HDM4';
  static classificacaoSayers = 'PAVIMENTO_NOVO';
  static classificacaoObj = {};
  
  

  mapUtil = new MapUtil2();

  createMap(mapElement){
    return this.mapUtil.createMap(mapElement);
  }

  public mapOptions() {
    return this.mapUtil.mapOptions();
  }

  public destroy(){
    this.mapUtil.destroy();
  }

  

  addInfoWindow(poly, content, map, infowindow) {
    infowindow = new google.maps.InfoWindow();

    

    google.maps.event.addListener(poly, 'click', function(event) {
      // infowindow.content = content;
      
      infowindow.setContent(content);

      // infowindow.position = event.latLng;
      infowindow.setPosition(event.latLng);
      
      MapUtil2.infoWindows.length > 0 && MapUtil2.infoWindows.forEach(infow => infow.close())
      infowindow.open(map);
      MapUtil2.infoWindows.push(infowindow)
    });

    

    // google.maps.event.addListener(poly, 'click', function(event) {
    //   // infowindow.content = content;
    //   infowindow.setContent(content);

    //   // infowindow.position = event.latLng;
    //   infowindow.setPosition(event.latLng);
    //   infowindow.open(map);
    // });
  }

  

  public setCenter(estado = 'MG', map){
    if(estado === 'MG'){
      map.setCenter({lat: -19.886066, lng: -43.9081736});
    } else if(estado === 'RS') {
      map.setCenter({lat: -29.7487866572924, lng: -51.145309434955});
    } else {
      map.setCenter({lat: -19.886066, lng: -43.9081736});
    }
    map.setZoom(14);
  }


  //   desativaInfoWindows(){
  //   this.infowindowAtiva.length > 0  && this.infowindowAtiva.forEach(infowindow => infowindow.close())
  // }
  

  public showRodoviaPoints(route: any, map, isAcidente=false, type=undefined, showBtnImages=true) {
    let itemArr: any[] = route
    let polyline;
    const latArrOk = itemArr.filter(item => item.lat !== 0.0);
    const hasPoints = latArrOk.length > 0;

    // console.log('TT', itemArr);

    if(itemArr.length > 0 && hasPoints) {
      let indexCenter = (itemArr.length/2 | 0); // cast para int
      // console.log('center', {lat: itemArr[indexCenter].lat, lng: itemArr[indexCenter].lng});

      

      for(let i = 0; i < itemArr.length; i++) {

        if(type && type === 'limite-municipio') {
          let cor = '#EA4444'
          
          // polyline = new google.maps.Polyline(this.createPolylineBall(itemArr[i], cor));
          polyline = new google.maps.Marker({
            position: {lat: itemArr[i].lat, lng: itemArr[i].lng},
            title: itemArr[i]['title'],
            icon: new google.maps.MarkerImage(
                "assets/icon/" + 'iconEstacao.svg', 
              // 'https://mt.google.com/vt/icon?psize=16&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=1&text=I',
              // 'https://mt.google.com/vt/icon?psize=16&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=1&text=F',
              ),
          })
          this.addInfoWindow(polyline, 'Nome da estação: ' + itemArr[i].name, map, new google.maps.InfoWindow());

        } else {

          polyline = new google.maps.Marker({
            position: {lat: itemArr[i].lat, lng: itemArr[i].lng},
            title: itemArr[i]['title'],
            icon: new google.maps.MarkerImage(
                "assets/icon/" + itemArr[i]['icon'], 
              // 'https://mt.google.com/vt/icon?psize=16&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=1&text=I',
              // 'https://mt.google.com/vt/icon?psize=16&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=1&text=F',
              ),
          });
        }

        // polyline = new google.maps.Polyline(this.createPolylineOptionsGeneric(itemArr[i]));
        polyline.setMap(map);
        MapUtil2.polylines.push(polyline);

        if(type && type === 'exames') {

          let infowindow = new google.maps.InfoWindow({
            content: this.createInfoWindowExame(itemArr[i])
          });
          
          // google.maps.event.addListener(polyline, 'click', event => {
          //   infowindow.setPosition(event.latLng);
          //   infowindow.open(map);
          // });
          google.maps.event.addListener(polyline, 'click', event => {
            infowindow.setPosition(event.latLng);
            infowindow.open(map);
            MapUtil2.infoWindows.push(infowindow);

            if (MapUtil2.infoWindows.length > 1) {
              MapUtil2.infoWindows.forEach((value, index, arr) => {
                  if (value != infowindow) {
                      value.close();
                      MapUtil2.infoWindows.splice(index, 1);
                  }
              })
            }
          });

          // google.maps.event.addListener(polyline, 'mouseout', event => {
          //   infowindow.close();
          // });

        } else {
          // let infoWindowContent;

          // if(type && type === 'fotossensor') {
          //   infoWindowContent = this.createInfoWindowFE(itemArr[i], showBtnImages);
          // } else if(type && type === 'faixadominio') {
          //   infoWindowContent = this.createInfoWindowFD(itemArr[i], showBtnImages);
          // } else {
          //   infoWindowContent = this.createInfoWindowGenerico(itemArr[i], isAcidente, showBtnImages)
          // }
          // let infowindow = new google.maps.InfoWindow({
          //   content: infoWindowContent
          // });
          
          // google.maps.event.addListener(polyline, 'click', event => {
          //   infowindow.setPosition(event.latLng);
          //   infowindow.open(map);
          // });
          // google.maps.event.addListener(polyline, 'click', event => {
          //   infowindow.setPosition(event.latLng);
          //   infowindow.open(map);
          //   MapUtil2.infoWindows.push(infowindow);

          //   if (MapUtil2.infoWindows.length > 1) {
          //     MapUtil2.infoWindows.forEach((value, index, arr) => {
          //         if (value != infowindow) {
          //             value.close();
          //             MapUtil2.infoWindows.splice(index, 1);
          //         }
          //     })
          //   }
          // });

          // google.maps.event.addListener(polyline, 'mouseover', event => {
          //   infowindow.setPosition(event.latLng);
          //   infowindow.open(map);
          // });
          
          // google.maps.event.addListener(polyline, 'mouseout', event => {
          //   infowindow.close();
          // });
        }

      }
    }
  }

  public addPolyline(rota: Position[], map, lineColor='#FF4941', tipo, info = {name: '', tipo_ocup: '', bairro: '', endereco_forn: '', area_cons: '', area_tot: ''}) {

    let polyline;
    if(rota && rota.length > 0) {
      
      const idxMeio = Math.floor((rota.length/2));
      const rotaMeio = rota[idxMeio];
      const latlngCenter = {lat: rotaMeio.lat, lng: rotaMeio.lng};
      // map.setCenter(latlngCenter);
      // map.setZoom(11);

      let stroke = 1;

      if(tipo === 'imovel'){
        stroke = 1
      }else if(tipo === 'linha'){
        stroke = 3
      }else if(tipo === 'estacao'){
        stroke = 6
      }

      for(let i = 0; i < rota.length; i++) {
        const _current = rota[i];

        const polylineOpt = {
          path: rota,
          geodesic: tipo === 'bufferLinha' ? false : true,
          strokeColor: lineColor,
          strokeOpacity: tipo === 'bufferEstacao' ?   0 : tipo === 'bufferLinha' ? 0 : 1.0,
          strokeWeight: tipo === 'bufferLinha' ? 0 : 0,
          fillColor: lineColor,
          fillOpacity: tipo === 'bufferLinha' ? 0.01 : 0.01,
          zIndex : tipo === 'bufferEstacao' ? 3 : tipo === 'bufferLinha' ? 1 : 3
        };

        polyline = new google.maps.Polyline(polylineOpt);

        // MapUtil2.polylines.push(polyline);
        

        if(tipo === 'linha'){
          polyline = new google.maps.Polyline(polylineOpt);
          polyline.setMap(map);
          this.addInfoWindow(polyline, 'Linha: ' + info.name, map, new google.maps.InfoWindow());
          MapUtil2.polylines.push(polyline);
        }else if(tipo === 'imovel'){
          const polygon = new google.maps.Polygon(polylineOpt)
          polygon.setMap(map)
          const conteudo = `Endereço: ${info.endereco_forn}<br/> Bairro: ${info.bairro}<br/>Tipo de ocupação: ${info.tipo_ocup}<br/>Área construída: ${info.area_cons}m²<br/>Área total: ${info.area_tot}m²`
          this.addInfoWindow(polygon, conteudo, map, new google.maps.InfoWindow());
          MapUtil2.polygons.push(polygon);
        }else if(tipo === 'estacao'){
          polyline = new google.maps.Polyline(polylineOpt);
          polyline.setMap(map);
          MapUtil2.polylines.push(polyline);
        }else if(tipo === 'bufferEstacao'){
          
          const polygon = new google.maps.Polygon(polylineOpt)
          polygon.setMap(map)
          const conteudo = `Buffer da estação: ${info.name}`
          this.addInfoWindow(polygon, conteudo, map, new google.maps.InfoWindow());
          MapUtil2.polygons.push(polygon);
        }else if(tipo === 'bufferLinha'){
          
          const polygon = new google.maps.Polygon(polylineOpt)
          polygon.setMap(map)
          const conteudo = `Buffer da linha: ${info.name}`
          this.addInfoWindow(polygon, conteudo, map, new google.maps.InfoWindow());
          MapUtil2.polygons.push(polygon);
        }
        
      }
    }
  }

  public addBufferLinha(
    rota: Position[], 
    map,
    cor,
    info: {
      name: ''
    }
    ) {


    if(rota && rota.length > 0) {
      
      for(let i = 0; i < rota.length; i++) {
       

        const options = {
          path: rota,
          geodesic: true,
          strokeColor: cor,
          strokeOpacity: 0.0,
          strokeWeight: 0.0,
          fillColor: cor,
          fillOpacity: 0.01,
          zIndex : 1
        };

        const polygon = new google.maps.Polygon(options)
        polygon.setMap(map)
        const conteudo = `Buffer da linha: ${info.name}`
        this.addInfoWindow(polygon, conteudo, map, new google.maps.InfoWindow());
        MapUtil2.polygons.push(polygon);
        
      }
    }
  }
  public addBufferEstacao(
    rota: Position[], 
    map,
    cor,
    info: {
      name: ''
    }
    ) {

    

    if(rota && rota.length > 0) {
      
      
        

        const options = {
          path: rota,
          geodesic: true,
          strokeColor: cor,
          strokeOpacity: 0.0,
          strokeWeight: 0.0,
          fillColor: cor,
          fillOpacity: 0.2,
          zIndex : 2
        };

        const polygon = new google.maps.Polygon(options)
        polygon.setMap(map)
        const conteudo = `Buffer da estação: ${info.name}`
        this.addInfoWindow(polygon, conteudo, map, new google.maps.InfoWindow());
        MapUtil2.polygons.push(polygon);
      
    }
  }

  public addEstacao(
    rota, 
    map,
    
    ) {

    let marker;

    if(rota && rota.length > 0) {
      
      for(let i = 0; i < rota.length; i++) {
    

        marker = new google.maps.Marker({
          position: {lat: rota[i].lat, lng: rota[i].lng},
          title: rota[i]['name'],
          icon: new google.maps.MarkerImage("assets/icon/" + 'iconEstacao.svg'),
        })

        this.addInfoWindow(marker, 'Nome da estação: ' + rota[i].name, map, new google.maps.InfoWindow());
        marker.setMap(map);
        MapUtil2.polylines.push(marker);

        
      }
    }
  }


  public addLinha(
    rota: Position[], 
    map,
    cor,
    info = {
      name: ''
    }) {

    let polyline;

    if(rota && rota.length > 0) {
      
      

        const options = {
          path: rota,
          geodesic: true,
          strokeColor: cor,
          strokeOpacity: 1.0,
          strokeWeight: 3.0,
          fillColor: cor,
          fillOpacity: 0.01,
          zIndex : 3
        };

        polyline = new google.maps.Polyline(options);
        polyline.setMap(map);
        this.addInfoWindow(polyline, 'Linha: ' + info.name, map, new google.maps.InfoWindow());
        MapUtil2.polylines.push(polyline);
        
      
    }
  }


  public addImovel(
    rota: Position[], 
    map,
    cor,
    info = {
      name: '', 
      tipo_ocup: '', 
      bairro: '', 
      endereco_forn: '', 
      area_cons: '', 
      area_tot: '',
      lat_cons: 0,
      lon_cons: 0
    }) {


    if(rota && rota.length > 0) {
     
      // for(let i = 0; i < rota.length; i++) {

        const options = {
          path: rota,
          geodesic: true,
          strokeColor: cor,
          strokeOpacity: 1.0,
          strokeWeight: 1.0,
          fillColor: cor,
          fillOpacity: 0.7,
          zIndex : 4
        };      

       

        const polyline = new google.maps.Polyline(this.createPolylineBall({lat: info.lat_cons, lng: info.lon_cons }, cor));
        const polygon = new google.maps.Polygon(options)
        polygon.setMap(map)
        polyline.setMap(map)
        const conteudo = `Endereço: ${info.endereco_forn}<br/> Bairro: ${info.bairro}<br/>Tipo de ocupação: ${info.tipo_ocup}<br/>Área construída: ${info.area_cons}m²<br/>Área total: ${info.area_tot}m²`
        this.addInfoWindow(polygon, conteudo, map, new google.maps.InfoWindow());
        MapUtil2.polygons.push(polygon);
        MapUtil2.polylines.push(polyline);
        
      // }
    }
  }

  


  
  public showLevantamentoPoints(route: any, map, levantamentoId) {
    let itemArr: any[] = route.map(item => item.values);
    let polyline;    

    const latArrOk = itemArr.filter(item => item.lat !== 0.0);
    const hasPoints = latArrOk.length > 0;

    // console.log('TT', itemArr);

    if(itemArr.length > 0 && hasPoints) {
      let indexCenter = (itemArr.length/2 | 0); // cast para int
    //   console.log('center', indexCenter);

      map.setCenter({lat: itemArr[indexCenter].lat, lng: itemArr[indexCenter].lng});

      for(let i = 0; i < itemArr.length; i++) {
        polyline = new google.maps.Polyline(this.createPolylineOptions(itemArr[i]));
        polyline.setMap(map);
        MapUtil2.polylines.push(polyline);

        let infowindow = new google.maps.InfoWindow({
          content: this.createInfoWindowLevantamento(itemArr[i], levantamentoId)
        });

        google.maps.event.addListener(polyline, 'click', event => {
          infowindow.setPosition(event.latLng);
          infowindow.open(map);
          MapUtil2.infoWindows.push(infowindow);

          if (MapUtil2.infoWindows.length > 1) {
            MapUtil2.infoWindows.forEach((value, index, arr) => {
                if (value != infowindow) {
                    value.close();
                    MapUtil2.infoWindows.splice(index, 1);
                }
            })
          }
        });

        // google.maps.event.addListener(polyline, 'closeclick', event => {
        //   infowindow.close();
        // });
      }

      /**
       * Download de icones para o google maps:
       * 
       * https://stackoverflow.com/questions/17746740/google-map-icons-with-visualrefresh
       * https://github.com/google/earthenterprise/blob/master/earth_enterprise/src/maps/api/icons/api-3/images/spotlight-poi-dotless.png
       */

      let markerBegin = new google.maps.Marker({
        position: {lat: itemArr[0].lat, lng: itemArr[0].lng},
        title: 'Início do Levantamento',
        // label: 'I',
        icon: new google.maps.MarkerImage(
            "assets/icon/marker-green.png", 
          ),
      });
      
      let markerLast = new google.maps.Marker({
        position: {lat: itemArr[itemArr.length - 1].lat, lng: itemArr[itemArr.length - 1].lng},
        title: 'Fim do Levantamento',
        icon: new google.maps.MarkerImage(
          "assets/icon/marker-red.png", 
        ),
      });

    //   markerBegin.setMap(map);
    //   markerLast.setMap(map);

    //   MapUtil2.markers.push(markerBegin);
    //   MapUtil2.markers.push(markerLast);
    }
    
  }

  public pinSymbol(color) {
    return {
      path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 2,
      scale: 2
    };
  }

  public createPolylineOptions(item: any) {
    let cor = '#2E5C1F'; // excelente

    if(item.buracosUser.length >= 5 || item.remendosUser.length >= 5) {
        cor = "#B33235"; // ruim
    } else if(item.buracosUser.length >= 3 || item.remendosUser.length >= 3) {
        cor = "#A4A437"; // regular
    } else if(item.buracosUser.length >= 1 || item.remendosUser.length >= 1) {
        cor = "#66CC80"; // bom
    } 

    return ({
      path: [{lat: item.lat, lng: item.lng}, {lat: item.lat, lng: item.lng}],
      geodesic: true,
      strokeColor: cor,
      strokeOpacity: 1,
      strokeWeight: 10
    });
  }

  public createPolylineBall(item, cor = '#2E5C1F' ) {
    

    return ({
      path: [{lat: item.lat, lng: item.lng}, {lat: item.lat, lng: item.lng}],
      geodesic: true,
      strokeColor: cor,
      strokeOpacity: 0.95,
      strokeWeight: 8,
      zIndex: 3
    });
  }

  public createPolylineOptionsGeneric(item: any) {
    let cor = '#2E5C1F'; // excelente

    return ({
      path: [{lat: item.lat, lng: item.lng}, {lat: item.lat, lng: item.lng}],
      geodesic: true,
      strokeColor: cor,
      strokeOpacity: 1,
      strokeWeight: 10
    });
  }

  private createInfoWindowLevantamento(item: any, levantamentoId: string) {

    const lavantamentoId = levantamentoId;
    const keyTrack = item.id;
    const name = item.path;
    const lat = DateUtil.getNumberFormatted(item.lat, 6);
    const lng = DateUtil.getNumberFormatted(item.lng, 6);
    const distance = DateUtil.getNumberFormatted(item.distance, 2);
    const qtdRemendos = item.remendosUser.length + '';
    const qtdBuracos = item.buracosUser.length + '';
    const timeProcess = DateUtil.getNumberFormatted(item.timeInMilis, 2);
    const pathImage = item.pathImage;

    let div = document.createElement('div');
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";
    
    let h1 = document.createElement('h1');
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";
    
    let divBody = document.createElement('div');
    divBody.id = "bodyContent";
    
    let p1 = document.createElement('p');
    p1.innerText = 'Imagem: '+ name;
    p1.style.cssText = "font-weight: bold"; 
    
    let p2 = document.createElement('p');
    p2.innerText = 'Distância: '+ distance +' m';
    p2.style.cssText = "font-weight: bold"; 
    
    let p3 = document.createElement('p');
    p3.innerText = 'Remendos: '+ qtdRemendos;
    p3.style.cssText = "font-weight: bold"; 
    
    let p4 = document.createElement('p');
    p4.innerText = 'Buracos: '+ qtdBuracos;
    p4.style.cssText = "font-weight: bold"; 
    
    let p5 = document.createElement('p');
    p5.innerText = 'Processamento: '+ timeProcess + ' ms';
    p5.style.cssText = "font-weight: bold"; 
    
    let buttonImagens = document.createElement('button');
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = 'Imagens';

    buttonImagens.addEventListener('click', () => {
      document.getElementById('btn-show-estacionar-page').setAttribute("levantamentoId", levantamentoId);
      document.getElementById('btn-show-estacionar-page').setAttribute("key", keyTrack);
      document.getElementById('btn-show-estacionar-page').setAttribute("name", name);
      document.getElementById('btn-show-estacionar-page').setAttribute("lat", lat);
      document.getElementById('btn-show-estacionar-page').setAttribute("lng", lng);
      document.getElementById('btn-show-estacionar-page').setAttribute("distance", distance);
      document.getElementById('btn-show-estacionar-page').setAttribute("qtdRemendos", qtdRemendos);
      document.getElementById('btn-show-estacionar-page').setAttribute("qtdBuracos", qtdBuracos);
      document.getElementById('btn-show-estacionar-page').setAttribute("timeProcess", timeProcess);
      document.getElementById('btn-show-estacionar-page').setAttribute("pathImage", pathImage);
      document.getElementById('btn-show-estacionar-page').click();
    });


    div.appendChild(h1);
    
    divBody.appendChild(p1);
    // divBody.appendChild(p2);
    // divBody.appendChild(p3);
    // divBody.appendChild(p4);
    // divBody.appendChild(p5);
    divBody.appendChild(buttonImagens);

    div.appendChild(divBody);

    return div;
  }

  private createInfoWindowExame(item: any) {
    let lat;
    let lng;
    let area;
    let ce;
    let key;

    if(item.lat) {
      lat = DateUtil.getNumberFormatted(item.lat, 6);
    } if(item.lng) {
      lng = DateUtil.getNumberFormatted(item.lng, 6);
    } if(item.area) {
      area = DateUtil.getNumberFormatted(item.area, 0);
    }
    
    key = item.id;
    ce = item.municipio;

    let div = document.createElement('div');
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";
    
    let h1 = document.createElement('h1');
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";
    
    let divBody = document.createElement('div');
    divBody.id = "bodyContent";
    
    let p1 = document.createElement('p');
    p1.innerText = 'Munícipo: '+ ce;
    p1.style.cssText = "font-weight: bold"; 
    
    let p2 = document.createElement('p');
    p2.innerText = 'Área: '+ area + ' m²';
    p2.style.cssText = "font-weight: bold"; 
    
    let buttonImagens = document.createElement('button');
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = 'Imagens';

    buttonImagens.addEventListener('click', () => {
      document.getElementById('btn-show-estacionar-page-2').setAttribute("key", key);
      document.getElementById('btn-show-estacionar-page-2').setAttribute("name", ce);
      document.getElementById('btn-show-estacionar-page-2').setAttribute("lat", lat);
      document.getElementById('btn-show-estacionar-page-2').setAttribute("lng", lng);
      document.getElementById('btn-show-estacionar-page-2').setAttribute("distance", area);
      document.getElementById('btn-show-estacionar-page-2').setAttribute("sre_inic", "");
      document.getElementById('btn-show-estacionar-page-2').setAttribute("sre_fim", "");
      document.getElementById('btn-show-estacionar-page-2').setAttribute("sre_sit", "");
      document.getElementById('btn-show-estacionar-page-2').setAttribute("ce", ce);
      document.getElementById('btn-show-estacionar-page-2').setAttribute("rodovia", item.photo);
      document.getElementById('btn-show-estacionar-page-2').setAttribute("sre", "");
      document.getElementById('btn-show-estacionar-page-2').click();
    });


    div.appendChild(h1);
    divBody.appendChild(p1);
    divBody.appendChild(p2);
    divBody.appendChild(buttonImagens);

    div.appendChild(divBody);

    return div;
  }

  private createInfoWindowFE(item: any, showBtnImages=true) {
    let lat;
    let lng;

    const keyTrack = item.id;
    const name = item.name;
    const rodovia = item.ce;
    
    if(item.lat) {
      lat = DateUtil.getNumberFormatted(item.lat, 6);
    } if(item.lng) {
      lng = DateUtil.getNumberFormatted(item.lng, 6);
    }
    
    let local = item.local + ' - ' + item.cidade;
    let data_de_homologacao = item.data_de_homologacao;
    let sentido = item.sentido;
    let slte = item.site;
    let status_slte = 'Status: ' + item.status_site;
    let tipo_equipamento = item.tipo_equipamento;
    

    let div = document.createElement('div');
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";
    
    let h1 = document.createElement('h1');
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";
    
    let divBody = document.createElement('div');
    divBody.id = "bodyContent";
    
    let p1 = document.createElement('p');
    p1.innerText = (item.name) ? ('Imagem: '+ name) : '';
    p1.style.cssText = "font-weight: bold"; 
    
    let p2 = document.createElement('p');
    p2.innerText = local;
    p2.style.cssText = "font-weight: bold"; 
    
    let p3 = document.createElement('p');
    p3.innerText = '';
    p3.style.cssText = "font-weight: bold"; 
    
    let p4 = document.createElement('p');
    p4.innerText = sentido;
    p4.style.cssText = "font-weight: bold"; 
    
    let p5 = document.createElement('p');
    p5.innerText = status_slte;
    p5.style.cssText = "font-weight: bold"; 
    
    let p6 = document.createElement('p');
    p6.innerText = 'Homologado em: ' + data_de_homologacao;
    p6.style.cssText = "font-weight: bold"; 
    
    let buttonImagens = document.createElement('button');
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = 'Imagens';

    buttonImagens.addEventListener('click', () => {
      document.getElementById('btn-show-estacionar-page').setAttribute("key", keyTrack);
      document.getElementById('btn-show-estacionar-page').setAttribute("name", name);
      document.getElementById('btn-show-estacionar-page').setAttribute("lat", lat);
      document.getElementById('btn-show-estacionar-page').setAttribute("lng", lng);
      // document.getElementById('btn-show-estacionar-page').setAttribute("distance", distance);
      // document.getElementById('btn-show-estacionar-page').setAttribute("sre_inic", sre_inic);
      // document.getElementById('btn-show-estacionar-page').setAttribute("sre_fim", sre_fim);
      // document.getElementById('btn-show-estacionar-page').setAttribute("sre_sit", sre_sit);
      // document.getElementById('btn-show-estacionar-page').setAttribute("ce", ce);
      document.getElementById('btn-show-estacionar-page').setAttribute("rodovia", rodovia);
      // document.getElementById('btn-show-estacionar-page').setAttribute("sre", sre);
      document.getElementById('btn-show-estacionar-page').click();
    });


    div.appendChild(h1);
    
    divBody.appendChild(p1);
    divBody.appendChild(p2);
    divBody.appendChild(p3);
    divBody.appendChild(p4);
    divBody.appendChild(p5);
    divBody.appendChild(p6);

    if(showBtnImages) {
      divBody.appendChild(buttonImagens);
    }

    div.appendChild(divBody);

    return div;
  }

  private createInfoWindowFD(item: any, showBtnImages=true) {
    let lat;
    let lng;

    // const keyTrack = item.id;
    
    if(item.lat) {
      lat = DateUtil.getNumberFormatted(item.lat, 6);
    } if(item.lng) {
      lng = DateUtil.getNumberFormatted(item.lng, 6);
    }
    
    let distance = DateUtil.getNumberFormatted(item.dist, 2);
    let sre = item.sre;
    let tipo = item.tipo;
    let title = item.title;
    

    let div = document.createElement('div');
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";
    
    let h1 = document.createElement('h1');
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";
    
    let divBody = document.createElement('div');
    divBody.id = "bodyContent";
    
    let p1 = document.createElement('p');
    p1.innerText = title;
    p1.style.cssText = "font-weight: bold"; 
    
    let p2 = document.createElement('p');
    p2.innerText = 'Distância: ' + distance + '';
    p2.style.cssText = "font-weight: bold"; 
    
    let p3 = document.createElement('p');
    p3.innerText = 'SRE: ' + sre;
    p3.style.cssText = "font-weight: bold"; 
    
    let p4 = document.createElement('p');
    p4.innerText = 'Tipo: ' + tipo;
    p4.style.cssText = "font-weight: bold"; 
    
    let p5 = document.createElement('p');
    p5.innerText = '';
    p5.style.cssText = "font-weight: bold"; 
    
    let p6 = document.createElement('p');
    p6.innerText = '';
    p6.style.cssText = "font-weight: bold"; 
    
    let buttonImagens = document.createElement('button');
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = 'Imagens';

    buttonImagens.addEventListener('click', () => {
      // document.getElementById('btn-show-estacionar-page').setAttribute("key", keyTrack);
      // document.getElementById('btn-show-estacionar-page').setAttribute("name", name);
      document.getElementById('btn-show-estacionar-page').setAttribute("lat", lat);
      document.getElementById('btn-show-estacionar-page').setAttribute("lng", lng);
      // document.getElementById('btn-show-estacionar-page').setAttribute("distance", distance);
      // document.getElementById('btn-show-estacionar-page').setAttribute("sre_inic", sre_inic);
      // document.getElementById('btn-show-estacionar-page').setAttribute("sre_fim", sre_fim);
      // document.getElementById('btn-show-estacionar-page').setAttribute("sre_sit", sre_sit);
      // document.getElementById('btn-show-estacionar-page').setAttribute("ce", ce);
      // document.getElementById('btn-show-estacionar-page').setAttribute("rodovia", rodovia);
      // document.getElementById('btn-show-estacionar-page').setAttribute("sre", sre);
      document.getElementById('btn-show-estacionar-page').click();
    });


    div.appendChild(h1);
    
    divBody.appendChild(p1);
    divBody.appendChild(p2);
    divBody.appendChild(p3);
    divBody.appendChild(p4);
    divBody.appendChild(p5);
    divBody.appendChild(p6);

    if(showBtnImages) {
      divBody.appendChild(buttonImagens);
    }

    div.appendChild(divBody);

    return div;
  }

  private createInfoWindow(type, dados: any[], showBtnImages=true) {
    switch (type) {
      case 'acidente':
        return this.createInfoWindowAcidente(dados, showBtnImages)
      default:
        break;
    }
  }

  private createInfoWindowAcidente(dados: any[], showBtnImages=true) {
    let div = document.createElement('div');
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";
    
    let h1 = document.createElement('h1');
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";
    
    let divBody = document.createElement('div');
    divBody.id = "bodyContent";

    const pHtmlArr = dados
                    .filter(_item => _item.isVisible === true)
                    .map(_item => {
                      let p1 = document.createElement('p');
                      p1.innerText = _item.value;
                      p1.style.cssText = "font-weight: bold"; 

                      return p1;
                    });
    
    let buttonImagens = document.createElement('button');
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = 'Imagens';

    buttonImagens.addEventListener('click', () => {
      dados.forEach(_item => {
        document.getElementById('btn-show-estacionar-page').setAttribute(_item.key, _item.value);
      });

      document.getElementById('btn-show-estacionar-page').click();
    });


    // Criando o HTML
    div.appendChild(h1);
    pHtmlArr.forEach(_item => divBody.appendChild(_item));
    
    if(showBtnImages) {
      divBody.appendChild(buttonImagens);
    }

    div.appendChild(divBody);

    return div;
  }

  private createInfoWindowGenerico(item: any, isAcidente, showBtnImages=true) {

    let lat;
    let lng;
    let distance;

    let sre;
    let sre_inic;
    let sre_fim;
    let sre_sit;
    let sreText;
    let ce;
    let situacao;

    const keyTrack = item.id;
    const name = item.name;
    const rodovia = item.ce;
    
    if(item.lat) {
      lat = DateUtil.getNumberFormatted(item.lat, 6);
    } if(item.lng) {
      lng = DateUtil.getNumberFormatted(item.lng, 6);
    } if(item.km) {
      distance = DateUtil.getNumberFormatted(item.km, 2);
    }
    
    if(isAcidente) {
      ce = item.datahora + ' - ' + item.ce + ' - ' + item.municipio;
      sre_inic = item.quantidade + ' vítimas' + ' | ' + item.classifica;
      sre_fim = item.tipo_acide;
      situacao = '';
      sreText = item.custo;
      sre = item.custo;
      
    } else {
      ce = item.ce + ' - KM: '+ distance;
      sre_inic = (item.sre_inic) ? ('Início: '+ item.sre_inic) : '';
      sre_fim = (item.sre_fim) ? ('Fim: '+ item.sre_fim) : '';
      situacao = (item.situacao) ? ('Situação: '+ item.situacao) : '';
      sreText = 'SRE: '+ item.sre;
      sre = item.sre;
      sre_sit = item.sre_sit;
    }
    

    let div = document.createElement('div');
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";
    
    let h1 = document.createElement('h1');
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";
    
    let divBody = document.createElement('div');
    divBody.id = "bodyContent";
    
    let p1 = document.createElement('p');
    p1.innerText = (item.name) ? ('Imagem: '+ name) : '';
    p1.style.cssText = "font-weight: bold"; 
    
    let p2 = document.createElement('p');
    p2.innerText = ce;
    p2.style.cssText = "font-weight: bold"; 
    
    let p3 = document.createElement('p');
    p3.innerText = sre_inic;
    p3.style.cssText = "font-weight: bold"; 
    
    let p4 = document.createElement('p');
    p4.innerText = sre_fim;
    p4.style.cssText = "font-weight: bold"; 
    
    let p5 = document.createElement('p');
    p5.innerText = situacao;
    p5.style.cssText = "font-weight: bold"; 
    
    let p6 = document.createElement('p');
    p6.innerText = sreText;
    p6.style.cssText = "font-weight: bold"; 
    
    let buttonImagens = document.createElement('button');
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = 'Imagens';

    buttonImagens.addEventListener('click', () => {
      document.getElementById('btn-show-estacionar-page').setAttribute("key", keyTrack);
      document.getElementById('btn-show-estacionar-page').setAttribute("name", name);
      document.getElementById('btn-show-estacionar-page').setAttribute("lat", lat);
      document.getElementById('btn-show-estacionar-page').setAttribute("lng", lng);
      document.getElementById('btn-show-estacionar-page').setAttribute("distance", distance);
      document.getElementById('btn-show-estacionar-page').setAttribute("sre_inic", sre_inic);
      document.getElementById('btn-show-estacionar-page').setAttribute("sre_fim", sre_fim);
      document.getElementById('btn-show-estacionar-page').setAttribute("sre_sit", sre_sit);
      document.getElementById('btn-show-estacionar-page').setAttribute("ce", ce);
      document.getElementById('btn-show-estacionar-page').setAttribute("rodovia", rodovia);
      document.getElementById('btn-show-estacionar-page').setAttribute("sre", sre);
      document.getElementById('btn-show-estacionar-page').click();
    });


    div.appendChild(h1);
    
    divBody.appendChild(p1);
    divBody.appendChild(p2);
    divBody.appendChild(p3);
    divBody.appendChild(p4);
    divBody.appendChild(p5);
    divBody.appendChild(p6);

    if(!isAcidente && showBtnImages) {
      divBody.appendChild(buttonImagens);
    }

    div.appendChild(divBody);

    return div;
  }

  public cleanPolylines() {
    for(let i = 0; i < MapUtil2.polylines.length; i++) {
      MapUtil2.polylines[i].setMap(null);
    }
  }

  public cleanPolygons() {
    for(let i = 0; i < MapUtil2.polygons.length; i++) {
      MapUtil2.polygons[i].setMap(null);
    }
  }

  public cleanMarkers() {
    MapUtil2.markers.forEach(value => {
      value.setMap(null);
    });
  }

  public testCemK(map) {
    map.setCenter({lat: 39.905963, lng: 116.390813});
    map.setZoom(12);

    let arr = [];

    for (let index = 0; index < 100000; index++) {
        const _lat = 39.905963 + (Math.random()-Math.random()) * 3;
        const _lng = 116.390813 + (Math.random()-Math.random()) * 3;
      
        arr.push({lat: _lat, lng: _lng});
    }

    arr.forEach(_item => {
      const marker = new google.maps.Marker({
        position: _item,
        title: 'Stan the T-Rex',
        icon: new google.maps.MarkerImage("assets/icon/marker-red.png"),
      });

      marker.setMap(map);

      let infowindow = new google.maps.InfoWindow({
        content: this.createInfoWindowGenerico(_item, false)
      });

      google.maps.event.addListener(marker, 'click', event => {
        infowindow.setPosition(event.latLng);
        infowindow.open(map);
        MapUtil2.infoWindows.push(infowindow);

        if (MapUtil2.infoWindows.length > 1) {
          MapUtil2.infoWindows.forEach((value, index, arr) => {
              if (value != infowindow) {
                  value.close();
                  MapUtil2.infoWindows.splice(index, 1);
              }
          })
        }
      });
    })
  }

}
export class Rota {
  distance: number;
  time: number;
  instructions: string;
  path: Position[];
  position: Position;


  constructor()
  constructor(obj: any)
  constructor(obj?: any) {
    this.distance = obj && obj.distance || 0;
    this.time = obj && obj.time || 0;
    this.instructions = obj && obj.instructions || '';
    this.path = obj && obj.path || [];
    this.position = obj && obj.position || new Position();
  }
}

export class Position {
  lat: number;
  lng: number;

  constructor()
  constructor(obj: any)
  constructor(obj?: any) {
    this.lat = obj && obj.lat || 0.0;
    this.lng = obj && obj.lng || 0.0;
  }
  
}