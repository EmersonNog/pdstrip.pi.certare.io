import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import {AuthService} from "../../providers/auth/auth.service";
import {User} from "../../models/user";
import {UserService} from "../../providers/user/user.service";
import {ISubscription} from "rxjs/Subscription";
import {Constants} from "../../environments/constants";
import { TranslateService } from '@ngx-translate/core';
import { GenericComponentsProvider } from '../../providers/generic-components/generic-components';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  currentUser: User;
  users: User[];
  usersInativos: User[];
  subscription: ISubscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private authService: AuthService,
    private userService: UserService,
    private genericComponents: GenericComponentsProvider,
    public translate: TranslateService) {}


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

  all;

  ionViewDidLoad() {
    this.userService.listUsers().subscribe((users: User[]) => {
      this.all = users;
      this.users = users.filter(_item => _item.status === false);
      this.users.sort((a, b) => a.name.localeCompare(b.name));
      
      this.usersInativos = users.filter(_item => _item.status === true);
      this.usersInativos.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  updateStatus(user) {
    this.confirm(user, () => {
      user.status = !user.status;
      this.userService.saveUser(user);
    });
  }

  openUserInformation(user) {
    this.modalCtrl.create(Constants.USER_INFORMATION.name, {user: user}).present();
  }

  hasNoUser(user: User){
    if(user){
      return user === undefined;
    }

    return true;
  }

  confirm(user, success) {
    let text = user.status ? this.translate.instant('users.disable') : this.translate.instant('users.enable');

    const part1 = this.translate.instant('users.alert.part1');
    const part2 = this.translate.instant('users.alert.part2');
    const part3 = this.translate.instant('users.alert.part3');

    this.genericComponents.showAlertYesOrNo(this.translate.instant('alert.title'), 
      part1 + text + part2 + user.name + part3, () => {
        if(success) {
          success();
        }
      }).present();
  }
}
