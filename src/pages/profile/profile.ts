import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  IonicPage,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';
import {AuthService} from "../../providers/auth/auth.service";
import {CameraService} from "../../providers/camera/camera.service";
import {User} from "../../models/user";
import {UserService} from "../../providers/user/user.service";
import {Camera} from "@ionic-native/camera";
import {Subscription} from "rxjs/Subscription";
import {Constants} from "../../environments/constants";
import {MyApp} from "../../app/app.component";

import 'rxjs/add/operator/take';
import { TranslateService } from '@ngx-translate/core';
import { GenericComponentsProvider } from '../../providers/generic-components/generic-components';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  @ViewChild('fileUserPhoto') fileUserPhoto;

  user_image: SafeResourceUrl = 'assets/imgs/user.svg';
  
  // public user: User;
  user: User = new User();
  private subscription: Subscription = new Subscription();

  subCurrentUser;

  qtdDevices: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    private authService: AuthService,
    private userService: UserService,
    private cameraService: CameraService,
    private genericComponents: GenericComponentsProvider,
    public translate: TranslateService,
    private sanitizer: DomSanitizer) {
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
    console.log("PROFILE - IonViewDidLoad");
  }

  ionViewDidEnter() {
    console.log("PROFILE - IonViewDidEnter");
    this.userService.getUserLocal().then(userID => {
      this.userService.byId(userID).take(1).subscribe(user => {

        this.user = new User(user);
        this.user_image = this.user.photo;
      });
    });
  }

  ionViewWillLeave() {
    console.log("PROFILE - IonViewWillLeave");

    this.subscription.add(this.subCurrentUser);
    this.subscription.unsubscribe();
  }

  selectPicture(){
    if (Camera['installed']()) {
      this.cameraService.openMedia('Abrir', this.actionSheetCtrl, (imageBase64) => {
        this.user.photo = imageBase64;
      });
    } else {
      this.fileUserPhoto.nativeElement.click();
    }
  }

  processWebImageUserPhoto($event){
    this.cameraService.processWebImage($event, (imageBase64, w, h) => {

      if(w === 200 && h === 200){
        this.user.photo = imageBase64;
        this.userService.saveUser(this.user);
        MyApp.photo = imageBase64;
      } else{
        this.genericComponents.showAlert('', this.translate.instant('profile.alert.image'), _ => {});
      }

    });
  }

  openPerfilEditar() {
    const profileEdit = this.modalCtrl.create(Constants.PROFILE_EDIT_PAGE.name, {user: this.user});
    profileEdit.present();
  }

  updateData() {
    let loader = this.genericComponents.showLoading();

    this.userService.saveUser(this.user);

    this.genericComponents.showAlert(this.translate.instant('alert.title'), this.translate.instant('profile_edit.alert.save_data'), () => {
      loader.dismiss();
    }).present();
  }

}
