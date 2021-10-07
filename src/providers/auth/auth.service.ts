import { Constants } from './../../environments/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserService } from '../user/user.service';
import * as firebase from "firebase";
import {User} from "../../models/user";

@Injectable()
export class AuthService {

  user: firebase.User;

  constructor(public afa: AngularFireAuth, public http: HttpClient, public userService: UserService) {
    this.afa.authState.subscribe(user => {this.user = user})
  }

  createUserAuth(email: string, password: string, user): Promise<any> {
    user.status = false;
    user.devices = null;
    user.profile = 'user';
    // delete user.password;

    return new Promise<any> ((resolve, reject) => {
      this.afa.auth.createUserWithEmailAndPassword(email, password)
        .then(authState => {

          user.id = authState.uid;
          let _user = new User(user);

          this.userService.saveUser(_user);

          this.sendMail(_user)
            .then(_ => resolve(user))
            .catch(error => resolve(user));
            // .catch(error => reject('Erro ao enviar email'));

        }).catch(error => {
          console.log(error);
          
          if(error && error.code === 'auth/email-already-in-use') {
            this.userService.getByEmail(email).take(1).subscribe(_data => {

              if(_data && _data.length > 0 && _data[0].key !== undefined) {
                reject('O endereço de e-mail já está sendo usado por outra conta');

              } else {

                this.afa.auth.signInWithEmailAndPassword(email, password)
                  .then((userTmp) => {
                    if(userTmp != null && userTmp.uid != null) {
                      user.id = userTmp.uid;
                      let _user = new User(user);
                      // console.log('save', _user)
                
                      this.userService.saveUser(_user);
      
                      this.sendMail(_user)
                        .then(_ => resolve(user))
                        .catch(error => resolve(user));
                    }
                  });
              }
            });

            // reject('O endereço de e-mail já está sendo usado por outra conta');
          } else {
            reject('Erro ao realizar o cadastro! Atualize a página e tente novamente.');
          }
          
        });
    });
  }

  login(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afa.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        if(user != null && user.uid != null) {
          const uid = user.uid;
          
          this.userService.byId(user.uid).take(1).subscribe((user: User) => {
            if(user && user.status) {
              this.afa.authState.subscribe(user => this.user = user);
              this.userService.saveUserLocal(uid);
              resolve({ logged: user });
            } else {
              resolve({ logged: false })
            }
          });
        }
      })
      .catch(err => reject(err));
    });
  }

  loginWithToken(email: string, token: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // this.afa.auth.signInAnonymously()
      // this.afa.auth.signInWithCustomToken(token)
      // .then((user) => {
        // if(user != null && user.uid != null) {
        //   const uid = user.uid;
        //   console.log('user sign', user);
          
          this.userService.byEmail(email).take(1).subscribe((users: User[]) => {
            const _user = (users && users.length > 0) ? users[0] : undefined;
            console.log('user by email', _user);

            if(_user && _user.status) {
              this.afa.authState.subscribe(user => this.user = user);
              this.userService.saveUserLocal(_user.id);
              resolve({ logged: _user });
            } else {
              resolve({ logged: false })
            }
          });
      //   }
      // })
      // .catch(err => reject(err));
    });
  }

  logout() {
    return this.afa.auth.signOut();
  }

  sendPasswordResetEmail(email: string): Promise<any>{
    return this.afa.auth.sendPasswordResetEmail(email);
  }

  get authenticated(): boolean {
    return this.user != null;
  }

  getId() {
    return this.user && this.user.uid;
  }

  sendMail(_user: any): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    };

    return new Promise<any>((resolve, reject) => {
      this.http.get(`${Constants.BASE_URL_FIREBASE_FUNCTIONS}/sendEmail?data=${JSON.stringify(_user)}`, httpOptions)
        .toPromise()  
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

}
