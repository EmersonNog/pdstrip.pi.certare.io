import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../environments/constants';
import { User } from '../../models/user';
import { AssetsJsonProvider } from '../../providers/assets-json/assets-json';
import { RodoviaProvider } from '../../providers/rodovia/rodovia';
import { UserService } from '../../providers/user/user.service';
import { MapUtil } from '../../util/map.util';

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
    private provider: AssetsJsonProvider) {
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
    // console.log("HOME - IonViewWillLeave")
    this.mapUtil.destroy();
  }

  ionViewDidLoad() {
    this.initMap();
  }

  private initMap(route = undefined) {
    if (!this.map) {
      this.map = this.mapUtil.createMap(this.mapElement);
    }

    this.mapUtil.cleanMarkers();
    this.mapUtil.cleanPolylines();

    this.rodoviaService.listExames().take(1).subscribe(_data => {
      _data = _data.map(_item => {
        _item.values['type'] = 'exame';
        _item.values['icon'] = 'marker-blue-2.png';
        return _item;
      });
      console.log('exames', _data);
      this.mapUtil.showRodoviaPoints(_data, this.map, false, 'exames');
    });
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
