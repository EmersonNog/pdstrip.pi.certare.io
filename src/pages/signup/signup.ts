import { BrowserProvider } from './../../providers/browser/browser';
import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, MenuController} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UserService } from '../../providers/user/user.service';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from '../../models/user';
import {Constants} from "../../environments/constants";
import { TranslateService } from '@ngx-translate/core';
import { GenericComponentsProvider } from '../../providers/generic-components/generic-components';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  public signupForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public userService: UserService,
    public browserService: BrowserProvider,
    public translate: TranslateService,
    public genericComponents: GenericComponentsProvider
  ) {

    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      terms: [false, Validators.compose([Validators.required])],
    });

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
    this.setVisibleMenu(false);
  }

  register() {
    
    if(!this.signupForm.value.terms){
      this.genericComponents.showAlert(this.translate.instant('alert.title'), this.translate.instant('signup.alert.terms'), () => {}).present();
      return;
    }
    
    this.submitAttempt = true;

    if(this.signupForm.valid) {
      let loading = this.genericComponents.showLoading();

      let user: User = this.signupForm.value;
      let password = this.signupForm.value.password;

      this.authService.createUserAuth(user.email, password, user)
          .then(userAuth => {
            this.genericComponents.showAlert(this.translate.instant('alert.title'), this.translate.instant('signup.alert.success'), () => {
              loading.dismiss();
              this.navCtrl.setRoot(Constants.LOGIN_PAGE.name);
            }).present();

          }).catch(error => {
            console.log('erro', error);
            loading.dismiss();
            this.genericComponents.showAlert(this.translate.instant('alert.title'), error, () => console.log(error)).present();
        });
      }
    }


  focusInput(input) {
    input.setFocus();
  }

  setVisibleMenu(status=false){
    this.menu.enable(status);
    this.menu.swipeEnable(status);
  }

  openTerms($event) {
    $event.preventDefault();
    this.browserService.openPage('http://inventhus.com/termos-e-condicoes');
  }

  showLogin() {
    this.navCtrl.setRoot(Constants.LOGIN_PAGE.name);
  }

}
