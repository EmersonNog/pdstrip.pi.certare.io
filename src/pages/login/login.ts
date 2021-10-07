import { MyApp } from './../../app/app.component';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, NavParams, Loading, MenuController, Events } from 'ionic-angular';

import { AuthService } from '../../providers/auth/auth.service';
import {Constants} from "../../environments/constants";
import { UserService } from '../../providers/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { GenericComponentsProvider } from '../../providers/generic-components/generic-components';
import { environment } from '../../environments/environment';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  submitAttempt: boolean = false;

  versao = environment.version;
  isDev = environment.production ? '' : ' - dev';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public menu : MenuController,
    public authService: AuthService,
    private userService: UserService,
    public translate: TranslateService,
    public events: Events,
    public genericComponents: GenericComponentsProvider
  ) {

    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });
  }
  
  focusInput(input) {
    input.setFocus();
  }

  ionViewCanEnter() {
    this.userService.getUserLocal().then(userID => {
        if (userID === undefined || userID === null) {
          this.setVisibleMenu(false);
          return true;
        } else {
          this.setVisibleMenu(true);
          this.navCtrl.setRoot(Constants.HOME_PAGE.name)
        }
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.submitAttempt = true;

    if(this.loginForm.valid) {
      let loading: Loading = this.genericComponents.showLoading();

      this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
        .then(res => {
          if(res.logged) {
            const user = res.logged;

            this.events.publish('user', user);

            loading.dismiss();
            
            this.setVisibleMenu(true);
            this.navCtrl.setRoot(Constants.HOME_PAGE.name);
          } else {
            loading.dismiss();
            this.genericComponents.showAlert(this.translate.instant('alert.title'), this.translate.instant('login.alert.not_authorized'), () => console.log('')).present();
          }
        }).catch(error => {
          loading.dismiss();
          this.genericComponents.showAlert(this.translate.instant('alert.title'), this.translate.instant('login.alert.auth_wrong'), () => console.log(error)).present();
        });
    }
  }

  showSignUp() {
    this.navCtrl.setRoot(Constants.SIGNUP_PAGE.name);
  }

  showRecoverPassword() {
    this.navCtrl.setRoot(Constants.RECOVERY_PASSWORD_PAGE.name);
  }

  setVisibleMenu(status=false){
    this.menu.enable(status);
    this.menu.swipeEnable(status);
  }
}
