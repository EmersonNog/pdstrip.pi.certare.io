import {Component, Input} from '@angular/core';
import {User} from "../../models/user";
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { Events } from 'ionic-angular';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoComponent {

  @Input('user')
  user: User;

  user_image: SafeResourceUrl = 'assets/imgs/user.svg';

  constructor(private sanitizer: DomSanitizer, public events: Events) {
    this.events.subscribe('user', (value) => {
      this.user = value;
      this.user_image = this.user.photo;
      // this.user_image = this.sanitizer.bypassSecurityTrustResourceUrl(value);
    })
  }

}
