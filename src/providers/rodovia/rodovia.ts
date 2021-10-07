import { AngularFireDatabase } from 'angularfire2/database';
import { Constants } from '../../environments/constants';
import { Injectable } from '@angular/core';

@Injectable()
export class RodoviaProvider {

  constructor(public afd: AngularFireDatabase) {
  }

  listAcidentes(sre=undefined, rodovia=undefined) {
    return this.afd.list(Constants.PATH_DOCUMENTS_RODOVIA_ACIDENTES,
      ref => {
        // if(sre) {
        //   ref.orderByChild("sre").equalTo(sre);
        // } else 
        if(rodovia) {
          ref.orderByChild("ce").equalTo(rodovia);
        }

        return ref;
      })
      .snapshotChanges()
      .map(snapshot => snapshot.map(changes => {
          const val = changes.payload.val();

          return { key: val.id, values: val };
        }
      ));
  }

  listDefensas(sre=undefined, rodovia=undefined) {
    return this.afd.list(Constants.PATH_DOCUMENTS_RODOVIA_DEFENSAS,
      ref => {
        if(sre) {
          ref.orderByChild("sre").equalTo(sre);
        } else if(rodovia) {
          ref.orderByChild("ce").equalTo(rodovia);
        }

        return ref;
      })
      .snapshotChanges()
      .map(snapshot => snapshot.map(changes => {
          const val = changes.payload.val();

          return { key: val.id, values: val };
        }
      ));
  }

  listPorticos(sre=undefined, rodovia=undefined) {
    return this.afd.list(Constants.PATH_DOCUMENTS_RODOVIA_PORTICOS,
      ref => {
        if(sre) {
          ref.orderByChild("sre").equalTo(sre);
        } else if(rodovia) {
          ref.orderByChild("ce").equalTo(rodovia);
        }

        return ref;
      })
      .snapshotChanges()
      .map(snapshot => snapshot.map(changes => {
          const val = changes.payload.val();

          return { key: val.id, values: val };
        }
      ));
  }

  listSemiPorticos(sre=undefined, rodovia=undefined) {
    return this.afd.list(Constants.PATH_DOCUMENTS_RODOVIA_SEMIPORTICO,
      ref => {
        if(sre) {
          ref.orderByChild("sre").equalTo(sre);
        } else if(rodovia) {
          ref.orderByChild("ce").equalTo(rodovia);
        }

        return ref;
      })
      .snapshotChanges()
      .map(snapshot => snapshot.map(changes => {
          const val = changes.payload.val();

          return { key: val.id, values: val };
        }
      ));
  }

  listPontes(sre=undefined, rodovia=undefined) {
    return this.afd.list(Constants.PATH_DOCUMENTS_RODOVIA_PONTES,
      ref => {
        if(sre) {
          ref.orderByChild("sre").equalTo(sre);
        } else if(rodovia) {
          ref.orderByChild("ce").equalTo(rodovia);
        }

        return ref;
      })
      .snapshotChanges()
      .map(snapshot => snapshot.map(changes => {
          const val = changes.payload.val();

          return { key: val.id, values: val };
        }
      ));
  }

  listFotossensores(sre = undefined, rodovia = undefined) {
    return this.afd.list(Constants.PATH_DOCUMENTS_RODOVIA_FOTOSSENSORES,
      ref => {
        // if (sre) {
        //   ref.orderByChild("sre").equalTo(sre);
        // } else if (rodovia) {
        //   ref.orderByChild("ce").equalTo(rodovia);
        // }
        return ref;
      })
      .snapshotChanges()
      .map(snapshot => snapshot.map(changes => {
        const val = changes.payload.val();
        return { key: val.id, values: val };
      }
      ));
  }

  listFaixaDeDominio(sre = undefined, rodovia = undefined) {
    return this.afd.list(Constants.PATH_DOCUMENTS_RODOVIA_FAIXADEDOMINIO,
      ref => {
        // if (sre) {
        //   ref.orderByChild("sre").equalTo(sre);
        // } else if (rodovia) {
        //   ref.orderByChild("ce").equalTo(rodovia);
        // }
        return ref;
      })
      .snapshotChanges()
      .map(snapshot => snapshot.map(changes => {
        const val = changes.payload.val();
        return { key: val.id, values: val };
      }
      ));
  }

  listSRE() {
    return this.afd.list(Constants.PATH_DOCUMENTS_RODOVIA_SRE,
        ref => ref.orderByChild('id') 
      )
      .snapshotChanges()
      .map(snapshot => snapshot.map(changes => {
          const val = changes.payload.val();

          return { key: val.id, values: val };
        }
      ));
  }

  listExames() {
    return this.afd.list(Constants.PATH_DOCUMENTS_RODOVIA_EXAMES,
        ref => ref.orderByChild('id') 
      )
      .snapshotChanges()
      .map(snapshot => snapshot.map(changes => {
          const val = changes.payload.val();

          return { key: val.id, values: val };
        }
      ));
  }


  listSinHorizontal() {
    return this.afd.list(Constants.PATH_DOCUMENTS_RODOVIA_SINHORIZONTAL,
        ref => ref.orderByChild('gid') 
      )
      .snapshotChanges()
      .map(snapshot => snapshot.map(changes => {
          const val = changes.payload.val();

          return { key: val.id, values: val };
        }
      ));
  }
  listLimMunicipio() {
    return this.afd.list(Constants.PATH_DOCUMENTS_RODOVIA_LIMMUNICIPIO,
        ref => ref.orderByKey()
      )
      .snapshotChanges()
      .map(snapshot => snapshot.map(changes => {
          const val = changes.payload.val();

          return { key: val.id, values: val };
        }
      ));
  }
}