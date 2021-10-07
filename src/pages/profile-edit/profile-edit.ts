import { MyApp } from './../../app/app.component';
import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {User} from "../../models/user";
import {UserService} from "../../providers/user/user.service";
import { Constants } from '../../environments/constants';
import { TranslateService } from '@ngx-translate/core';
import { GenericComponentsProvider } from '../../providers/generic-components/generic-components';

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {

  user: User = new User();

  dateOfBirth;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public view: ViewController,
    private userService: UserService,
    public translate: TranslateService,
    public genericComponents: GenericComponentsProvider) {}


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
    this.user = this.navParams.get('user');
    console.log(this.user.dateOfBirth);

    // if(this.user.dateOfBirth)
    //   this.dateOfBirth = this.user.dateOfBirth.getDate() + '/' + (this.user.dateOfBirth.getMonth()+1) + '/' + this.user.dateOfBirth.getFullYear();
  }

  format(valString) {
    if (!valString) {
      return '';
    }
    const parts = this.unFormat(valString.toString()).split('/');
    return this.data_mask(parts[0]);
  }

  unFormat(val) {
    if (!val) {
      return '';
    }
    return val.replace(/\D/g, '');
  }

  data_mask(v) {
    v = v.replace(/\D/g, ''); //Remove all that is not digits
    v = v.replace(/(\d{2})(\d)/, '$1/$2'); //Insere uma / entre dia e mes
    v = v.replace(/(\d{2})(\d)/, '$1/$2'); //Insere uma / entre mes e ano
    return v;
  }

  validaData(dateOfBirth: string){
    if(this.dateOfBirth) {
      const split = this.dateOfBirth.split('/');
      const dia = parseInt(split[0]);
      const mes = parseInt(split[1]);
      const ano = parseInt(split[2]);

      let dt = new Date();
      dt.setDate(dia);
      dt.setMonth(mes-1);
      dt.setFullYear(ano);

      if (!isNaN(dt.getTime())) {
        return true;
      }
    }

    return false;
  }

  updateData() {
    let loader = this.genericComponents.showLoading();

    this.userService.saveUser(this.user);

    this.genericComponents.showAlert(this.translate.instant('alert.title'), this.translate.instant('profile_edit.alert.save_data'), () => {
      loader.dismiss();
      this.close();
    }).present();
  }

  close() {
    this.view.dismiss();
  }
}
