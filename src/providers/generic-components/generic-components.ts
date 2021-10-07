import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class GenericComponentsProvider {

  constructor(private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public translate: TranslateService) {
  }

  showLoading() {
    let loading = this.loadingCtrl.create({
      content: this.translate.instant('loading.title')
    });
    loading.present();
    return loading;
  }
  
  showAlert(titulo='Aviso', descricao='', callback=undefined) {
    return this.alertCtrl.create({
      title: titulo,
      subTitle: descricao,
      cssClass: 'alert',
      buttons: [
        {
          text: this.translate.instant('btn.ok'),
          cssClass: 'btn btn-ok',
          handler: data => {
            if(callback)
              callback();
          }
        }
      ]
    });
  }
  
  showAlertYesOrNo(titulo='Aviso', descricao='', callback=undefined) {
    return this.alertCtrl.create({
      title: titulo,
      message: descricao,
      cssClass: 'alert',
      buttons: [
        {
          text: this.translate.instant('btn.yes'),
          cssClass: 'btn btn-ok',
          handler: () => {
            if(callback)
              callback(); 
          }
        },
        {
          text: this.translate.instant('btn.no'), 
          cssClass: 'btn btn-cancel',
        }
      ]
    });
  }
  
  showConfirmPromise(titulo='Aviso', descricao=''): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      this.alertCtrl.create({
          title: titulo,
          subTitle: descricao,
          cssClass: 'alert',
          buttons: [
            {
              text: this.translate.instant('btn.yes'), 
              cssClass: 'btn btn-ok',
              handler: _data => {
                resolve({data: _data});
              }
            },
            {
              text: this.translate.instant('btn.no'), 
              cssClass: 'btn btn-cancel',
            }
          ]
        }).present();

    });
  }
  
  showConfirm(titulo='Aviso', descricao='', callback=undefined) {
    return this.alertCtrl.create({
      title: titulo,
      subTitle: descricao,
      cssClass: 'alert',
      buttons: [
        {
          text: this.translate.instant('btn.yes'), 
          cssClass: 'btn btn-ok',
          handler: data => {
            if(callback)
              callback();
          }
        },
        {
          text: this.translate.instant('btn.no'), 
          cssClass: 'btn btn-cancel',
        }
      ]
    });
  }

  showPrompt(titulo='Salvar', descricao='', placeholder='', value='', callback=undefined) {
    return this.alertCtrl.create({
      cssClass: 'alert',
      title: titulo,
      message: descricao,
      inputs: [
        {
          name: 'title',
          placeholder: placeholder,
          value: value
        },
      ],
      buttons: [
        { text: this.translate.instant('btn.cancel'), cssClass: 'btn btn-cancel' },
        {
          text: this.translate.instant('btn.save'),
          cssClass: 'btn btn-ok',
          handler: data => {
            // console.log('Saved clicked', data);
            if(callback)
              callback(data);
          }
        }
      ]
    });
  }

}
