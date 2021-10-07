import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { Platform } from 'ionic-angular';

@Injectable()
export class HttpHelperProvider {

  constructor(
    private httpClient: HttpClient,
    private httpNative: HTTP,
    public platform: Platform,
  ) {
  }

  get(url: string, urlParams: any = {}, headers: any = {}, showLoading: boolean = true): Promise<any> {
    if (this.platform.is('ios')) {
      // return this.getNative(url, requestBody, auth, _headers);
      return this.getNative(url, urlParams, headers, showLoading);
    } else {
      return this.getAngular(url, urlParams, headers, showLoading);
    }
  }

  post(url: string, urlParams: any = {}, data: any = {}, headers: any = {}, showLoading: boolean = true): Promise<any> {
    if (this.platform.is('ios')) {
      return this.postNative(url, urlParams, data, headers, showLoading);
    } else {
      return this.postAngular(url, urlParams, data, headers, showLoading);
    }
  }

  private getNative(url: string, urlParams: any = {}, headers: any = {}, showLoading: boolean = true): Promise<any> {
    
    return new Promise((resolve, reject) => {
      // this.httpNative.setRequestTimeout(15);
      // this.httpNative.setDataSerializer('utf8');
      this.httpNative.get(url, urlParams, headers).then(response => {
          console.log(response); // data received by server
          if (showLoading) {
            //this.dialogHelperProvider.hideLoading();
          }
          const _data = response.data;
          const data = (_data && HttpHelperProvider.isString(_data)) ? JSON.parse(_data) : _data;
          resolve(data)
        }).catch(error => {
          console.log(error);
          if (showLoading) {
            //this.dialogHelperProvider.hideLoading();
          }
          reject(error)
        });
    });
  }

  private getAngular(url: string, urlParams: any = {}, headers: any = {}, showLoading: boolean = true): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.httpClient.get(url, { headers: headers }).toPromise().then(response => {
        resolve({status: true, response: response});
      }).catch(error => {
        console.log(error)
        // reject(error)
        resolve({status: false, response: error});
      })
    })
  }

  private postNative(url: string, urlParams: any = {}, data: any = {}, headers: any = {}, showLoading: boolean = true): Promise<any> {
    
    return new Promise((resolve, reject) => {
      // this.httpNative.setRequestTimeout(15);
      this.httpNative.setDataSerializer('json');
      this.httpNative.post(url, data, {"Content-Type": "application/json"}).then(response => {
          if (showLoading) {
            //this.dialogHelperProvider.hideLoading();
          }
          const _data = response.data;
          const data = (_data && HttpHelperProvider.isString(_data) && HttpHelperProvider.isJsonObj(_data)) ? JSON.parse(_data) : _data;
          resolve(data)
        }).catch(error => {
          if (showLoading) {
            //this.dialogHelperProvider.hideLoading();
          }
          reject(error)
        });
    });
  }
  
  private postAngular(url: string, urlParams: any = {}, data: any = {}, headers: any = {}, showLoading: boolean = true): Promise<any> {
    return new Promise((resolve, reject) => {
      if (showLoading) {
        //this.dialogHelperProvider.showLoading();
      }
      this.httpClient.post(url, data, { headers: headers }).toPromise().then(response => {
        if (showLoading) {
          //this.dialogHelperProvider.hideLoading();
        }
        resolve(response)
      }).catch(error => {
        if (showLoading) {
          //this.dialogHelperProvider.hideLoading();
        }
        reject(error)
      })
    })
  }

  public static isString (value) {
    return typeof value === 'string' || value instanceof String;
  }

  public static isJsonObj (value: string) {
    return value.startsWith('{');
  }

}
