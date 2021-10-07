import {Component} from '@angular/core';
import { IonicPage, ItemSliding, NavController, NavParams } from 'ionic-angular';

import 'rxjs/add/operator/take';
import { MyApp } from '../../app/app.component';
import { Constants } from '../../environments/constants';
import { User } from '../../models/user';
import { RodoviaProvider } from '../../providers/rodovia/rodovia';
import { UserService } from '../../providers/user/user.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  qtdAcidentes = 0;
  qtdDefensas = 0;
  qtdPorticos = 0;
  qtdSemiporticos = 0;

  qtdAcidentesCE040 = 0;
  qtdAcidentesCE085 = 0;
  qtdAcidentesFortaleza = 0;
  custo = 0.0;

  listAcidentes = [];
  listDefensas = [];
  listPorticos = [];
  listSemiporticos = [];

  user: User;

  public rows: any;

  public columns = [
    { prop: 'acidente', name: 'Acidente' }, 
    { prop: 'custo', name: 'R$' }
  ];

  public my_messages = {
    'emptyMessage': 'Nenhum item na lista.',
    'totalMessage': 'acidentes'
  };

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    private userService: UserService,
    private rodoviaService: RodoviaProvider,
  ) {  
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

  replaceAll(string: string, search, replace): string {
    return string.split(search).join(replace);
  }
  private getNumberFormatted(value:number, digits=2) {
    return value.toLocaleString('pt', {minimumFractionDigits: digits,maximumFractionDigits: digits})
  }

  ionViewDidLoad() {
    // const loading = MyApp.showLoading(this.loadingCtrl);
    // loading.present();

    this.rodoviaService.listAcidentes().take(1).subscribe(_items => {
      this.listAcidentes = _items.map(_item => _item.values);
      this.qtdAcidentes = this.listAcidentes.length;

      this.qtdAcidentesCE040 = this.listAcidentes.filter(_item => _item.ce === 'CE040').length;
      this.qtdAcidentesCE085 = this.listAcidentes.filter(_item => _item.ce === 'CE085').length;
      this.qtdAcidentesFortaleza = this.listAcidentes.filter(_item => _item.municipio === 'FORTALEZA').length;

      let custoTotal = 0.0;

      this.listAcidentes.forEach(_item => {
        let custoStr: string = _item.custo;
        let custoStr2 = this.replaceAll(custoStr, 'R$', '');
        custoStr2 = custoStr2.trim();

        let custo = parseFloat(custoStr2);
        // console.log('custo', custo);

        custoTotal += custo;
      });

      this.custo = custoTotal;

      const items = this.listAcidentes.map(_item => {
        return {'acidente': _item.datahora + ' - ' + _item.logradouro + ' - ' + _item.municipio, 'custo': _item.custo };
      });
      
      this.rows = [];
      this.rows.push(...items);

    });

    this.rodoviaService.listDefensas().take(1).subscribe(_items => {
      this.listDefensas = _items.map(_item => _item.values);
      this.qtdDefensas = this.listDefensas.length;
    });

    this.rodoviaService.listPorticos().take(1).subscribe(_items => {
      this.listPorticos = _items.map(_item => _item.values);
      this.qtdPorticos = this.listPorticos.length;
    });

    this.rodoviaService.listSemiPorticos().take(1).subscribe(_items => {
      this.listSemiporticos = _items.map(_item => _item.values);
      this.qtdSemiporticos = this.listSemiporticos.length;
    });


  }

}
