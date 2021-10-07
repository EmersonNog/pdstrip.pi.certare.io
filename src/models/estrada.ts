export class Estrada {
    id: string;  
    rodovia: string;  
    uf: string;
  
    constructor()
    constructor(obj: any)
    constructor(obj?: any) {
      if(obj && obj.id){
        this.id = obj && obj.id || '';
      } else{
        this.id = obj && obj.$key || '';
      }
  
      this.rodovia = obj && obj.rodovia || '';
      this.uf = obj && obj.uf || '';
    }
  
  }
  