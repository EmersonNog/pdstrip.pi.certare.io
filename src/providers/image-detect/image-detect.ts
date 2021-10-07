import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class ImageDetectProvider {

  constructor(public afd: AngularFireDatabase, private storage: AngularFireStorage) {
  }

  getImagensStorage(levantamentoID: string, typeFolder: string, filename: string): Promise<any>{
    let url;

    if(typeFolder == undefined) {
      url = `${levantamentoID}/${filename}`;

    } else {
      url = `${levantamentoID}/${typeFolder}/${filename}`;

    }
    console.log('url', url);
    
    return new Promise<any> ((resolve, reject) => {
      this.storage.ref(url).getDownloadURL().take(1).subscribe(data => {
        resolve(data);
      }, error => reject(error));
    });
  }

}
