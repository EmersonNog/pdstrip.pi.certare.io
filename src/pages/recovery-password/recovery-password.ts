import { MyApp } from './../../app/app.component';
import { Component } from '@angular/core';
import {
  IonicPage,
  Loading,
  MenuController,
  NavController,
  NavParams
} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../providers/auth/auth.service";
import {Constants} from "../../environments/constants";
import { UserService } from '../../providers/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { GenericComponentsProvider } from '../../providers/generic-components/generic-components';

@IonicPage()
@Component({
  selector: 'page-recovery-password',
  templateUrl: 'recovery-password.html',
})
export class RecoveryPasswordPage {

  public recoveryForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu : MenuController,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public userService: UserService,
    public translate: TranslateService,
    public genericComponents: GenericComponentsProvider) {

    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.recoveryForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])]
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

  recovery() {
    this.submitAttempt = true;

    if (this.isValidAttributes()) {
      let loading = this.genericComponents.showLoading();

      this.authService.sendPasswordResetEmail(this.recoveryForm.value.email)
        .then(() => {
          loading.dismiss();
          this.genericComponents.showAlert(this.translate.instant('alert.title'), this.translate.instant('forgotpass.alert.success'), () => {
            this.navCtrl.setRoot(Constants.LOGIN_PAGE.name);
          }).present();

        }).catch(error => {
          loading.dismiss();
          let errorMessage = this.translate.instant('forgotpass.alert.default_err');

          if (error['code'] && error['code'] == 'auth/user-not-found') {
            errorMessage = this.translate.instant('forgotpass.alert.no_user_err');
          }

          this.genericComponents.showAlert(this.translate.instant('alert.title'), errorMessage, () => console.log(error)).present();
        });

    } else {
      const warn = this.translate.instant('forgotpass.alert.invalid_email_err');
      this.genericComponents.showAlert(this.translate.instant('alert.title'), warn, () => console.log(warn)).present();
    }
  }

  isValidAttributes(): Boolean {
    return this.recoveryForm.valid;
  }

  setVisibleMenu(status = false) {
    this.menu.enable(status);
    this.menu.swipeEnable(status);
  }

  showLogin() {
    this.navCtrl.setRoot(Constants.LOGIN_PAGE.name);
  }

}
