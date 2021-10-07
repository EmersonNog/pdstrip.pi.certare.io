import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BrowserProvider } from '../../providers/browser/browser';
import { Constants } from '../../environments/constants';
import { UserService } from '../../providers/user/user.service';

@IonicPage()
@Component({
  selector: 'page-image-details',
  templateUrl: 'image-details.html',
})
export class ImageDetailsPage {
  
  titulo = 'Imagem';
  foto;
  rodape = '';
  
  constructor(public navParams: NavParams, public navCtrl: NavController,
    public viewCtrl: ViewController, private browserProvider: BrowserProvider, private userService: UserService) {
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
    this.titulo = this.navParams.get('titulo');
    this.foto = this.navParams.get('foto');
    this.rodape = this.navParams.get('rodape');
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

  openExternal(foto) {
    this.browserProvider.openPage(foto);
  }

}
