import { Injectable } from '@angular/core';
import { Constants } from '../../environments/constants';
import { AngularFirestore } from "angularfire2/firestore";
// import { Sre } from '../../models/sre';
import { Sre } from '../../models/sre';

@Injectable()
export class SreProvider {

  constructor(public afd: AngularFirestore) {
  }

  list(ano?: number) {
    return this.afd.collection<Sre>(Constants.PATH_DOCUMENTS_SRE,
        ref => ref
                // .where('ano', '==', ano)
                // .orderBy('numero')
      )
      .snapshotChanges()
      .map(actions => actions.map(_data => {
        const data = _data.payload.doc.data();
        const id = _data.payload.doc.id;

        const obj = { id, ...data };
        return new Sre(obj);
      }));
  }

  save(arr: any[]) {
    arr.forEach((item, idx) => {
      console.log('enviando arquivo ' + idx);
      const id = this.afd.createId();
      item.id = id;
      this.afd.doc(Constants.PATH_DOCUMENTS_SRE + item.id).set(JSON.parse(JSON.stringify(item)));
    })
  }

}
