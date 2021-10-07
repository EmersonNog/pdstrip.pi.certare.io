export class DateUtil {

  public static getFromID(levantamentoID: string) : Date {
    if(levantamentoID.startsWith('CE')) {
      let split = levantamentoID.split('_');
      const data = split[1];
      const hora = split[2];
  
      const dia = data.substring(0, 2);
      const mes = data.substring(2, 4);
      const ano = data.substring(4);
  
      const hh = hora.substring(0, 2);
      const mm = hora.substring(2, 4);
      const ss = hora.substring(4);
  
      let dt = new Date();
      dt.setDate(parseInt(dia));
      dt.setMonth(parseInt(mes)-1);
      dt.setFullYear(parseInt(ano));
      dt.setHours(parseInt(hh));
      dt.setHours(parseInt(mm));
      dt.setHours(parseInt(ss));

      return dt;
    }

    return new Date();
  }

  public static formatDate(date: string) : string {
    if(date){
      let dateRoute = date.substring(0, date.indexOf('_'));
      // dateRoute = dateRoute.replace('-', '.').replace('-', '.');
      
      const split = dateRoute.split('-');

      let year = split[0];
      let month = DateUtil.putZero(split[1]);
      let day = DateUtil.putZero(split[2]);
      
      return day + "/" + month + "/" + year;
    }
    return '';
  }

  public static formatHour(date: string) : string {
    if(date){
      let hourRoute = date.substring(date.indexOf('_') + 1);
      return hourRoute.replace('-', ':').replace('-', ':');
    }
    return '';
  }

  public static formatDateForID(date: Date) {
    let day, month, year, hours, minutes, seconds;

    if (date.getMonth() < 9) {
      month = "0" + (date.getMonth() + 1);
    } else {
      month = "" + (date.getMonth() + 1);
    }

    if (date.getDate() < 10) {
      day = "0" + date.getDate();
    } else {
      day = date.getDate();
    }

    if (date.getHours() < 10) {
      hours = "0" + date.getHours();
    } else {
      hours = date.getHours();
    }

    if (date.getMinutes() < 10) {
      minutes = "0" + date.getMinutes();
    } else {
      minutes = date.getMinutes();
    }

    if (date.getSeconds() < 10) {
      seconds = "0" + date.getSeconds();
    } else {
      seconds = date.getSeconds();
    }

    year = date.getFullYear();

    return day + "" + month + "" + year + "_" + hours + "" + minutes + "" + seconds;
  }

  public static isValidDate(dateObject: Date){ 
    return dateObject.toString() !== 'Invalid Date'; 
  }

  public static parseDateForEXPIRATION(expirationDate: string) {
    if(expirationDate) {
      const splited = expirationDate.split('_');
      const s_dt = splited[0];
      const s_hr = splited[1];
      
      const splitedDt = s_dt.split('-');
      const splitedHr = s_hr.split('-');

      const year = parseInt(splitedDt[0]);
      const month = parseInt(splitedDt[1])-1;
      const day = parseInt(splitedDt[2]);
      const hour = parseInt(splitedHr[0]);
      const min = parseInt(splitedHr[1]);
      const sec = parseInt(splitedHr[2]);

      let dt = new Date(year, month, day , hour, min, sec);
      const isValid = this.isValidDate(dt);
      
      if(!isValid) { // se a data for invalida
        dt = new Date(0); // define como uma data do ano de 1969
        // console.log(isValid, dt);
      }

      return dt;
    }

    return undefined;
  }

  public static formatDateForEXPIRATION(date: Date) {
    let day, month, year, hours, minutes, seconds;

    if (date.getMonth() < 9) {
      month = "0" + (date.getMonth() + 1);
    } else {
      month = "" + (date.getMonth() + 1);
    }

    if (date.getDate() < 10) {
      day = "0" + date.getDate();
    } else {
      day = date.getDate();
    }

    hours = date.getHours();
    let timezoneOffset = date.getTimezoneOffset()/60;
    hours += timezoneOffset;

    if (hours < 10) {
      hours = "0" + hours;
    }

    if (date.getMinutes() < 10) {
      minutes = "0" + date.getMinutes();
    } else {
      minutes = date.getMinutes();
    }

    if (date.getSeconds() < 10) {
      seconds = "0" + date.getSeconds();
    } else {
      seconds = date.getSeconds();
    }

    year = date.getFullYear();

    return year + '-' + month + '-' + day + '_' + hours + '-' + minutes + '-' + seconds;
  }

  public static formatDateWithHour(date: string) : string {
    return this.formatDate(date) + " " + this.formatHour(date);
  }

  public static formatDateAbstract(date: string) {
    const split = date.split('-');

    let year = split[0];
    let month = DateUtil.putZero(split[1]);
    let day = DateUtil.putZero(split[2]);

    return day + "/" + month + "/" + year;
  }

  public static putZero(value: string) {
    if(parseInt(value) < 10 && value.charAt(0) !== '0'){
      return '0'+value;
    }
    return value;
  }

  public static toArray(obj) {
    let array = [];

    if(obj) {
      Object.keys(obj).forEach(key => {
        obj[key].key = key;
        array.push(obj[key]);
      });
    }
    return array;
  }

  public static getColorByIRI(iri: number, classificacaoObj: any, classificacaoTipo='HDM4', classificacaoSayers='PAVIMENTO_NOVO'): any {
    // const iri = parseFloat(iriStr);
    // console.log('classificacaoTipo', classificacaoTipo);
    // console.log('classificacaoObj', classificacaoObj);
    let classificacaoAtual = {desc: 'Erro', cor: '#000000'};
    
    if(classificacaoObj){
      if(classificacaoTipo === 'HDM4'){

        Object.keys(classificacaoObj).forEach(key => {
          let split = key.split('_');
          let iniStr = split[0];
          let fimStr = split[1];

          if(DateUtil.isNumeric(iniStr) && DateUtil.isNumeric(fimStr)){
            const ini = parseInt(iniStr);
            const fim = parseInt(fimStr);
            if(iri > ini && iri <= fim)
              classificacaoAtual = classificacaoObj[key];

          } else if(DateUtil.isNumeric(iniStr) && !DateUtil.isNumeric(fimStr)){
            const ini = parseInt(iniStr);
            if(iri > ini)
              classificacaoAtual = classificacaoObj[key];

          } else if(!DateUtil.isNumeric(iniStr) && DateUtil.isNumeric(fimStr)){
            const fim = parseInt(fimStr);
            if(iri <= fim)
              classificacaoAtual = classificacaoObj[key];

          }
        });

      } else{

        Object.keys(classificacaoObj).forEach(pavimentoKey => {
          const pavimentoObj = classificacaoObj[pavimentoKey];
          
          if(pavimentoKey === classificacaoSayers){
            // console.log('pavimentoObj', pavimentoObj);

            Object.keys(pavimentoObj).forEach(key => {
              // console.log('key', key);
              let split = key.split('_');
              let iniStr = split[0];
              let fimStr = split[1];

              iniStr = iniStr.includes(',') ? iniStr.split(',').join('.') : iniStr;
              fimStr = fimStr.includes(',') ? fimStr.split(',').join('.') : fimStr;

              // console.log('key', iniStr + ' | ' + fimStr);

              if(DateUtil.isNumeric(iniStr) && DateUtil.isNumeric(fimStr)){
                const ini = parseInt(iniStr);
                const fim = parseInt(fimStr);
                if(iri > ini && iri <= fim)
                  classificacaoAtual = pavimentoObj[key];

              } else if(DateUtil.isNumeric(iniStr) && !DateUtil.isNumeric(fimStr)){
                const ini = parseInt(iniStr);
                if(iri > ini)
                  classificacaoAtual = pavimentoObj[key];

              } else if(!DateUtil.isNumeric(iniStr) && DateUtil.isNumeric(fimStr)){
                const fim = parseInt(fimStr);
                if(iri <= fim)
                  classificacaoAtual = pavimentoObj[key];

              }
            });
          }
        });
      }
    }

    return classificacaoAtual;
  }

  public static isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  public static formatDateToStr(date: Date) {
    let day, month, year;

    if (date.getMonth() < 9) {
      month = "0" + (date.getMonth() + 1);
    } else {
      month = "" + (date.getMonth() + 1);
    }

    if (date.getDate() < 10) {
      day = "0" + date.getDate();
    } else {
      day = date.getDate();
    }

    year = date.getFullYear();

    return day + "/" + month + "/" + year;
  }

  public static formatHoraToStr(date: Date) {
    let hours, minutes, seconds;

    if (date.getHours() < 10) {
      hours = "0" + date.getHours();
    } else {
      hours = date.getHours();
    }

    if (date.getMinutes() < 10) {
      minutes = "0" + date.getMinutes();
    } else {
      minutes = date.getMinutes();
    }

    if (date.getSeconds() < 10) {
      seconds = "0" + date.getSeconds();
    } else {
      seconds = date.getSeconds();
    }

    return hours + ":" + minutes + ":" + seconds;
  }

  static getNumberFormatted(value:number, digits=2) {
    return value.toLocaleString('pt', {minimumFractionDigits: digits,maximumFractionDigits: digits})
  }

}
