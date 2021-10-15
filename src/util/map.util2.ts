// import { Rodovia } from '../models/rodovia';
import { DateUtil } from './date.util';
import { Events, NavController, Nav } from 'ionic-angular';
import { Injectable, ViewChild } from '@angular/core';



declare var google: any;
@Injectable()
export class MapUtil2 {

    static infoWindows = [];
    static markers = [];
    static polylines = [];
    events: Events = undefined;
    nav:NavController;

    constructor(public navCtrl?: NavController) { }

    setEvents(events: Events) {
        this.events = events;
    }

    createMap(mapElement) {
        if (mapElement !== null && mapElement.nativeElement !== null)
            return new google.maps.Map(mapElement.nativeElement, this.mapOptions());

        return undefined;
    }

    public mapOptions() {
        return {
            mapTypeId: 'roadmap',
            //   mapTypeId: 'satellite',
            zoom: 9,
            center: { lat: -19.907892905853608, lng: -44.00658256604622 },
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            scaleControl: true,
            streetViewControl: false,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            fullscreenControl: false,
            styles: MapUtil2.getMapStyle()
        };
    }

    /**
     * https://snazzymaps.com/explore?sort=recent
     * https://mapstyle.withgoogle.com/
     * 
     * @returns 
     */
    static getMapStyle() {
        return [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "weight": "2.00"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#9c9c9c"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#7b7b7b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#46bcec"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#b5dae1"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#070707"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            }
        ]
    }

    public destroy() {
        this.cleanMarkers();
        this.cleanPolylines();
    }

    private getDados(type, item) {
        switch (type) {
            // case Acidente.getType().id:
            //     return Acidente.preparaDados(item);
            // case Defensas.getType().id:
            //     return Defensas.preparaDados(item);
            // case FaixaDeDominio.getType().id:
            //     return FaixaDeDominio.preparaDados(item);
            // case FiscalizacaoEletronica.getType().id:
            //     return FiscalizacaoEletronica.preparaDados(item);
            // case LimiteMunicipio.getType().id:
            //     return LimiteMunicipio.preparaDados(item);
            // case Ponte.getType().id:
            //     return Ponte.preparaDados(item);
            // case Portico.getType().id:
            //     return Portico.preparaDados(item);
            // case SemiPortico.getType().id:
            //     return SemiPortico.preparaDados(item);
            // case SinalizacaoHorizontal.getType().id:
            //     return SinalizacaoHorizontal.preparaDados(item);
            default:
                return undefined;
        }
    }

    public showPoints(itemArr: any[], type, map, showBtnImages = true, htmlItens: any[]) {
        let marker;

        const latArrOk = itemArr.filter(item => item.lat !== 0.0);
        const hasPoints = latArrOk.length > 0;

        if (itemArr.length > 0 && hasPoints) {
            let indexCenter = (itemArr.length / 2 | 0); // cast para int

            map.setCenter({ lat: itemArr[indexCenter].lat, lng: itemArr[indexCenter].lng });
            map.setZoom(7);

            for (let i = 0; i < itemArr.length; i++) {

                marker = this.criaMarker(itemArr[i], type.name, type.img, map);
                MapUtil2.markers.push(marker);

                let dados = this.getDados(type.id, itemArr[i]);
                // console.log(dados);
                // console.log(type.id);
                if (dados) {
                    this.criaInfoWindow(marker, dados, map, showBtnImages, htmlItens, type.id, itemArr[i].imagem);
                    // console.log(itemArr[i].imagem)
                } 
            }
        }
    }

    private criaMarker(item, typeName, typeImg, map) {
        // console.log('type', item);
        let pathSvgFull = '';

        if(typeImg === 'especifico') {
            // const pathSvg = SinalizacaoHorizontal.getTypeBySituacao(item.situacao).img;
            const pathSvg = '';
            pathSvgFull = "assets/icon/" + pathSvg;

        } else {
            pathSvgFull = "assets/icon/" + typeImg;
        }

        return new google.maps.Marker({
            position: { lat: item.lat, lng: item.lng },
            title: typeName,
            icon: new google.maps.MarkerImage(pathSvgFull),
            map: map
        });
    }

    // Aqui cada item é passado, já dividido seus 
    // valores entre itens de um array de proppriedades de cada item

    private criaInfoWindow(marker, dados, map, showBtnImages, htmlItens: any[], itemType, imgUrl?) {
        let infowindow = new google.maps.InfoWindow({ content: this.createInfoWindowHTML(dados, showBtnImages) });

        google.maps.event.addListener(marker, 'click', event => {
            //ionic event 
            //criar subscribe na tela
            this.events.publish(itemType, dados);
            
            //     infowindow.setPosition(event.latLng);
            //     infowindow.open(map);
            //     MapUtil2.infoWindows.push(infowindow);
            //     console.log('teste de item')
            //     htmlItens.forEach(item => {
            //         console.log(item)
            //     })

            //     if (MapUtil2.infoWindows.length > 1) {
            //         MapUtil2.infoWindows.forEach((value, index, arr) => {
            //             if (value != infowindow) {
            //                 value.close();
            //                 MapUtil2.infoWindows.splice(index, 1);
            //             }
            //         });
            //     }
        });
    }


    private createInfoWindowHTML(dados: any[], showBtnImages = true) {
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

        if (showBtnImages) {
            divBody.appendChild(buttonImagens);
        }

        div.appendChild(divBody);

        return div;
    }


    public cleanPolylines() {
        for (let i = 0; i < MapUtil2.polylines.length; i++) {
            MapUtil2.polylines[i].setMap(null);
        }
    }

    public cleanMarkers() {
        MapUtil2.markers.forEach(value => {
            value.setMap(null);
        });
    }

}