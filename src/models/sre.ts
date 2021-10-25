export class Sre {

    id: string;
    codigo: string; // 257ECE0290S0
    rodovia: string; // 257
    jurisdicao: string; // E - estadual
    uf: string; // CE - unidade federativa
    segmento: string; // 0290 - trecho/segmento
    tipo_pista: string; // S | D | E - tipo de pista (simples, direita, esquerda)
    valor: number; // 0 - nao sei o que significa FIXME

    inicio_desc: string;
    fim_desc: string;
    inicio_km: number;
    fim_km: number;
    ext_km: number;
    ext_estatistica: number;
    status_pavimentacao: string;
    sit_fisica: string;
    tipo_revest: string;
    coinc_estadual: string;
    coinc_federal: string;
    trecho_coinc: string;
    federal_superposta: string;
    distrito_op: string;
  
    constructor()
    constructor(obj: any)
    constructor(obj?: any) {
      if(obj && obj.id){
        this.id = obj && obj.id || '';
      } else{
        this.id = obj && obj.$key || '';
      }
  
      this.codigo = obj && obj.codigo || '';
      this.rodovia = obj && obj.rodovia || '';
      this.jurisdicao = obj && obj.jurisdicao || '';
      this.uf = obj && obj.uf || '';
      this.segmento = obj && obj.segmento || '';
      this.tipo_pista = obj && obj.tipo_pista || '';
      this.valor = obj && obj.valor || 0;

      this.inicio_desc = obj && obj.inicio_desc || '';
      this.fim_desc = obj && obj.fim_desc || '';
      this.inicio_km = obj && obj.inicio_km || 0.0;
      this.fim_km = obj && obj.fim_km || 0.0;
      this.ext_km = obj && obj.ext_km || 0.0;
      this.ext_estatistica = obj && obj.ext_estatistica || 0.0;
      this.status_pavimentacao = obj && obj.status_pavimentacao || '';
      this.sit_fisica = obj && obj.sit_fisica || '';
      this.tipo_revest = obj && obj.tipo_revest || '';
      this.coinc_estadual = obj && obj.coinc_estadual || '';
      this.coinc_federal = obj && obj.coinc_federal || '';
      this.trecho_coinc = obj && obj.trecho_coinc || '';
      this.federal_superposta = obj && obj.federal_superposta || '';
      this.distrito_op = obj && obj.distrito_op || '';
    }

    static criaObj(codigoSRE: string): Sre {
      let codigoSREOri = '';
        
      if(codigoSRE.length >= 12) {

          if(codigoSRE.startsWith("SRE")) {
            codigoSREOri = codigoSRE; 
            codigoSRE = codigoSRE.substring(3, 15);
          } else {
            codigoSREOri = 'SRE' + codigoSRE; 
          }

          let obj = new Sre();
          obj.id = codigoSREOri;
          obj.codigo = codigoSRE;
          obj.rodovia = codigoSRE.substring(0, 3);
          obj.jurisdicao = codigoSRE.substring(3, 4);
          obj.uf = codigoSRE.substring(4, 6);
          obj.segmento = codigoSRE.substring(6, 10);
          obj.tipo_pista = codigoSRE.substring(10, 11);
          obj.valor = parseInt(codigoSRE.substring(11, 12));
          
          // console.log(obj)
          
          return obj;
      } else {
          console.error('Tamanho inválido! O código de SRE deve ter 12 carecteres: ' + codigoSRE + ' [' + codigoSRE.length + ']');
      }

      return undefined;
    }
  
  }
  