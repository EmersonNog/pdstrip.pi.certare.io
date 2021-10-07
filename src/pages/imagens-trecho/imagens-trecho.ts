import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Constants } from '../../environments/constants';
import { UserService } from '../../providers/user/user.service';
import { GenericComponentsProvider } from '../../providers/generic-components/generic-components';
import { TranslateService } from '@ngx-translate/core';
import { ImageDetectProvider } from '../../providers/image-detect/image-detect';


@IonicPage()
@Component({
  selector: 'page-imagens-trecho',
  templateUrl: 'imagens-trecho.html',
})
export class ImagensTrechoPage {

  isCarregado = false;
  titulo = 'Imagens do Trecho';
  fotos: any[] = [];
  
  currentIndex = 0;
  items: any[] = [];

  levantamentoId;
  key;
  name;
  lat;
  lng;
  distance;
  qtdRemendos;
  qtdBuracos;
  timeProcess;
  pathImage;
  sre;
  sre_inic;
  sre_fim;
  sre_sit;
  ce;
  rodovia;
  type;
  datetime;

  isImageOriginal = true;
  isImageDetect = true;

  pathImageOriginal: string = 'assets/imgs/no-image.png';
  pathImageDetect: string = 'assets/imgs/no-image.png';

  levantamento = {};
  levantamentoPrev = undefined;
  levantamentoNext = undefined;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, 
    public modalCtrl: ModalController, private userService: UserService,
    public translate: TranslateService,
    private imageDetectProvider: ImageDetectProvider,
    public genericComponents: GenericComponentsProvider) {
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
  
  ionViewDidLoad() {
    this.levantamentoId = this.navParams.get('levantamentoId');
    this.key = this.navParams.get('key');
    this.name = this.navParams.get('name');
    this.lat = this.navParams.get('lat');
    this.lng = this.navParams.get('lng');
    this.distance = this.navParams.get('distance');
    this.qtdRemendos = this.navParams.get('qtdRemendos');
    this.qtdBuracos = this.navParams.get('qtdBuracos');
    this.timeProcess = this.navParams.get('timeProcess');
    this.pathImage = this.navParams.get('pathImage');
    this.sre = this.navParams.get('sre');
    this.sre_inic = this.navParams.get('sre_inic');
    this.sre_fim = this.navParams.get('sre_fim');
    this.sre_sit = this.navParams.get('sre_sit');
    this.ce = this.navParams.get('ce');
    this.rodovia = this.navParams.get('rodovia');
    this.type = this.navParams.get('type');
    this.items = this.navParams.get('items');
    
    const datetimeTemp = this.navParams.get('datetime');

    if(datetimeTemp) {
      this.datetime = new Date(datetimeTemp);
    }

    console.log('navParams', this.navParams);

    if(this.type && this.type === 'data-info') {

      this.imageDetectProvider.getImagensStorage(this.levantamentoId, 'detect', this.pathImage).then(_absUrl => {
        console.log('_absUrl', _absUrl);
        this.pathImageOriginal = _absUrl;
      }).catch(err => {
      });

    } else if(this.type && this.type === 'exames') {

      this.imageDetectProvider.getImagensStorage(this.levantamentoId, undefined, this.pathImage).then(_absUrl => {
        console.log('_absUrl', _absUrl);
        this.pathImageOriginal = _absUrl;
      }).catch(err => {
      });

    } else {
      this.carregaImagens();
    }
  }

  carregaImagens() {
    // const loading = this.genericComponents.showLoading();

    this.pathImageOriginal = 'assets/imgs/loading-image.gif';
    this.pathImageDetect = 'assets/imgs/loading-image.gif';

    this.imageDetectProvider.getImagensStorage(this.levantamentoId, 'detect', this.pathImage).then(_absUrl => {
      console.log('_absUrl', _absUrl);
      this.pathImageOriginal = _absUrl;
    }).catch(err => {
      // loading.dismiss();
    });

    this.imageDetectProvider.getImagensStorage(this.levantamentoId, 'detect_out', this.pathImage).then(_absUrl => {
      console.log('_absUrl', _absUrl);
      this.pathImageDetect = _absUrl;

      // loading.dismiss();
    }).catch(err => {
      this.type = 'data-info';
      // this.isImageOriginal = false;
      // loading.dismiss();
    });
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

  openImage(url){
    this.modalCtrl.create('ImageDetailsPage', 
        { 
          foto: url, 
          rodape: '',
          titulo: ''
        })
      .present();
  }

  // prevItem() {
  //   if(this.currentIndex > 0) {
  //     const idx = this.currentIndex-1;
  //     this.levantamentoPrev = this.items[idx];
  //     this.itemClickList(this.levantamentoPrev, idx);
  //   }
  // }

  // nextItem() {
  //   if(this.currentIndex < this.items.length) {
  //     const idx = this.currentIndex+1;
  //     this.levantamentoNext = this.items[idx];
  //     this.itemClickList(this.levantamentoNext, idx);
  //   }
  // }

  // itemClickList(item, idx) {
  //   this.pathImageOriginal = 'assets/imgs/loading-image.gif';
  //   this.pathImageDetect = 'assets/imgs/loading-image.gif';

  //   this.currentIndex = idx;
  //   this.levantamento = item.values;
  //   console.log('ll', this.levantamento);

  //   if(this.currentIndex > 0) {
  //     this.levantamentoPrev = this.items[this.currentIndex-1];
  //   } else {
  //     this.levantamentoPrev = undefined;
  //   }
    
  //   if(this.currentIndex < this.items.length) {
  //     this.levantamentoNext = this.items[this.currentIndex+1];
  //   } else {
  //     this.levantamentoNext = undefined;
  //   }

  //   // console.log('prev', this.levantamentoPrev);
  //   // console.log('next', this.levantamentoNext);

  //   this.imageDetectProvider.getImagensStorage(this.levantamento.id, 'detect', this.levantamento.pathImage).then(_absUrl => {
  //     console.log('_absUrl', _absUrl);
  //     this.pathImageOriginal = _absUrl;
  //   }).catch(err => {
  //     this.pathImageOriginal = 'assets/imgs/no-image.png';
  //   });

  //   this.imageDetectProvider.getImagensStorage(this.levantamento.id, 'detect_out', this.levantamento.pathImage).then(_absUrl => {
  //     console.log('_absUrl', _absUrl);
  //     this.pathImageDetect = _absUrl;
  //   }).catch(err => {
  //     this.pathImageDetect = 'assets/imgs/no-image.png';
  //   });
  // }
}
