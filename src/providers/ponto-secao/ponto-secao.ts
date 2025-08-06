import { AngularFirestore } from "angularfire2/firestore";
import { Injectable } from "@angular/core";

@Injectable()
export class PontoSecaoProvider {
  private readonly collectionPath = "pontoSecao";

  constructor(private afs: AngularFirestore) {}

  save(pontosSecao: any[]) {
    pontosSecao.forEach((pontoSecao) => {
      this.afs.collection(this.collectionPath).add(pontoSecao);
    });
  }
}
