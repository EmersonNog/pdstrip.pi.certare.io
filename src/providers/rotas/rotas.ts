import { AngularFirestore } from "angularfire2/firestore";
import { Injectable } from "@angular/core";

@Injectable()
export class RotasProvider {
  private readonly collectionPath = "rotas";

  constructor(private afs: AngularFirestore) {}

  async save(rotas: any[]) {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < rotas.length; i++) {
      await this.afs.collection(this.collectionPath).add(rotas[i]);
      if (i % 10 === 0) {
        // a cada 10 gravações, espera 1 segundo
        await delay(3000);
      }
    }
  }
}
