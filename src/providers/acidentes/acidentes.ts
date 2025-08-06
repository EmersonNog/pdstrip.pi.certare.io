import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";

@Injectable()
export class AcidentesProvider {
  private readonly collectionPath = "acidentes"; // caminho no Firestore

  constructor(private afs: AngularFirestore) {}

  save(acidentes: any[]) {
    acidentes.forEach((acidente) => {
      this.afs.collection(this.collectionPath).add(acidente);
    });
  }
}
