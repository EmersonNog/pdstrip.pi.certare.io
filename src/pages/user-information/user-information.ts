import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {User} from "../../models/user";
import { Constants } from '../../environments/constants';
import { UserService } from '../../providers/user/user.service';

@IonicPage()
@Component({
  selector: 'page-user-information',
  templateUrl: 'user-information.html',
})
export class UserInformationPage {

  user: User = new User();

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private userService: UserService) {
  }

  ionViewCanEnter() {
    this.userService.getUserLocal().then(userID => {
      this.userService.byId(userID).take(1).subscribe(_user => {
        let user = new User(_user);

        if(user.isAdmin()){
          return true;
        } else {
          this.navCtrl.setRoot(Constants.HOME_PAGE.name)
        }
      });

      if (userID === null) {
        this.navCtrl.setRoot(Constants.LOGIN_PAGE.name)
      }
    });
  }

  ionViewDidLoad() {    
    const userParam = this.navParams.get('user');

    if(userParam){
      this.user = new User(userParam);
    }
  }

  closeUserInformation() {
    this.viewCtrl.dismiss();
  }
}
