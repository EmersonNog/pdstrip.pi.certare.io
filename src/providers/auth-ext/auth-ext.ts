import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHelperProvider } from '../http-helper/http-helper';

@Injectable()
export class AuthExtProvider {

  constructor(public httpHelperProvider: HttpHelperProvider, private http: HttpClient) {
  }

  validateToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {

      const _url: string = 'https://sistemas.detran.ce.gov.br/identidade/api/permissions-token/CERTARE';
      
      const _headers = { 
        'Accept': 'application/json',
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const requestBody = {
        "chaveAcesso": "da39a3ee5e6b4b0d3255bfef95601890afd80709"
      };

      const _url_cors = environment.middleware_cors;
      const _urlFull = (`${_url_cors}?url=${_url}&body=${encodeURI(JSON.stringify(requestBody))}&headers=${encodeURI(JSON.stringify(_headers))}&token=${token}`);

      console.log('** url server', _url);
      console.log('** url midd', _url_cors);
      console.log('** url full', _urlFull);
      console.log('_headers',_headers)
      console.log('requestBody',requestBody)

      // return new Promise<any>((resolve, reject) => {
        return this.httpHelperProvider.get(_urlFull)
        .then(response => {
          // console.log('response', response);
          resolve(response);
        }).catch(error => {
          // console.log('error', error);
          // reject({status: false, desc: 'Erro ao estabelecer uma comunicação com o servidor'});
          resolve({status: false, response: error});
        });
      // })

      // this.httpHelperProvider.post(url, {}, {}, httpOptions).then(response => {
      //   console.log('response', response);
      //   if (response.erro) {
      //     resolve(null)
      //   } else {
      //     resolve(response);
      //   }
      // });
    })
  }


}
