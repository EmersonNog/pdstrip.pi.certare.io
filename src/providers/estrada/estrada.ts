import { Injectable } from '@angular/core';
import { Constants } from '../../environments/constants';
import { AngularFirestore } from "angularfire2/firestore";
import { Estrada } from '../../models/estrada';

@Injectable()
export class EstradaProvider {

  constructor(public afd: AngularFirestore) {
  }

  list(ano?: number) {
    return this.afd.collection<Estrada>(Constants.PATH_DOCUMENTS_ESTRADAS,
        ref => ref
                // .where('ano', '==', ano)
                // .orderBy('numero')
      )
      .snapshotChanges()
      .map(actions => actions.map(_data => {
        const data = _data.payload.doc.data();
        const id = _data.payload.doc.id;

        const obj = { id, ...data };
        return new Estrada(obj);
      }));
  }

  save(arr: any[]) {
    arr.forEach((item, idx) => {
      console.log('enviando arquivo ' + idx);
      const id = this.afd.createId();
      item.id = id;
      this.afd.doc(Constants.PATH_DOCUMENTS_ESTRADAS + item.id).set(JSON.parse(JSON.stringify(item)));
    })
  }

}
