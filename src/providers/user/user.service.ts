import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from "firebase";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";

import { User } from '../../models/user';
import {Constants} from "../../environments/constants";

@Injectable()
export class UserService {

  static APP_NAME: string = 'invent-cloud-web_';

  currentUser: Observable<any>;
  routes: any[];

  constructor(
    public afa: AngularFireAuth,
    public afd: AngularFireDatabase,
    public http: HttpClient,
    private storage: Storage) {

    this.listenAuthState();
  }

  byId(id: string) {
    return this.afd.object(Constants.PATH_DOCUMENTS_USER + id).valueChanges();
  }

  listUsers() {
    return this.afd.list(Constants.PATH_DOCUMENTS_USER).valueChanges();
  }

  saveUser(user): void {
    if(user && user.expirationDate === undefined) {
      delete user.expirationDate;
    }
    this.afd.object(Constants.PATH_DOCUMENTS_USER + user.id).update(user).catch(error => console.log(error));
  }

  updateDevice(userId, device) {
    this.afd.object(Constants.PATH_DOCUMENTS_USER + userId + '/devices/' + device.imei).update(device).catch(error => console.log(error));
  }

  update(id, itemUpdate) {
    return this.afd.object(Constants.PATH_DOCUMENTS_USER + id).update(itemUpdate);
  }

  getUserLocal() {
    return this.storage.get(UserService.APP_NAME + 'user');
  }

  saveUserLocal(user: string) {
      return this.storage.set(UserService.APP_NAME + 'user', user);
  }

  removeUserLocal(): Promise<any> {
      return this.storage.remove(UserService.APP_NAME + 'user');
  }

  private listenAuthState(): void {
    this.afa.authState.subscribe((user: firebase.User) => {
      if(user) {
        this.currentUser = this.afd.object(Constants.PATH_DOCUMENTS_USER + user.uid).valueChanges();
      }
    });
  }

  byEmail(email: string) {
    return this.afd.list(Constants.PATH_DOCUMENTS_USER,
        ref => ref.orderByChild("email").equalTo(email)
      )
      .snapshotChanges()
      .map(changes => changes.map(c => ({ key: c.payload.key, values: c.payload.val() })))
      .map(changes => changes.map(c => (new User(c.values))));
  }

  getByEmail(name: string= undefined) {
    return (this.afd.list(Constants.PATH_DOCUMENTS_USER, ref => ref.orderByKey())).snapshotChanges()
      .map(changes => changes.map(c => ({ key: c.payload.key, values: c.payload.val() })))
      .map(items => (name && name.length > 0) ? this.filterByEmail(items, name) : items)
      ;
  }

  private filterByEmail(items: any[], name: string): any[]{
    return items.filter(item => {
      if(item.values.email && name) {
        return item.values.email.toLowerCase().indexOf(name.toLowerCase()) > -1;
      }
      return true;
    });
  }

}
