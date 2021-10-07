import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Events, IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../environments/constants';
import { environment } from '../../environments/environment';
import { AuthExtProvider } from '../../providers/auth-ext/auth-ext';
import { AuthService } from '../../providers/auth/auth.service';
import { GenericComponentsProvider } from '../../providers/generic-components/generic-components';

@IonicPage()
@Component({
  selector: 'page-auth-ext',
  templateUrl: 'auth-ext.html',
})
export class AuthExtPage {

  // http://localhost:8100/#/auth-ext?token=123
  // http://localhost:8100/#/auth-ext?token=123&email=gabriel@gmail.com
  // https://sistema.inventhus.com//#/auth-ext?token=123&email=gabriel@gmail.com

  isAguardando = true;
  msgerro = undefined;

  versao = environment.version;
  isDev = environment.production ? '' : ' - dev';

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public menu : MenuController,
    public translate: TranslateService,
    public events: Events,
    public genericComponents: GenericComponentsProvider,
    public authService : AuthService,
    public authExtProvider : AuthExtProvider,
    ) {
      // this.msgerro = {
      //   title: 'Usuário não autorizado',
      //   desc: 'O usuário não encontra-se cadastrado ou autorizado para acessar esse sistema. Entre em contato com o administrador para resolver este problema.',
      // };
  }

  ionViewDidLoad() {
    this.setVisibleMenu(false);

    const searchParam = this.getParam();
    if(searchParam){
      const token = searchParam;

      console.log('TOKEN', token);

      this.authExtProvider.validateToken(token).then(result => {
        console.log('result', result);
        
        if(result.status) {
          const _data = result.response;
          console.log('_data', _data);

          if(_data && _data.email) {
            const email = _data.email;
  
            this.authService.loginWithToken(email, token)
              .then(res => {
                console.log('resp', res);

                if(res.logged) {
                  const user = res.logged;
                  console.log('user', user);
      
                  this.events.publish('user', user);
      
                  // loading.dismiss();
                  this.isAguardando = false;
                  
                  this.setVisibleMenu(true);
                  this.navCtrl.setRoot(Constants.HOME_PAGE.name);

                } else {
                  // loading.dismiss();
                  this.isAguardando = false;

                  this.msgerro = {
                    title: 'Usuário não autorizado!',
                    desc: 'O usuário não encontra-se cadastrado ou autorizado para acessar esse sistema. Entre em contato com o administrador para resolver este problema.',
                  };

                  // this.genericComponents.showAlert(this.translate.instant('alert.title'), this.translate.instant('login.alert.not_authorized'), () => console.log('')).present();
                }
              }).catch(error => {
                console.log('resp-error', error);
                // loading.dismiss();
                // this.genericComponents.showAlert(this.translate.instant('alert.title'), this.translate.instant('login.alert.auth_wrong'), () => console.log(error)).present();
              });
          }

        } else {
          console.log('detran-error', result.error);
        }

      }).catch(error => {
        console.log('detran-error', error);
        // loading.dismiss();
        // this.genericComponents.showAlert(this.translate.instant('alert.title'), this.translate.instant('login.alert.auth_wrong'), () => console.log(error)).present();
      });
      // TODO: REQUISICAO POST PARA O SERVIDOR DO DETRAN
      // SE OK, SALVA O USUARIO NA SESSAO E REDIRECIONA PARA HOME
      // SENAO, REDIRECIONA PARA O LOGIN E MOSTRA UMA MSG DE ERRO QUE NAO FOI POSSIVEL AUTENTICAR

      // this.navCtrl.setRoot(Constants.LOGIN_PAGE.name);
    }
  }

  private getParam() {
    const searchParam = this.navParams.get('searchParam');

    if(searchParam){
      return searchParam;
    } else{
      const getParam = this.getParamGetURL();

      if(getParam)
        return getParam;
    }

    return undefined;
  }

  private getParamGetURL() {
    // console.log('url', document.URL);
    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      let i: any;

      let _params = {token: '', email: ''};

      for (i in splitParams) {
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == "token") {
          let content = singleURLParam[1];
          content = content.replace(/\+/g, '%20');
          return decodeURIComponent(content);

        }
      }
    }

    return undefined;
  }

  setVisibleMenu(status=false){
    this.menu.enable(status);
    this.menu.swipeEnable(status);
  }

}
